// @ts-nocheck
import { useLayoutEffect, useRef } from "react";
import * as d3 from "d3";

export const Graph = ({ data, selectedNode, handleSelectNode, deg1 }) => {
  const containerRef = useRef(null);

  const config = useLayoutEffect(() => {
    if (containerRef) {
      let chart = ForceGraph(data, {
        nodeId: (d) => d.id,
        nodeGroup: (d) => d.count,
        nodeTitle: (d) => `${d.id}\nFollowed by ${d.count}`,
        nodeStrength: -200,
        linkStrokeWidth: (l) => Math.sqrt(l.value),
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        selectedNode,
        handleSelectNode,
        deg1,
        invalidation: new Promise((resolve, reject) => {
          console.log("invalidation()");
          setTimeout(() => {
            resolve("foo");
          }, 300);
        }), // a promise to stop the simulation when the cell is re-run
      });
    }

    function ForceGraph(
      { nodes, links },
      {
        nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 1.5, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 5, // node radius, in pixels
        nodeStrength,
        linkSource = ({ source }) => {
          // console.log("source", source);
          return source;
        }, // given d in links, returns a node identifier string
        linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
        linkStroke = "#999", // link stroke color
        linkStrokeOpacity = 0.1, // link stroke opacity
        linkStrokeWidth = 0.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation, // when this promise resolves, stop the simulation

        handleSelectNode,
        selectedNode,
        deg1,
        emitNode = (d) => {
          d.id;
        },
      } = {}
    ) {
      // Compute values.
      const NODES = d3.map(nodes, nodeId).map(intern);
      // console.log("NODES");
      // console.table(NODES);
      // const LINKS_SOURCE = d3.map(links, linkSource).map(intern);
      // console.log("LINK_SOURCE");
      // console.table(LINKS_SOURCE?.slice(0, 20));
      // const LINKS_TARGET = d3.map(links, linkTarget).map(intern);
      // console.log("LINK_TARGET");
      // console.table(LINKS_TARGET?.slice(0, 20));

      function intern(value) {
        return value !== null && typeof value === "object"
          ? value.valueOf()
          : value;
      }

      if (nodeTitle === undefined) nodeTitle = (_, i) => NODES[i];
      const NODE_TITLE = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const NODE_GROUP =
        nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const STROKE_WIDTH =
        typeof linkStrokeWidth !== "function"
          ? null
          : d3.map(links, linkStrokeWidth);
      const L =
        typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // console.log("NODE_TITLE");
      // console.table(NODE_TITLE?.slice(0, 20));
      // console.log("NODE_GROUP");
      // console.table(NODE_GROUP?.slice(0, 20));
      // console.log("STROKE_WIDTH");
      // console.table(STROKE_WIDTH?.slice(0, 20));
      // console.log("L");
      // console.table(L?.slice(0, 20));

      // Compute default domains.
      if (NODE_GROUP && nodeGroups === undefined)
        nodeGroups = d3.sort(NODE_GROUP);

      // Construct the scales.
      const color =
        nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

      // ============================================
      // Construct the forces.
      // ============================================
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i }) => NODES[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(forceLink);

      const simulation = d3
        .forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
        .on("tick", ticked);

      // ============================================
      // Draw
      // ============================================
      const svg = d3
        .select(containerRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      svg.selectAll("*").remove();

      // Per-type markers, as they don't inherit styles.
      // svg
      //   .append("defs")
      //   .append("marker")
      //   .attrs({
      //     id: "arrowhead",
      //     viewBox: "-0 -5 10 10",
      //     refX: 13,
      //     refY: 0,
      //     orient: "auto",
      //     markerWidth: 13,
      //     markerHeight: 13,
      //     xoverflow: "visible",
      //   })
      //   .append("svg:path")
      //   .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      //   .attr("fill", "#999")
      //   .style("stroke", "none");

      const link = svg
        .append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr(
          "stroke-width",
          typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
        )
        .attr("stroke-linecap", linkStrokeLinecap)
        .selectAll("line")
        .data(links)
        .join("line");
      // .attr("marker-end", "url(#arrowhead)");

      const node = svg
        .append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => d.count / 10 + nodeRadius)
        // .attr("r", (d) => 1)
        .attr("fill", (d) => (d.id === selectedNode ? "cyan" : nodeFill))
        .call(drag(simulation))
        .on("mouseenter", (evt, d) => {
          const myFollows = data.links
            .filter((el) => el.source.id === d.id)
            .reduce((acc, i) => {
              let res = acc.findIndex((el) => el.target.id === i.target.id);
              if (res === -1) {
                acc.push(i);
              }
              return acc;
            }, [])
            .sort((a, b) => b.target.count - a.target.count);

          // const myFollowers = graph.links
          //   .filter((e) => e.target.id === selectedNode)
          //   .reduce((acc, i) => {
          //     let res = acc.findIndex((el) => el.source.id === i.source.id);
          //     if (res === -1) {
          //       acc.push(i);
          //     }
          //     return acc;
          //   }, [])
          //   .sort((a, b) => b.source.count - a.source.count);

          console.log("myFollows", myFollows);

          // HIGHLIGHT HOVERED NODE
          node
            .filter((n) => (n.id === d.id ? true : false))
            .attr("stroke-width", 3);

          // HIGHLIGHT HOVERED NODE
          node
            .attr("opacity", "0.1")
            .filter((n) => {
              if (n.id === d.id) return true;
              if (deg1) {
                return deg1.includes(n.id);
              }
              return true;
            })
            .attr("opacity", "1");

          handleSelectNode(d.id);

          link
            .attr("display", "none")
            .filter((l) => {
              return l.source.id === d.id || l.target.id === d.id;
            })
            .attr("display", "block")
            .attr("stroke-opacity", 1);
        })
        .on("mouseleave", (evt) => {
          link
            .attr("display", "block")
            .attr("stroke-opacity", linkStrokeOpacity);

          node
            .attr("stroke", nodeFill)
            .attr("stroke-width", nodeStrokeWidth)
            .attr("opacity", "1");
        });

      if (STROKE_WIDTH)
        link.attr("stroke-width", ({ index: i }) => STROKE_WIDTH[i]);
      if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (NODE_GROUP) node.attr("fill", ({ index: i }) => color(NODE_GROUP[i]));
      if (NODE_TITLE)
        node.append("title").text(({ index: i }) => NODE_TITLE[i]);

      node
        .append("text")
        .text((d) => d.id)
        .style("fill", "#000")
        .style("font-size", "12px")
        .attr("x", 6)
        .attr("y", 3);

      if (invalidation != null) invalidation.then(() => simulation.stop());

      // ============================================
      // ANIMATE
      // ============================================
      function ticked() {
        // console.log(`ticked() ${simulation.alpha()}`);
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      }

      function drag(simulation) {
        function dragstarted(event) {
          console.log("event", event);
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      return Object.assign(svg.node(), { scales: { color } });
    }
  }, [containerRef, data]);
  // selectedNode, deg1

  return (
    <div
      id="graph"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <svg
        width="100%"
        height="100%"
        ref={containerRef}
        style={{ border: "1px solid black" }}
      >
        <g transform="translate(0, 0)" />
      </svg>
    </div>
  );
};
