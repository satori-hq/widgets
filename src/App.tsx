// @ts-nocheck
import { useEffect, useState } from "react";
import { Graph } from "./Graph";
// https://betterprogramming.pub/5-steps-to-render-d3-js-with-react-functional-components-fcce6cec1411
function App() {
  const [graph, setGraph] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetchData();
    async function fetchData() {
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

  useEffect(() => {}, [graph]);

  return (
    <div className="app">
      {graph.nodes.length !== 0 ? <Graph data={graph} /> : null}
    </div>
  );
}

export default App;
