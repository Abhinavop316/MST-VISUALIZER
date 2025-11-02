import React from "react";

export default function InfoPanel({
  algorithm,
  setAlgorithm,
  selectedNode,
  nodes,
  edges,
}) {
  return (
    <div className="bg-slate-900/60 rounded-2xl p-4 shadow border border-slate-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Controls</h3>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="bg-slate-800 text-sm p-1 rounded"
        >
          <option value="kruskal">Kruskal (DSU)</option>
          <option value="prim">Prim (PQ)</option>
        </select>
      </div>

      <div className="mt-3 text-sm text-slate-300 space-y-2">
        <div>
          Click one node, then another to create an edge. A prompt will ask for
          weight (blank = random).
        </div>
        <div>
          Selected node for edge creation:{" "}
          <span className="font-medium">
            {selectedNode === null ? "none" : selectedNode}
          </span>
        </div>
        <div className="pt-2">
          Nodes: <span className="font-medium">{nodes.length}</span> | Edges:{" "}
          <span className="font-medium">{edges.length}</span>
        </div>
      </div>
    </div>
  );
}
