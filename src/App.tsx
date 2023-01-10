// @ts-nocheck
import { useEffect, useState } from "react";
import { Graph } from "./Graph";
import { Sidebar } from "./Sidebar";
import { linksFromData, nodesFromLinks } from "./utils";

// https://betterprogramming.pub/5-steps-to-render-d3-js-with-react-functional-components-fcce6cec1411
function App() {
  // Data
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [profiles, setProfiles] = useState({});

  // Selected Node
  const [selectedNode, setSelectedNode] = useState();
  const [followedBy, setFollowedBy] = useState();
  const [following, setFollowing] = useState();
  const [deg1, setDeg1] = useState([]);

  useEffect(() => {
    fetchData();
    async function fetchData() {
      let profiles = await (await fetch("/profiles.json")).json();
      setProfiles(profiles);
      let data = await (await fetch("/graph.json")).json();
      let links = linksFromData(data);
      let nodes = nodesFromLinks(links);
      setGraph({ nodes, links });
    }
  }, []);

  useEffect(() => {
    console.log("==================================================");
    console.log("==================================================");
    console.log("==================================================");
    console.log("new selectedNode: ", selectedNode);

    if (selectedNode) {
      console.log("graph.nodes");
      console.table(graph.nodes.slice(0, 10));
      console.log("graph.links");
      console.log(graph.links.slice(0, 10));
      // graph.links.slice(0, 10).forEach((l) => console.log(l.source, l.target));

      const myFollows = graph.links
        .filter((el) => el.source.id === selectedNode)
        .reduce((acc, i) => {
          let res = acc.findIndex((el) => el.target.id === i.target.id);
          if (res === -1) {
            acc.push(i);
          }
          return acc;
        }, [])
        .sort((a, b) => b.target.count - a.target.count);

      const myFollowers = graph.links
        .filter((e) => e.target.id === selectedNode)
        .reduce((acc, i) => {
          let res = acc.findIndex((el) => el.source.id === i.source.id);
          if (res === -1) {
            acc.push(i);
          }
          return acc;
        }, [])
        .sort((a, b) => b.source.count - a.source.count);
      setFollowedBy(myFollowers);
      setFollowing(myFollows);

      // First degree nodes
      let d1 = [
        ...myFollowers.map((el) => el.source.id),
        ...myFollows.map((el) => el.target.id),
      ].filter((v, i, a) => a.indexOf(v) === i);

      setDeg1(d1);
    }
  }, [selectedNode]);

  return (
    <div className="App">
      {graph.nodes.length !== 0 ? (
        <Graph
          data={graph}
          selectedNode={selectedNode}
          handleSelectNode={setSelectedNode}
          deg1={deg1}
        />
      ) : null}
      <Sidebar
        selectedNode={selectedNode}
        profiles={profiles}
        followedBy={followedBy}
        following={following}
      ></Sidebar>
    </div>
  );
}

export default App;
