import React from "react";
import { motion } from "framer-motion";

export default function GraphCanvas({
  nodes,
  edges,
  selectedNode,
  stepIndex,
  steps,
  svgRef,
  onPointerDown,
  onNodeClick,
  edgeColor,
  edgeWidth,
}) {
  return (
    <div className="bg-slate-900/60 rounded-xl p-3 relative max-h[500px] overflow-hidden">
      <svg ref={svgRef} viewBox="0 0 900 520" className="w-full h-[520px]">
        {/* edges */}
        {edges.map((e) => {
          const a = nodes.find((n) => n.id === e.u);
          const b = nodes.find((n) => n.id === e.v);
          if (!a || !b) return null;
          const midx = (a.x + b.x) / 2;
          const midy = (a.y + b.y) / 2;
          return (
            <g key={e.id}>
              <motion.line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={edgeColor(e)}
                strokeWidth={edgeWidth(e)}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <rect
                x={midx - 16}
                y={midy - 14}
                width={34}
                height={22}
                rx={6}
                fill="#0b1220"
                fillOpacity={0.6}
              />
              <text
                x={midx}
                y={midy + 2}
                textAnchor="middle"
                fontSize="12"
                fill="#e6eef8"
              >
                {e.w}
              </text>
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
            <motion.circle
              cx={0}
              cy={0}
              r={20}
              fill={selectedNode === n.id ? "#facc15" : "#0b1220"}
              stroke="#94a3b8"
              strokeWidth={2}
              onPointerDown={(ev) => onPointerDown(ev, n)}
              onClick={() => onNodeClick(n.id)}
              style={{ cursor: "grab" }}
            />
            <text
              x={0}
              y={6}
              textAnchor="middle"
              fontSize="13"
              fill="#e6eef8"
              fontWeight={700}
            >
              {n.id}
            </text>
          </g>
        ))}
      </svg>

      {/* step counter */}
      <div className="absolute top-4 left-4 bg-black/50 p-2 rounded">
        <div className="text-xs text-slate-300">Step</div>
        <div className="font-semibold">
          {Math.max(0, stepIndex)}/{steps.length}
        </div>
      </div>
    </div>
  );
}
