import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "./Head";
import GraphCanvas from "./GraphCanvas";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel";
import StepInfoPanel from "./StepInfoPanel";
import AlgorithmVisualPanel from "./AlgorithmVisualPanel";
import EdgesPanel from "./EdgesPanel";
import EdgeWeightInputBar from "./EdgeWeightInputBar";
import  randInt  from "../utils/randInt";
import DSU from "../utils/DSU";
import generateDefaultGraph from "../utils/generateDefaultGraph";
import kruskalTrace  from "../utils/kruskalTrace";
import primTrace from "../utils/primTrace";
import StartNodePanel from "./StartNodePanel";

export default function MSTVisualizer() {
  // graph state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // UI & algorithm
  const [algorithm, setAlgorithm] = useState("kruskal");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600); // ms
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]); // algorithm trace
  const [highlightedEdge, setHighlightedEdge] = useState(null); // current step edge
  const [selectedNode, setSelectedNode] = useState(null); // for creating edges
  const [pendingEdge, setPendingEdge] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [startNode, setStartNode] = useState(0);
  const [invalidStart, setInvalidStart] = useState(false);



  const [mstTakenEdges, setMstTakenEdges] = useState([]); // edges accepted by MST
  const timerRef = useRef(null);

  // dragging refs
  const draggingRef = useRef({ id: null, offsetX: 0, offsetY: 0 });
  const svgRef = useRef(null);

  // init default graph on mount
  useEffect(() => {
    const g = generateDefaultGraph(6, 9);
    setNodes(g.nodes);
    setEdges(g.edges);
  }, []);

  // rebuild trace when graph or algorithm changes
useEffect(() => {
  buildTrace();
  setStepIndex(0);
  setMstTakenEdges([]);
  setHighlightedEdge(null);
}, [nodes, edges, algorithm, startNode]);



  // playback control
useEffect(() => {
  if (playing) {
    const id = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        setPlaying(false); // stop when finished
        return prev;
      });
    }, speed);
    return () => clearInterval(id);
  }
}, [playing, speed, steps]);


  useEffect(() => {
    // process step change (paint UI)
    if (stepIndex <= 0) {
      setHighlightedEdge(null);
      setMstTakenEdges([]);
      return;
    }
    const s = steps[stepIndex - 1];
    if (!s) return;
    setHighlightedEdge(s.edge || null);
    // update taken edges for visualization when step type 'take' (Kruskal) or 'take' (Prim)
    if (s.type === "take") {
      // find the canonical edge object in edges list by id or u/v/w match
      const canonical = findEdgeClaim(s.edge);
      if (canonical && !mstTakenEdges.some((e) => e.id === canonical.id)) {
        setMstTakenEdges((prev) => [...prev, canonical]);
      }
    }
    if (
      s.type === "skip" ||
      s.type === "consider" ||
      s.type === "popPQ" ||
      s.type === "peekPQ" ||
      s.type === "pushPQ"
    ) {
      // no additional action needed (highlight only)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  function findEdgeClaim(edgeLike) {
    if (!edgeLike) return null;
    // match by id if present
    if (edgeLike.id !== undefined && edgeLike.id !== null) {
      return edges.find((e) => e.id === edgeLike.id) || null;
    }
    // fallback: match by endpoints and weight ignoring order
    return (
      edges.find(
        (e) =>
          ((e.u === edgeLike.u && e.v === edgeLike.v) ||
            (e.u === edgeLike.v && e.v === edgeLike.u)) &&
          e.w === edgeLike.w
      ) || null
    );
  }

function buildTrace() {
  if (nodes.length === 0 || edges.length === 0) {
    setSteps([]);
    setInvalidStart(false);
    return;
  }

  const nodeIds = nodes.map((n) => n.id);
  let start = startNode;

  // If invalid start node — show warning and stop
  if (!nodeIds.includes(start)) {
    setInvalidStart(true);
    setSteps([]);
    setHighlightedEdge(null);
    setMstTakenEdges([]);
    return;
  }

  setInvalidStart(false); // clear old warning if fixed

  if (algorithm === "kruskal") {
    setSteps(kruskalTrace(nodes, edges));
  } else {
    setSteps(primTrace(nodes, edges, start));
  }

  setStepIndex(0);
  setMstTakenEdges([]);
  setHighlightedEdge(null);
}



  function startPlaying() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStepIndex((s) => {
        if (s < steps.length) return s + 1;
        clearInterval(timerRef.current);
        return s;
      });
    }, speed);
  }

  function stopPlaying() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  const togglePlay = () => {
    if (steps.length === 0) return; // no animation to play
    if (playing) {
      setPlaying(false);
    } else {
      if (stepIndex >= steps.length - 1) setStepIndex(0); // reset to start if finished
      setPlaying(true);
    }
  };


  function stepForward() {
    setPlaying(false);
    setStepIndex((s) => Math.min(s + 1, steps.length));
  }
  function stepBackward() {
    setPlaying(false);
    setStepIndex((s) => Math.max(0, s - 1));
    // Note: for simplicity we rebuild taken edges from scratch when stepping back
    // (recalc based on steps[0..newIndex-1])
    const newIndex = Math.max(0, stepIndex - 1);
    const taken = [];
    for (let i = 0; i < newIndex; i++) {
      const st = steps[i];
      if (st.type === "take") {
        const ce = findEdgeClaim(st.edge);
        if (ce && !taken.some((t) => t.id === ce.id)) taken.push(ce);
      }
    }
    setMstTakenEdges(taken);
  }

  // graph editing: add node, reset, randomize
  function addNode() {
    const id = nodes.length > 0 ? Math.max(...nodes.map((n) => n.id)) + 1 : 0;
    setNodes((prev) => [
      ...prev,
      {
        id,
        x: randInt(80, 820),
        y: randInt(80, 420),
      },
    ]);
    }
    function removeNode() {
      if (selectedNode === null) return alert("Select a node to remove first!");
      setNodes((prev) => prev.filter((n) => n.id !== selectedNode));
      setEdges((prev) =>
        prev.filter((e) => e.u !== selectedNode && e.v !== selectedNode)
      );
      setSelectedNode(null);
    }


  function randomize() {
    const g = generateDefaultGraph(randInt(5, 8), randInt(6, 14));
    setNodes(g.nodes);
    setEdges(g.edges);
    setSelectedNode(null);
    setStepIndex(0);
    setMstTakenEdges([]);
  }

  function reset() {
    setNodes([]);
    setEdges([]);
    setSteps([]);
    setStepIndex(0);
    setSelectedNode(null);
    setMstTakenEdges([]);
    setPlaying(false);
    setHighlightedEdge(null);
  }

  // create edge via clicking nodes
function onNodeClick(id) {
  if (selectedNode === null) {
    setSelectedNode(id);
    setPendingEdge(null);
    return;
  }
  if (selectedNode === id) {
    setSelectedNode(null);
    setPendingEdge(null);
    return;
  }

  const uNode = nodes.find((n) => n.id === selectedNode);
  const vNode = nodes.find((n) => n.id === id);
  const midx = (uNode.x + vNode.x) / 2;
  const midy = (uNode.y + vNode.y) / 2;

  // show weight input bar
  setPendingEdge({ u: selectedNode, v: id, midx, midy });
  setWeightInput("");
}



  // dragging handlers
  function onPointerDown(e, node) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    draggingRef.current = {
      id: node.id,
      offsetX: e.clientX - rect.left - node.x,
      offsetY: e.clientY - rect.top - node.y,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  function onPointerMove(ev) {
    const drag = draggingRef.current;
    if (drag.id === null) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = ev.clientX - rect.left - drag.offsetX;
    const y = ev.clientY - rect.top - drag.offsetY;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === drag.id
          ? {
              ...n,
              x: Math.max(20, Math.min(830, x)),
              y: Math.max(20, Math.min(480, y)),
            }
          : n
      )
    );
  }

  function onPointerUp() {
    draggingRef.current = { id: null, offsetX: 0, offsetY: 0 };
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  // helpers for rendering highlight color per step type
  function edgeColor(e) {
    // if accepted to MST
    if (mstTakenEdges.some((t) => t.id === e.id)) return "#34D399"; // green
    // if currently highlighted
    if (
      highlightedEdge &&
      ((highlightedEdge.id !== undefined && highlightedEdge.id === e.id) ||
        (((highlightedEdge.u === e.u && highlightedEdge.v === e.v) ||
          (highlightedEdge.u === e.v && highlightedEdge.v === e.u)) &&
          highlightedEdge.w === e.w))
    ) {
      // determine step type
      const s = steps[stepIndex - 1] || {};
      if (
        s.type === "consider" ||
        s.type === "peekPQ" ||
        s.type === "popPQ" ||
        s.type === "pushPQ"
      )
        return "#60A5FA";
      if (s.type === "skip") return "#F97316";
      if (s.type === "take") return "#34D399";
      return "#60A5FA";
    }
    return "#94A3B8";
  }

  function edgeWidth(e) {
    return mstTakenEdges.some((t) => t.id === e.id) ? 4 : 2;
  }

  // PQ / DSU displays for the side panel (derive from current step)
  const currentStep = steps[stepIndex - 1] || null;
  const pqList = currentStep && currentStep.pq ? currentStep.pq : [];
  const dsuState = currentStep && currentStep.dsu ? currentStep.dsu : null;

  return (
    <div className="flex flex-wrap justify-center gap-6 min-w-[450px] ">
      {/* Main Canvas */}
      <div className="min-w-[518px] col-span-8 bg-slate-900/40 rounded-2xl p-4 shadow border border-slate-700">
        <Head algorithm={algorithm} />
        {invalidStart && algorithm === "prim" && (
          <div className="mb-3 text-red-400 text-center font-medium">
            ⚠️ Invalid start node! Please enter a valid node ID (0–
            {nodes.length - 1})
          </div>
        )}

        <GraphCanvas
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          stepIndex={stepIndex}
          steps={steps}
          svgRef={svgRef}
          onPointerDown={onPointerDown}
          onNodeClick={onNodeClick}
          edgeColor={edgeColor}
          edgeWidth={edgeWidth}
          startNode={startNode}
          algorithm={algorithm}
        />

        {/* controls */}
        <ControlPanel
          playing={playing}
          speed={speed}
          setSpeed={setSpeed}
          togglePlay={togglePlay}
          stepForward={stepForward}
          stepBackward={stepBackward}
          setPlaying={setPlaying}
          addNode={addNode}
          removeNode={removeNode}
          reset={reset}
          randomize={randomize}
          setSelectedNode={setSelectedNode}
        />
      </div>

      {/* Right-side panel */}
      <div className="col-span-4 space-y-4">
        <StartNodePanel
          algorithm={algorithm}
          startNode={startNode}
          setStartNode={setStartNode}
          nodes={nodes}
        />
        <InfoPanel
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
        />

        <StepInfoPanel currentStep={currentStep} />

        <AlgorithmVisualPanel
          algorithm={algorithm}
          pqList={pqList}
          dsuState={dsuState}
        />

        <EdgesPanel edges={edges} setEdges={setEdges} />
      </div>
      {/* Weight input bar */}
      <EdgeWeightInputBar
        pendingEdge={pendingEdge}
        weightInput={weightInput}
        setWeightInput={setWeightInput}
        setEdges={setEdges}
        setPendingEdge={setPendingEdge}
        setSelectedNode={setSelectedNode}
      />
    </div>
  );
}
