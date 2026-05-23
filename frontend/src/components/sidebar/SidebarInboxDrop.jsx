import { useDroppable } from '@dnd-kit/core';
import Inbox from './Inbox.jsx';

export default function SidebarInboxDrop({ active, cardCount, dropActive, onSelect }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'sidebar-inbox-drop',
    data: { type: 'sidebar-inbox-drop' },
  });

  const highlighted = isOver || dropActive;

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl transition ${highlighted ? 'ring-2 ring-violet-400/70 ring-offset-2 ring-offset-[#1e1f26]' : ''}`}
    >
      <Inbox active={active} cardCount={cardCount} highlighted={highlighted} onSelect={onSelect} />
    </div>
  );
}
