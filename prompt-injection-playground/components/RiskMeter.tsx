interface RiskMeterProps {
  score: number;
  severity: string;
}

export default function RiskMeter({ score, severity }: RiskMeterProps) {
  const getTextColor = () => {
    if (score >= 80) return "text-red-400";
    if (score >= 55) return "text-orange-400";
    if (score >= 25) return "text-yellow-400";
    return "text-emerald-400";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Injection Risk</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-5xl font-bold ${getTextColor()}`}>{score}</span>
            <span className="text-sm text-slate-500">/ 100</span>
          </div>
        </div>
        <div className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getTextColor()}`}>{severity}</div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-current transition-all duration-500"
          style={{
            width: `${score}%`,
            color: score >= 80 ? "#f87171" : score >= 55 ? "#fb923c" : score >= 25 ? "#facc15" : "#34d399",
          }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-slate-600">
        <span>Safe</span><span>Suspicious</span><span>Dangerous</span>
      </div>
    </div>
  );
}
