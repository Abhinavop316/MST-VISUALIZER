import React from "react";
import { MdDelete } from "react-icons/md";

const EdgesPanel = ({ edges, setEdges }) => {
  return (
    <div className="bg-slate-900/60 rounded-2xl p-4 shadow border border-slate-700 overflow-auto max-h-[240px]">
      <h4 className="text-lg font-semibold mb-2">Edges</h4>
      <div className="text-sm text-slate-400 mb-2">
        Click 'Remove' to delete an edge
      </div>

      <div
        className="space-y-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {edges.length > 0 ? (
          edges.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between bg-slate-800 p-2 rounded"
            >
              <div>
                {e.u} — {e.v}
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold">{e.w}</div>
                <button
                  className="text-s hover:bg-red-600 duration-300 px-2 py-1 rounded"
                  onClick={() =>
                    setEdges((prev) => prev.filter((x) => x.id !== e.id))
                  }
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-400">No edges yet</div>
        )}
      </div>
    </div>
  );
};

export default EdgesPanel;
