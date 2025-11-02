// src/components/StartNodePanel.jsx
import React from "react";

export default function StartNodePanel({
  algorithm,
  startNode,
  setStartNode,
  nodes,
}) {
  if (algorithm !== "prim") return null; // only show for Prim’s algorithm

  return (
    <div className="bg-slate-900/40 border border-slate-700 p-4 rounded-2xl">
      <h3 className="text-lg font-semibold text-slate-200 mb-2">Start Node</h3>

      <div className="text-sm text-slate-400 mb-3">
        Choose the starting node for Prim’s algorithm
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max={Math.max(0, nodes.length - 1)}
          value={startNode}
          onChange={(e) => setStartNode(Number(e.target.value))}
          className="w-20 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-100 text-sm"
        />
        <span className="text-slate-400 text-sm">
          (0–{Math.max(nodes.length - 1, 0)})
        </span>
      </div>
    </div>
  );
}
