export default function FilterPill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[11px] px-3.5 py-1.5 rounded-full border transition-colors ${
        isActive
          ? 'bg-violet-500 text-white border-violet-500'
          : 'bg-white/50 text-[#6B6485] border-white/80 hover:bg-white/70'
      }`}
    >
      {label}
    </button>
  );
}