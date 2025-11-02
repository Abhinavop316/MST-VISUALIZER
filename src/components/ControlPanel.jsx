import React from "react";
import { BsRewindCircleFill } from "react-icons/bs";
import { BsFillFastForwardCircleFill } from "react-icons/bs";

export default function ControlPanel({
  playing,
  speed,
  setSpeed,
  togglePlay,
  stepForward,
  stepBackward,
  setPlaying,
  addNode,
  removeNode,
  reset,
  randomize,
  setSelectedNode,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4 min-w-[400px]">
      <button
        onClick={() => {
          setPlaying(false);
          stepBackward();
        }}
        className="px-3 py-2 bg-slate-700 rounded flex items-center gap-1 hover:"
      >
        <BsRewindCircleFill />
        Prev
      </button>

      <button
        onClick={togglePlay}
        className={`px-4 py-2 rounded font-medium ${
          playing ? "bg-red-500" : "bg-emerald-500"
        }`}
      >
        {playing ? "Pause" : "Play"}
      </button>

      <button
        onClick={stepForward}
        className="px-3 py-2 bg-slate-700 rounded flex items-center gap-1"
      >
        <BsFillFastForwardCircleFill />
        Next
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="px-3 py-2 bg-slate-700 rounded  hover:bg-blue-500 duration-300"
          onClick={addNode}
        >
          Add Node
        </button>
        <button
          className="px-3 py-2 bg-slate-700 hover:bg-red-500 duration-300 rounded"
          onClick={removeNode}
        >
          Remove Node
        </button>
        <button
          className="px-3 py-2 bg-slate-700 rounded  hover:bg-purple-500 duration-300  "
          onClick={randomize}
        >
          Randomize
        </button>
        <button
          className="px-3 py-2 bg-slate-700  hover:bg-red-500  duration-300 rounded"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
