import { memo } from 'react';

function BoardNavItem({ board, active, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(board.id)}
        className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition ${
          active
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'ring-2 ring-white/30' : ''}`}
          style={{ backgroundColor: board.background }}
        />
        <span className={`truncate text-[13px] leading-tight ${active ? 'font-medium' : 'font-normal'}`}>
          {board.title}
        </span>
      </button>
    </li>
  );
}

const MemoBoardNavItem = memo(BoardNavItem);

function BoardsList({ boards, activeBoardId, onSelect }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Boards
      </p>
      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto pr-1">
        {boards.map((b) => (
          <MemoBoardNavItem
            key={b.id}
            board={b}
            active={activeBoardId === b.id}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

export default memo(BoardsList);
