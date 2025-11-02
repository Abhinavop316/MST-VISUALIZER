import React from "react";

export default function StepInfoPanel({ currentStep }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl p-4 shadow border border-slate-700 min-w-[271px] shadow w-3">
      <h4 className="text-lg font-semibold mb-2">Current Step</h4>
      <div className="bg-slate-800 p-3 rounded">
        {currentStep ? (
          <>
            <div className="text-xs text-slate-400">Action</div>
            <div className="font-medium mb-2">
              {currentStep.type.toUpperCase()}
            </div>

            {currentStep.edge && (
              <div className="text-sm">
                Edge:{" "}
                <span className="font-semibold">
                  {currentStep.edge.u} ↔ {currentStep.edge.v}
                </span>{" "}
                (w: {currentStep.edge.w})
              </div>
            )}

            {currentStep.dsu && (
              <div className="mt-2 text-xs text-slate-400">
                DSU parents snapshot
              </div>
            )}

            <div className="mt-2">
              <pre className="text-xs bg-slate-900 p-2 rounded max-h-36 max-w-150 scrollbar-hide overflow-auto">
                {currentStep.dsu
                  ? JSON.stringify(currentStep.dsu)
                  : currentStep.pq
                  ? JSON.stringify(currentStep.pq)
                  : "—"}
              </pre>
            </div>
          </>
        ) : (
          <div className="text-slate-400">No step selected</div>
        )}
      </div>
    </div>
  );
}
