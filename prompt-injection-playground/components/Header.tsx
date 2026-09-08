export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl">
            🛡️
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Prompt Injection Playground</h1>
            <p className="text-xs text-slate-500">AI Security Research Lab</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          LOCAL ENGINE
        </div>
      </div>
    </header>
  );
}
