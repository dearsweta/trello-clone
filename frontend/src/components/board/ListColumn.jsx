import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMoreHorizontal } from 'react-icons/fi';
import CardItem from './CardItem.jsx';
import AddCardButton from './AddCardButton.jsx';
import { filterListCards } from '../../utils/filterCards.js';

function ListHeader({ list, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const save = async () => {
    const t = title.trim();
    if (t && t !== list.title) await onRename(list.id, t);
    setEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-2">
      {editing ? (
        <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === 'Enter' && save()} className="flex-1 rounded border border-slate-300 px-2 py-0.5 text-sm font-semibold outline-none" />
      ) : (
        <h3 className="cursor-pointer text-sm font-semibold text-slate-700" onClick={() => list.type !== 'inbox' && setEditing(true)}>{list.title}</h3>
      )}
      {list.type !== 'inbox' && (
        <button type="button" onClick={() => onDelete(list.id)} className="rounded p-1 text-slate-400 hover:bg-slate-200"><FiMoreHorizontal size={16} /></button>
      )}
    </div>
  );
}

function SortableListShell({ list, header, body }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `list-${list.id}`,
    data: { type: 'list', list },
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <section ref={setNodeRef} style={style} className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-slate-100/90">
      <div {...attributes} {...listeners}>{header}</div>
      {body}
    </section>
  );
}

export default function ListColumn({ list, labels, members, filters, hasActiveFilters, onOpenCard, onAddCard, onRenameList, onDeleteList, sortable = true }) {
  const { setNodeRef, isOver } = useDroppable({ id: `list-drop-${list.id}`, data: { type: 'list-drop', listId: list.id } });
  const allCards = list.cards || [];
  const visibleCards = filterListCards(allCards, filters);
  const hiddenIds = new Set(hasActiveFilters ? allCards.filter((c) => !visibleCards.find((v) => v.id === c.id)).map((c) => c.id) : []);
  const cardIds = allCards.map((c) => `card-${c.id}`);
  const header = <ListHeader list={list} onRename={onRenameList} onDelete={onDeleteList} />;
  const body = (
    <div ref={setNodeRef} className={`flex min-h-[40px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 ${isOver ? 'rounded-lg bg-violet-50/50' : ''}`}>
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        {allCards.map((card) => (
          <CardItem key={card.id} card={card} labels={labels} members={members} onOpen={onOpenCard} dimmed={hiddenIds.has(card.id)} />
        ))}
      </SortableContext>
      <AddCardButton onAdd={(title) => onAddCard(list.id, title)} />
    </div>
  );
  if (!sortable) {
    return <section className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-slate-100/90">{header}{body}</section>;
  }
  return <SortableListShell list={list} header={header} body={body} />;
}
