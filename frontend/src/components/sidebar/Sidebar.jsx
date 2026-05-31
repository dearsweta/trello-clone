import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FiInbox, FiPlus } from 'react-icons/fi';
import BoardsList from './BoardsList.jsx';
import InboxSection from '../inbox/InboxSection.jsx';

function Sidebar({
  boards,
  activeBoardId,
  onSelectBoard,
  onCreateBoard,
  inboxCards,
  draggingInboxCardId,
  inboxDropPreview,
  inboxDropActive,
  onInboxUpdate,
  onOpenInboxCard,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'inbox-drop',
    data: { type: 'inbox-drop' },
  });

  const { setNodeRef: setSidebarDropRef, isOver: isSidebarOver } = useDroppable({
    id: 'sidebar-inbox-drop',
    data: { type: 'sidebar-inbox-drop' },
  });

  const isTarget = inboxDropPreview !== null || inboxDropActive || isOver || isSidebarOver;

  return (
    <aside
      ref={setNodeRef}
      className={`flex h-full w-[min(100%,304px)] shrink-0 flex-col border-r border-slate-200/90 bg-[#e8edf5] sm:w-[304px] md:w-[320px] ${
        isTarget ? 'shadow-[inset_0_0_0_2px_rgba(124,58,237,0.45)]' : ''
      }`}
    >
      <div
        ref={setSidebarDropRef}
        className="flex shrink-0 items-center justify-between border-b border-slate-200/90 px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <FiInbox className="text-slate-600" size={18} />
          <h2 className="text-[15px] font-semibold text-slate-800">Inbox</h2>
        </div>
      </div>

      <InboxSection
        inboxCards={inboxCards}
        draggingInboxCardId={draggingInboxCardId}
        inboxDropPreview={inboxDropPreview}
        onInboxUpdate={onInboxUpdate}
        onOpenCard={onOpenInboxCard}
      />

      <div className="shrink-0 border-t border-slate-200/90 bg-[#dfe6f0]/60 px-2 py-2">
        <button
          type="button"
          onClick={onCreateBoard}
          className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-300/80 bg-white/80 px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-white hover:text-slate-900"
        >
          <FiPlus size={14} />
          Create board
        </button>
        <BoardsList boards={boards} activeBoardId={activeBoardId} onSelect={onSelectBoard} />
      </div>
    </aside>
  );
}

export default memo(Sidebar);
