// src/utils/primTrace.js

export default function primTrace(nodes, edges, start = 0) {
  const n = nodes.length;
  const adj = Array.from({ length: n }, () => []);

  // Build adjacency list
  for (const e of edges) {
    adj[e.u].push({ to: e.v, w: e.w, id: e.id });
    adj[e.v].push({ to: e.u, w: e.w, id: e.id });
  }

  const steps = [];
  const inMST = Array(n).fill(false);
  const pq = []; // entries: {u, v, w, id}

  inMST[start] = true;

  // Push edges from start node
  for (const ex of adj[start]) {
    pq.push({ u: start, v: ex.to, w: ex.w, id: ex.id });
    steps.push({
      type: "pushPQ",
      edge: { u: start, v: ex.to, w: ex.w, id: ex.id },
      pq: [...pq],
      marked: [...inMST],
    });
  }

  const popMin = () => {
    pq.sort((a, b) => a.w - b.w);
    return pq.shift();
  };

  while (pq.length > 0) {
    steps.push({ type: "peekPQ", pq: [...pq], marked: [...inMST] });

    const e = popMin();
    steps.push({ type: "popPQ", edge: e, pq: [...pq], marked: [...inMST] });

    if (inMST[e.v]) {
      steps.push({ type: "skip", edge: e, pq: [...pq], marked: [...inMST] });
      continue;
    }

    inMST[e.v] = true;
    steps.push({ type: "take", edge: e, pq: [...pq], marked: [...inMST] });

    // Add new edges from this vertex
    for (const ex of adj[e.v]) {
      if (!inMST[ex.to]) {
        pq.push({ u: e.v, v: ex.to, w: ex.w, id: ex.id });
        steps.push({
          type: "pushPQ",
          edge: { u: e.v, v: ex.to, w: ex.w, id: ex.id },
          pq: [...pq],
          marked: [...inMST],
        });
      }
    }
  }

  return steps;
}
