import React from "react";

export default function AlgorithmVisualPanel({ algorithm, pqList, dsuState }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl p-4 shadow border border-slate-700">
      <h4 className="text-lg font-semibold mb-2">Algorithm Visual</h4>

      {algorithm === "prim" ? (
        <>
          <div className="text-sm text-slate-400 mb-2">
            Priority Queue (top = smallest)
          </div>
          <div className="bg-slate-800 p-2 rounded min-h-[80px]">
            {pqList.length === 0 ? (
              <div className="text-slate-400">Queue empty</div>
            ) : (
              <ol className="text-sm space-y-1">
                {pqList.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {p.u} → {p.v}
                    </span>
                    <span className="font-medium">{p.w}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-sm text-slate-400 mb-2">DSU parents</div>
          <div className="bg-slate-800 p-2 rounded">
            {dsuState ? (
              <div className="grid grid-cols-3 gap-2 text-sm">
                {dsuState.map((p, i) => (
                  <div key={i} className="p-2 bg-slate-900 rounded">
                    {i}: <span className="font-medium">{p}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400">No DSU snapshot</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
