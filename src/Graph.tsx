// @ts-nocheck
import { useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";

export const Graph = ({ data, selectedNode, handleSelectNode, deg1 }) => {
  const containerRef = useRef(null);

  function handleEvent(id) {
    handleSelectNode(id);
  }

  useLayoutEffect(() => {
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

        linkSource = ({ source }) => source, // given d in links, returns a node identifier string
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
      } = {}
    ) {
      // Compute values.
      const N = d3.map(nodes, nodeId).map(intern);
      const LS = d3.map(links, linkSource).map(intern);
      const LT = d3.map(links, linkTarget).map(intern);

      function intern(value) {
        return value !== null && typeof value === "object"
          ? value.valueOf()
          : value;
      }

      if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
      const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
      const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
      const W =
        typeof linkStrokeWidth !== "function"
          ? null
          : d3.map(links, linkStrokeWidth);
      const L =
        typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

      // Replace the input nodes and links with mutable objects for the simulation.
      let nodesMut = d3.map(nodes, (_, i) => ({ id: N[i] }));
      let linksMut = d3.map(links, (_, i) => ({
        source: LS[i],
        target: LT[i],
      }));

      // Compute default domains.
      if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

      // Construct the scales.
      const color =
        nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

      // Construct the forces.
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
      if (linkStrength !== undefined) forceLink.strength(linkStrength);

      const simulation = d3
        .forceSimulation(nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter())
        .on("tick", ticked);

      const svg = d3
        .select(containerRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      svg.selectAll("*").remove();

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

      const node = svg
        .append("g")
        .attr("fill", nodeFill)
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => d.count / 2 + nodeRadius)
        .attr("fill", (d) => (d.id === selectedNode ? "cyan" : nodeFill))
        .call(drag(simulation))
        .on("mouseenter", (evt, d) => {
          if (!selectedNode || selectedNode !== d.id) return;
          link
            .attr("display", "none")
            .filter((l) => {
              return l.source.id === d.id || l.target.id === d.id;
            })
            .attr("display", "block");
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
        })
        .on("mouseleave", (evt) => {
          link.attr("display", "block");
          node.attr("opacity", "1");
        });

      if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
      if (L) link.attr("stroke", ({ index: i }) => L[i]);
      if (G) node.attr("fill", ({ index: i }) => color(G[i]));
      if (T) node.append("title").text(({ index: i }) => T[i]);
      if (invalidation != null) invalidation.then(() => simulation.stop());

      function ticked() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      }

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          console.log("event.subject:   ", event.subject);
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
          handleSelectNode(event.subject.id);
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          // console.log("dragended()");
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
  }, [containerRef, data, selectedNode, deg1]);

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
