import { FiLayers, FiPlus } from 'react-icons/fi';
import BoardsList from './BoardsList.jsx';
import SidebarInboxDrop from './SidebarInboxDrop.jsx';

export default function Sidebar({
  boards,
  activeBoardId,
  inboxActive,
  inboxCardCount = 0,
  inboxDropActive = false,
  onSelectBoard,
  onSelectInbox,
  onCreateBoard,
}) {
  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-slate-800 bg-[#1e1f26] text-white transition-[width] ${
        inboxActive ? 'w-[280px]' : 'w-[240px]'
      }`}
    >
      <div className="shrink-0 border-b border-white/10 px-3 py-3">
        <div className="mb-3 flex items-center gap-2 px-1">
          <FiLayers className="text-violet-400" size={20} />
          <span className="text-base font-semibold tracking-tight text-white">TaskFlow</span>
        </div>
        <button
          type="button"
          onClick={onCreateBoard}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600/90 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-600"
        >
          <FiPlus size={15} />
          Create Board
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={`flex min-h-0 flex-col border-b border-white/10 ${
            inboxActive ? 'flex-[1.4]' : 'shrink-0'
          }`}
        >
          <SidebarInboxDrop
            active={inboxActive}
            cardCount={inboxCardCount}
            dropActive={inboxDropActive}
            onSelect={onSelectInbox}
          />
        </div>

        <div className="flex min-h-0 flex-[0.85] flex-col overflow-hidden px-1 py-2">
          <BoardsList
            boards={boards}
            activeBoardId={inboxActive ? null : activeBoardId}
            onSelect={onSelectBoard}
          />
        </div>
      </div>
    </aside>
  );
}
