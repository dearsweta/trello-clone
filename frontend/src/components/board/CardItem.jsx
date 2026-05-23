import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiClock } from 'react-icons/fi';
import { getInitials } from '../../utils/initials.js';
import { formatDueDate, isOverdue } from '../../utils/date.js';

export default function CardItem({ card, labels, members, onOpen, dimmed }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: 'card', card, listId: card.listId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : dimmed ? 0.35 : 1,
  };

  const cardLabels = labels.filter((l) => card.labelIds?.includes(l.id));
  const cardMembers = members.filter((m) => card.memberIds?.includes(m.id));

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card.id)}
      className="cursor-grab rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80 hover:ring-slate-300 active:cursor-grabbing"
    >
      {card.coverImageUrl && (
        <div className="h-24 w-full rounded-t-lg bg-cover bg-center" style={{ backgroundImage: `url(${card.coverImageUrl})` }} />
      )}
      <div className="p-2.5">
        {cardLabels.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {cardLabels.map((l) => (
              <span key={l.id} className="inline-block h-2 min-w-[40px] rounded-sm" style={{ backgroundColor: l.color }} title={l.name} />
            ))}
          </div>
        )}
        <p className="text-sm font-medium text-slate-800">{card.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {card.dueDate && (
            <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${isOverdue(card.dueDate) ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
              <FiClock size={12} />
              {formatDueDate(card.dueDate)}
            </span>
          )}
          {card.checklistItems?.length > 0 && (
            <span className="text-xs text-slate-500">
              {card.checklistItems.filter((i) => i.completed).length}/{card.checklistItems.length}
            </span>
          )}
          {cardMembers.length > 0 && (
            <div className="ml-auto flex -space-x-1">
              {cardMembers.map((m) => (
                <span key={m.id} className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white" style={{ backgroundColor: m.avatarColor }} title={m.name}>
                  {getInitials(m.name)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
