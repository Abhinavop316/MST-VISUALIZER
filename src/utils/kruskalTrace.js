// src/utils/kruskalTrace.js
import DSU from "./DSU";

export default function kruskalTrace(nodes, edges) {
  const steps = [];
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const dsu = new DSU(nodes.length);

  for (const e of sorted) {
    // Step: considering this edge
    steps.push({ type: "consider", edge: e, dsu: [...dsu.parent] });

    if (dsu.find(e.u) !== dsu.find(e.v)) {
      // Step: take edge (doesn’t form a cycle)
      dsu.union(e.u, e.v);
      steps.push({ type: "take", edge: e, dsu: [...dsu.parent] });
    } else {
      // Step: skip edge (forms a cycle)
      steps.push({ type: "skip", edge: e, dsu: [...dsu.parent] });
    }
  }

  return steps;
}
