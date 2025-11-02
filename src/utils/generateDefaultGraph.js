// src/utils/generateDefaultGraph.js
import randInt  from "./randInt";

export default function generateDefaultGraph(n = 6, m = 9) {
  const nodes = [];
  const padding = 60;
  const width = 900 - padding * 2;
  const height = 520 - padding * 2;
  const cols = Math.ceil(Math.sqrt(n));

  // create nodes in grid-like pattern
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    nodes.push({
      id: i,
      x: padding + width * (col / Math.max(1, cols - 1)) + randInt(-30, 30),
      y:
        padding +
        height * (row / Math.max(1, Math.ceil(n / cols) - 1)) +
        randInt(-30, 30),
    });
  }

  const edges = new Map();

  // Ensure connectivity with a basic chain
  for (let i = 0; i < n - 1; i++) {
    edges.set(edges.size, {
      id: edges.size,
      u: i,
      v: i + 1,
      w: randInt(1, 20),
    });
  }

  // Add random extra edges
  while (edges.size < m) {
    const u = randInt(0, n - 1);
    const v = randInt(0, n - 1);
    if (u === v) continue;

    const alreadyExists = [...edges.values()].some(
      (e) => (e.u === u && e.v === v) || (e.u === v && e.v === u)
    );
    if (alreadyExists) continue;

    edges.set(edges.size, { id: edges.size, u, v, w: randInt(1, 20) });
  }

  return { nodes, edges: [...edges.values()] };
}
