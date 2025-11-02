import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utility for random integer weight (optional)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const EdgeWeightInputBar = ({
  pendingEdge,
  weightInput,
  setWeightInput,
  setEdges,
  setPendingEdge,
  setSelectedNode,
}) => {
  return (
    <AnimatePresence>
      {pendingEdge && (
        <motion.div
          key="weightbar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-lg border border-slate-600"
        >
          <div className="text-sm text-slate-300">
            Edge {pendingEdge.u} → {pendingEdge.v} Weight:
          </div>

          <input
            type="number"
            min="1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 text-sm"
          />

          <button
            onClick={() => {
              const w =
                weightInput.trim() === ""
                  ? randInt(1, 20)
                  : Number(weightInput);

              setEdges((prev) => [
                ...prev,
                {
                  id:
                    prev.length > 0
                      ? Math.max(...prev.map((x) => x.id)) + 1
                      : 0,
                  u: pendingEdge.u,
                  v: pendingEdge.v,
                  w,
                },
              ]);

              setPendingEdge(null);
              setSelectedNode(null);
              setWeightInput("");
            }}
            className="bg-emerald-500 px-3 py-1 rounded text-sm font-medium"
          >
            ✔ Add
          </button>

          <button
            onClick={() => {
              setPendingEdge(null);
              setSelectedNode(null);
              setWeightInput("");
            }}
            className="bg-red-600 px-3 py-1 rounded text-sm font-medium"
          >
            ✖ Cancel
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EdgeWeightInputBar;
