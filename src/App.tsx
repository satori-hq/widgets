// @ts-nocheck

import { useCallback, useState } from "react";
import { Circles } from "./Circles";

function App() {
  const [data, setData] = useState([10, 20, 30, 40, 50, 60, 70, 80]);
  const updateData = useCallback(() => {
    const count = 5 + Math.round(Math.random() * 15);
    const values = [];
    for (let i = 0; i < count; i++) {
      values[i] = 10 + Math.round(Math.random() * 70);
    }
    setData(values);
  }, []);

  return (
    <div className="app">
      <button onClick={updateData}>Update Data</button>
      <Circles data={data} />
    </div>
  );
}

export default App;

// import { useEffect, useLayoutEffect, useRef } from "react";

// function App() {
//   const containerRef = useRef(null);

//   // https://betterprogramming.pub/5-steps-to-render-d3-js-with-react-functional-components-fcce6cec1411

//   useLayoutEffect(() => {
//     onLoad();

//     async function onLoad() {
//       let res = await fetch("/graph.json");
//       let data = await res.json();

//       data = [1, 10, 100];

//       console.log("data", data);

//       let width = containerRef.current.clientWidth;
//       console.log("width", width);

//       //@ts-ignore
//       const update = d3.select("g").selectAll("circle").data(data);

//       update
//         .enter()
//         .append("circle")
//         .merge(update)
//         .attr("r", (d) => d)
//         .attr("cx", (_, i) => width * (i + 1))
//         .attr("cy", () => Math.random() * 100)
//         .attr("stroke", (_, i) => (i % 2 === 0 ? "#f80" : "#aaf"))
//         .attr("fill", (_, i) => (i % 2 === 0 ? "orange" : "#44f"));

//       update.exit().remove();
//     }
//   }, [containerRef]);

//   return (
//     <div className="App" style={{ width: "100%" }}>
//       <svg
//         id="content"
//         width="100%"
//         height="350"
//         ref={containerRef}
//         style={{ border: "1px solid black" }}
//       >
//         <g transform="translate(0, 100)" />
//       </svg>
//     </div>
//   );
// }
