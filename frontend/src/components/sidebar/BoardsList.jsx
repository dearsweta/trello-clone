import { memo } from 'react';

function BoardNavItem({ board, active, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(board.id)}
        className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition ${
          active
            ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/80'
            : 'text-slate-600 hover:bg-white/70 hover:text-slate-800'
        }`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${active ? 'ring-2 ring-slate-300/80' : ''}`}
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
    <div className="flex max-h-[180px] min-h-0 flex-col">
      <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Boards
      </p>
      <ul className="flex flex-col gap-0.5 overflow-y-auto">
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
