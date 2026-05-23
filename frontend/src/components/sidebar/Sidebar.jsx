import { FiLayout } from 'react-icons/fi';
import BoardsList from './BoardsList.jsx';
import Inbox from './Inbox.jsx';

export default function Sidebar({ boards, activeBoardId, inboxActive, onSelectBoard, onSelectInbox, onCreateBoard }) {
  return (
    <aside className="flex w-56 shrink-0 flex-col bg-slate-900 text-white md:w-64">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
        <FiLayout className="text-violet-400" size={22} />
        <span className="text-lg font-bold tracking-tight">Kanban</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto py-3">
        <Inbox active={inboxActive} onSelect={onSelectInbox} />
        <BoardsList
          boards={boards}
          activeBoardId={inboxActive ? null : activeBoardId}
          onSelect={onSelectBoard}
          onCreate={onCreateBoard}
        />
      </div>
    </aside>
  );
}
