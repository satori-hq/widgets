// @ts-nocheck
import { useEffect, useState } from "react";
import { Graph } from "./Graph";
import { Sidebar } from "./Sidebar";
// https://betterprogramming.pub/5-steps-to-render-d3-js-with-react-functional-components-fcce6cec1411
function App() {
  // Data
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [profiles, setProfiles] = useState({});

  // Selected Node
  const [selectedNode, setSelectedNode] = useState();
  const [followedBy, setFollowedBy] = useState();
  const [following, setFollowing] = useState();

  // Highlighted Node
  const [highlightedNode, setHighlightedNode] = useState();

  useEffect(() => {
    fetchData();
    async function fetchData() {
      let resP = await fetch("/profiles.json");
      let dataP = await resP.json();
      setProfiles(dataP);

      let res = await fetch("/graph.json");
      let data = await res.json();

      let links = data.map((g) => ({
        source: g.accountId, // follower
        target: g.value.accountId, // followed
        blockHeight: g.blockHeight,
      }));

      let nodes = links
        .reduce((acc, i) => {
          // add sources
          let res = acc.findIndex((el) => el.id === i.target);

          if (res === -1) {
            acc.push({ id: i.target, count: 1 });
          } else {
            let el = {
              id: i.target,
              count: acc[res].count + 1,
            };
            acc[res] = el;
          }

          // add targets
          let followerResult = acc.findIndex((el) => el.id === i.source);
          if (followerResult === -1) {
            acc.push({ id: i.source, count: 0 });
          }
          return acc;
        }, [])
        .sort((a, b) => b.count - a.count);

      setGraph({ nodes, links });
    }
  }, []);

  useEffect(() => {
    if (selectedNode) {
      const myFollows = graph.links
        .filter((e) => e.source.id === selectedNode)
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
      // console.log("myFollows", myFollows);
      // console.log("myFollowers", myFollowers);
      setFollowedBy(myFollowers);
      setFollowing(myFollows);
    }
  }, [selectedNode]);

  return (
    <div className="App">
      {graph.nodes.length !== 0 ? (
        <Graph
          data={graph}
          selectedNode={selectedNode}
          handleSelectNode={setSelectedNode}
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
