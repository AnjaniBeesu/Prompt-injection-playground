import { AttackExample } from "@/lib/attacks";

interface AttackCardProps { attack: AttackExample; onSelect: (prompt: string) => void; }

export default function AttackCard({ attack, onSelect }: AttackCardProps) {
  return (
    <button onClick={() => onSelect(attack.prompt)} className="group w-full rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]">
      <div className="mb-3 flex items-center justify-between gap-3"><span className="rounded-md bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{attack.category}</span><span className="text-[10px] uppercase tracking-wider text-slate-600">{attack.difficulty}</span></div>
      <h3 className="font-semibold text-white group-hover:text-cyan-300">{attack.title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">{attack.description}</p>
    </button>
  );
}
