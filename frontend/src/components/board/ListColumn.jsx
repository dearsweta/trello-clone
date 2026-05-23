import { memo, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMoreHorizontal } from 'react-icons/fi';
import CardItem from './CardItem.jsx';
import AddCardButton from './AddCardButton.jsx';
import InsertionPlaceholder from './InsertionPlaceholder.jsx';
import EmptyListDropZone from './EmptyListDropZone.jsx';
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
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="flex-1 rounded border border-slate-300 px-2 py-0.5 text-sm font-semibold outline-none"
        />
      ) : (
        <h3
          className="cursor-pointer text-sm font-semibold text-slate-700"
          onClick={() => setEditing(true)}
        >
          {list.title}
        </h3>
      )}
      <button
        type="button"
        onClick={() => onDelete(list.id)}
        className="rounded p-1 text-slate-400 hover:bg-slate-200"
      >
        <FiMoreHorizontal size={16} />
      </button>
    </div>
  );
}

function SortableListShell({ list, header, body }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `list-${list.id}`,
    data: { type: 'list', list },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <section
      ref={setNodeRef}
      style={style}
      className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-slate-100/95 shadow-sm"
    >
      <div {...attributes} {...listeners}>{header}</div>
      {body}
    </section>
  );
}

function ListColumn({
  list,
  labels,
  members,
  filters,
  hasActiveFilters,
  draggingCardId,
  dropPreview,
  onOpenCard,
  onAddCard,
  onRenameList,
  onDeleteList,
  sortable = true,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-drop-${list.id}`,
    data: { type: 'list-drop', listId: list.id },
  });

  const allCards = list.cards || [];
  const isDropTarget = dropPreview?.listId === list.id;
  const visibleCards = draggingCardId
    ? allCards.filter((c) => c.id !== draggingCardId)
    : allCards;

  const hiddenIds = useMemo(() => {
    if (!hasActiveFilters) return new Set();
    const visible = filterListCards(allCards, filters);
    return new Set(
      allCards.filter((c) => !visible.some((v) => v.id === c.id)).map((c) => c.id)
    );
  }, [allCards, filters, hasActiveFilters]);

  const cardIds = useMemo(
    () => visibleCards.map((c) => `card-${c.id}`),
    [visibleCards]
  );

  const renderCardsWithPlaceholder = () => {
    if (!isDropTarget || !dropPreview) {
      return visibleCards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          labels={labels}
          members={members}
          onOpen={onOpenCard}
          dimmed={hiddenIds.has(card.id)}
        />
      ));
    }

    const nodes = [];
    const beforeId = dropPreview.beforeCardId;

    if (!beforeId && visibleCards.length === 0) {
      return [<InsertionPlaceholder key="placeholder-start" />];
    }

    if (!beforeId) {
      visibleCards.forEach((card) => {
        nodes.push(
          <CardItem
            key={card.id}
            card={card}
            labels={labels}
            members={members}
            onOpen={onOpenCard}
            dimmed={hiddenIds.has(card.id)}
          />
        );
      });
      nodes.push(<InsertionPlaceholder key="placeholder-end" />);
      return nodes;
    }

    visibleCards.forEach((card) => {
      if (card.id === beforeId) {
        nodes.push(<InsertionPlaceholder key="placeholder-before" />);
      }
      nodes.push(
        <CardItem
          key={card.id}
          card={card}
          labels={labels}
          members={members}
          onOpen={onOpenCard}
          dimmed={hiddenIds.has(card.id)}
        />
      );
    });

    return nodes;
  };

  const header = <ListHeader list={list} onRename={onRenameList} onDelete={onDeleteList} />;
  const body = (
    <div
      ref={setNodeRef}
      className={`flex min-h-[120px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 ${
        isOver || isDropTarget ? 'rounded-lg bg-violet-50/50 ring-1 ring-violet-300/40' : ''
      }`}
    >
      {visibleCards.length === 0 ? (
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <EmptyListDropZone listId={list.id} isTarget={isDropTarget && !dropPreview?.beforeCardId} />
        </SortableContext>
      ) : (
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {renderCardsWithPlaceholder()}
        </SortableContext>
      )}
      <AddCardButton onAdd={(title) => onAddCard(list.id, title)} />
    </div>
  );

  if (!sortable) {
    return (
      <section className="flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-slate-100/95 shadow-sm">
        {header}
        {body}
      </section>
    );
  }

  return <SortableListShell list={list} header={header} body={body} />;
}

export default memo(ListColumn, (prev, next) => {
  return (
    prev.list === next.list &&
    prev.labels === next.labels &&
    prev.members === next.members &&
    prev.filters === next.filters &&
    prev.hasActiveFilters === next.hasActiveFilters &&
    prev.sortable === next.sortable &&
    prev.draggingCardId === next.draggingCardId &&
    prev.dropPreview === next.dropPreview &&
    prev.onOpenCard === next.onOpenCard &&
    prev.onAddCard === next.onAddCard &&
    prev.onRenameList === next.onRenameList &&
    prev.onDeleteList === next.onDeleteList
  );
});
