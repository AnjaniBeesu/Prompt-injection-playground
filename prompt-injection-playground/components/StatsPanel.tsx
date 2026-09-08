interface StatsPanelProps { analyses: number; blocked: number; highestRisk: number; }

export default function StatsPanel({ analyses, blocked, highestRisk }: StatsPanelProps) {
  const stats = [{ label: "Analyses", value: analyses }, { label: "Blocked", value: blocked }, { label: "Highest Risk", value: highestRisk }];
  return <div className="grid grid-cols-3 gap-3">{stats.map((stat) => <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-[10px] uppercase tracking-widest text-slate-600">{stat.label}</p><p className="mt-2 text-2xl font-bold text-white">{stat.value}</p></div>)}</div>;
}
