"use client";

import { useState } from "react";
import Header from "@/components/Header";
import AttackCard from "@/components/AttackCard";
import DetectionResultPanel from "@/components/DetectionResult";
import StatsPanel from "@/components/StatsPanel";
import { ATTACK_EXAMPLES } from "@/lib/attacks";
import { detectPromptInjection, DetectionResult } from "@/lib/detector";
import { TEST_CASES, evaluateDataset } from "@/lib/evaluation";

type DefenseMode = "monitor" | "balanced" | "strict";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [defenseMode, setDefenseMode] = useState<DefenseMode>("balanced");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [analyses, setAnalyses] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [highestRisk, setHighestRisk] = useState(0);
  const [showLab, setShowLab] = useState(false);
  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluateDataset> | null>(null);

  const analyzePrompt = () => {
    if (!prompt.trim()) return;
    const detection = detectPromptInjection(prompt, defenseMode);
    setResult(detection);
    setAnalyses((value) => value + 1);
    if (detection.blocked) setBlocked((value) => value + 1);
    setHighestRisk((value) => Math.max(value, detection.score));
  };

  const loadAttack = (attackPrompt: string) => { setPrompt(attackPrompt); setResult(null); };
  const clearAll = () => { setPrompt(""); setResult(null); };

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-300"><span>●</span>LOCAL AI SECURITY LAB · V2</div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Detect the attack<br /><span className="text-cyan-400">before it reaches the model.</span></h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Experiment with prompt injection attacks, compare defensive policies, and evaluate detector performance against a repeatable test set.</p>
        </section>

        <StatsPanel analyses={analyses} blocked={blocked} highestRisk={highestRisk} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-slate-600">Input</p><h2 className="mt-1 text-lg font-semibold">Attack Simulator</h2></div><button onClick={clearAll} className="text-xs text-slate-500 transition hover:text-white">Clear</button></div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Enter a prompt to analyze..." className="min-h-[260px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40" />
            <div className="mt-5"><p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-600">Defense Policy</p><div className="grid grid-cols-3 gap-2">{([['monitor','Monitor'],['balanced','Balanced'],['strict','Strict']] as const).map(([value,label]) => <button key={value} onClick={() => setDefenseMode(value)} className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition ${defenseMode === value ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-white/10 bg-white/[0.02] text-slate-500 hover:text-white'}`}>{label}</button>)}</div></div>
            <button onClick={analyzePrompt} disabled={!prompt.trim()} className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-30">Analyze Prompt →</button>
          </section>
          <DetectionResultPanel result={result} />
        </div>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-xs uppercase tracking-widest text-slate-600">V2 · Defense Lab</p><h2 className="mt-1 text-xl font-semibold">Compare defensive policies</h2><p className="mt-2 text-sm text-slate-500">Monitor logs threats, Balanced blocks high-risk prompts, and Strict blocks medium-risk prompts.</p></div>
            <button onClick={() => setShowLab((value) => !value)} className="rounded-lg border border-cyan-400/30 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10">{showLab ? "Hide Lab" : "Open Lab"}</button>
          </div>
          {showLab && <div className="mt-6 grid gap-3 md:grid-cols-3">{[
            ["Monitor", "Observe only", "Useful for collecting signals without blocking user input."],
            ["Balanced", "Block ≥ 55", "Default mode for reducing high-risk injection attempts."],
            ["Strict", "Block ≥ 25", "Aggressive mode that prioritizes safety over false positives."],
          ].map(([name, threshold, text]) => <div key={name} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="font-semibold">{name}</p><p className="mt-1 text-xs text-cyan-300">{threshold}</p><p className="mt-3 text-xs leading-5 text-slate-500">{text}</p></div>)}</div>}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs uppercase tracking-widest text-slate-600">V2 · Evaluation</p><h2 className="mt-1 text-xl font-semibold">Run the detector benchmark</h2><p className="mt-2 text-sm text-slate-500">20 labeled prompts · 10 benign · 10 malicious · balanced policy.</p></div><button onClick={() => setEvaluation(evaluateDataset())} className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-slate-200">Run Evaluation</button></div>
          {evaluation && <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Accuracy" value={`${evaluation.accuracy.toFixed(0)}%`} /><Metric label="Precision" value={`${evaluation.precision.toFixed(0)}%`} /><Metric label="Recall" value={`${evaluation.recall.toFixed(0)}%`} /><Metric label="Test Cases" value={String(evaluation.total)} /></div>}
          {evaluation && <p className="mt-4 text-xs text-slate-600">Confusion matrix: TP {evaluation.tp} · TN {evaluation.tn} · FP {evaluation.fp} · FN {evaluation.fn}. This is a small educational benchmark, not a production security guarantee.</p>}
        </section>

        <section className="mt-10"><div className="mb-5"><p className="text-xs uppercase tracking-widest text-slate-600">Training Scenarios</p><h2 className="mt-1 text-xl font-semibold">Try a known attack</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{ATTACK_EXAMPLES.map((attack) => <AttackCard key={attack.id} attack={attack} onSelect={loadAttack} />)}</div></section>

        <details className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5"><summary className="cursor-pointer text-sm font-semibold">About the test set</summary><div className="mt-4 grid gap-2 sm:grid-cols-2">{TEST_CASES.map((item, index) => <div key={index} className="rounded-lg bg-black/20 px-3 py-2 text-xs text-slate-500"><span className={item.malicious ? "text-red-300" : "text-emerald-300"}>{item.malicious ? "MALICIOUS" : "BENIGN"}</span> · {item.category}</div>)}</div></details>

        <footer className="mt-16 border-t border-white/10 py-8"><div className="flex flex-col justify-between gap-3 text-xs text-slate-600 sm:flex-row"><p>Prompt Injection Playground · V2 · Educational Security Research</p><p>Detection is heuristic and does not guarantee complete protection.</p></div></footer>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold text-cyan-300">{value}</p></div>;
}
