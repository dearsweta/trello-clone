import { FiPlus } from 'react-icons/fi';

export default function BoardsList({ boards, activeBoardId, onSelect, onCreate }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Boards</span>
        <button
          type="button"
          onClick={onCreate}
          className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Create board"
        >
          <FiPlus size={16} />
        </button>
      </div>
      <ul className="flex flex-col gap-0.5 px-2">
        {boards.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => onSelect(b.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                activeBoardId === b.id
                  ? 'bg-white/20 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: b.background }}
              />
              {b.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
