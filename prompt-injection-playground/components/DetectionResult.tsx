import { DetectionResult } from "@/lib/detector";
import RiskMeter from "./RiskMeter";

interface DetectionResultProps { result: DetectionResult | null; }

export default function DetectionResultPanel({ result }: DetectionResultProps) {
  if (!result) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
        <div className="text-center"><div className="mb-4 text-4xl opacity-30">◉</div><p className="text-sm text-slate-500">Run an analysis to see detection results.</p></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RiskMeter score={result.score} severity={result.severity} />
      <div className={`rounded-2xl border p-5 ${result.blocked ? "border-red-400/20 bg-red-400/5" : "border-emerald-400/20 bg-emerald-400/5"}`}>
        <div className="flex items-center justify-between">
          <div><p className="text-xs uppercase tracking-widest text-slate-500">Decision</p><p className={`mt-1 text-xl font-bold ${result.blocked ? "text-red-400" : "text-emerald-400"}`}>{result.blocked ? "BLOCKED" : "ALLOWED"}</p></div>
          <div className="text-3xl">{result.blocked ? "⛔" : "✓"}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-white">Detection Findings</h3><span className="text-xs text-slate-500">{result.findings.length} detected</span></div>
        {result.findings.length === 0 ? <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4 text-sm text-emerald-300">No known injection patterns were detected.</div> : <div className="space-y-3">{result.findings.map((finding, index) => <div key={`${finding.pattern}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-medium text-white">{finding.pattern}</p><p className="mt-1 text-sm leading-6 text-slate-400">{finding.explanation}</p></div><span className="shrink-0 text-xs font-bold text-orange-400">+{finding.points}</span></div></div>)}</div>}
      </div>
      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">Recommendation</p><p className="text-sm leading-6 text-slate-300">{result.recommendation}</p></div>
    </div>
  );
}
