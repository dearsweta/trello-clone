import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getInitials } from '../../utils/initials.js';

function InboxCardItem({ card, onOpen, dimmed }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `inbox-card-${card.id}`,
    data: { type: 'inbox-card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : dimmed ? 0.35 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card.id)}
      className="cursor-grab rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80 hover:ring-violet-300 active:cursor-grabbing"
    >
      <div className="p-3">
        <p className="text-sm font-medium text-slate-800">{card.title}</p>
        {card.description && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{card.description}</p>
        )}
        {card.createdByMember && (
          <div className="mt-2 flex justify-end">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: card.createdByMember.avatarColor }}
              title={card.createdByMember.name}
            >
              {getInitials(card.createdByMember.name)}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(InboxCardItem);
