import { FiInbox, FiChevronRight } from 'react-icons/fi';

export default function Inbox({ active, cardCount = 0, highlighted = false, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`mx-2 mb-2 mt-2 flex min-h-[132px] w-[calc(100%-16px)] flex-col rounded-xl px-3 py-3 text-left transition ${
        active
          ? 'bg-[#2b2d38] text-white shadow-lg ring-1 ring-violet-400/50'
          : highlighted
            ? 'bg-violet-500/15 text-white ring-1 ring-violet-400/40'
            : 'bg-[#25262f] text-slate-200 hover:bg-[#2a2b35] hover:text-white'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              active ? 'bg-violet-500/25' : 'bg-white/5'
            }`}
          >
            <FiInbox size={18} className={active ? 'text-violet-300' : 'text-slate-400'} />
          </span>
          Inbox
        </span>
        <FiChevronRight size={16} className={active ? 'text-violet-300' : 'text-slate-500'} />
      </div>

      <p className="mb-3 flex-1 text-xs leading-relaxed text-slate-400">
        Triage new work, then move cards onto a board when ready.
      </p>

      <div className="flex items-center justify-between border-t border-white/10 pt-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {cardCount === 1 ? '1 card' : `${cardCount} cards`}
        </span>
        <span
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
            active ? 'bg-violet-500/30 text-violet-200' : 'bg-white/5 text-slate-400'
          }`}
        >
          {active ? 'Open' : 'View'}
        </span>
      </div>
    </button>
  );
}
