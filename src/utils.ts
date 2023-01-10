import { GraphDatum, Link, Node } from "./types";

/**
 * Maps socialDB schema to visualization-compatible schema
 * @param data JSON from socialDB
 * @returns list of links
 */
export function linksFromData(data: GraphDatum[]) {
  return data
    .map((g) => ({
      source: g.accountId,
      target: g.value.accountId,
      blockHeight: g.blockHeight,
    }))
    .sort((a, b) => b.blockHeight - a.blockHeight) as Link[];
}

/**
 * Sweep through links for unique node IDs
 * @param links
 * @returns list of nodes, ordered by count
 */
export function nodesFromLinks(links: Link[]) {
  let nodes: Node[] = [];
  return links
    .reduce((acc, i) => {
      // sweep through target IDs
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
      // sweep through source IDs
      let followerResult = acc.findIndex((el) => el.id === i.source);
      if (followerResult === -1) {
        acc.push({ id: i.source, count: 0 });
      }
      return acc;
    }, nodes)
    .sort((a, b) => b.count - a.count);
}

// export function getMyFollows(links: Link[], nodeId: string) {
//   console.log()
//   let myFollows: Node[] = [];

//   return links
//     .filter((e) => e.source.id === nodeId)
//     .reduce((acc, i) => {
//       let res = acc.findIndex((el) => el.target.id === i.target.id);
//       if (res === -1) {
//         acc.push(i);
//       }
//       return acc;
//     }, myFollows)
//     .sort((a, b) => b.target.count - a.target.count);
// }
