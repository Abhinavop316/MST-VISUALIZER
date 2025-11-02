import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "tailwindcss";
import './App.css'
import MSTVisualizer from "./components/MSTVisualizer";

export default function App() {
  return (
    <div className="min-h-screen h-full flex-1 flex-wrap bg-gradient-to-br from-slate-900  text-slate-100 p-6">
      <MSTVisualizer />
    </div>
  );
}
