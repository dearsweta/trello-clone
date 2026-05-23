import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import ListColumn from './ListColumn.jsx';
import AddListButton from './AddListButton.jsx';
import { getMidPosition } from '../../utils/position.js';
import * as listsApi from '../../api/lists.js';
import * as cardsApi from '../../api/cards.js';
import * as boardsApi from '../../api/boards.js';

export default function BoardPage({ board, viewMode, filters, onBoardUpdate, onOpenCard }) {
  const [activeDrag, setActiveDrag] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const inboxList = board.lists.find((l) => l.type === 'inbox');
  const boardLists = board.lists.filter((l) => l.type === 'board').sort((a, b) => a.position - b.position);
  const displayLists = viewMode === 'inbox' && inboxList ? [inboxList] : boardLists;
  const hasActiveFilters = Boolean(filters.search || filters.dueDate || filters.labelIds?.length || filters.memberIds?.length);

  const findCard = (cardId) => {
    for (const list of board.lists) {
      const card = list.cards?.find((c) => c.id === cardId);
      if (card) return { card, list };
    }
    return null;
  };

  const handleDragStart = (event) => {
    const id = String(event.active.id);
    if (id.startsWith('card-')) {
      const found = findCard(Number(id.replace('card-', '')));
      if (found) setActiveDrag({ type: 'card', card: found.card });
    }
  };

  const handleDragEnd = async (event) => {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('list-')) {
      const listId = Number(activeId.replace('list-', ''));
      const lists = boardLists;
      const oldIndex = lists.findIndex((l) => l.id === listId);
      let newIndex = oldIndex;
      if (overId.startsWith('list-')) newIndex = lists.findIndex((l) => l.id === Number(overId.replace('list-', '')));
      if (oldIndex === newIndex || oldIndex < 0) return;
      const reordered = [...lists];
      const [removed] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, removed);
      const newPosition = getMidPosition(reordered[newIndex - 1]?.position ?? null, reordered[newIndex + 1]?.position ?? null);
      await listsApi.reorderList(listId, newPosition);
      onBoardUpdate(await boardsApi.fetchBoard(board.id));
      return;
    }

    if (activeId.startsWith('card-')) {
      const cardId = Number(activeId.replace('card-', ''));
      const found = findCard(cardId);
      if (!found) return;
      let targetListId = found.list.id;
      if (overId.startsWith('list-drop-')) targetListId = Number(overId.replace('list-drop-', ''));
      else if (overId.startsWith('card-')) {
        const overCard = findCard(Number(overId.replace('card-', '')));
        if (overCard) targetListId = overCard.list.id;
      }
      const targetList = board.lists.find((l) => l.id === targetListId);
      if (!targetList) return;
      const cards = [...(targetList.cards || [])].filter((c) => c.id !== cardId);
      let insertIndex = cards.length;
      if (overId.startsWith('card-')) {
        insertIndex = cards.findIndex((c) => c.id === Number(overId.replace('card-', '')));
        if (insertIndex < 0) insertIndex = cards.length;
      }
      const newPosition = getMidPosition(insertIndex > 0 ? cards[insertIndex - 1]?.position : null, insertIndex < cards.length ? cards[insertIndex]?.position : null);
      if (targetListId === found.list.id && found.card.position === newPosition) return;
      if (targetListId !== found.list.id) await cardsApi.moveCard(cardId, targetListId, newPosition);
      else await cardsApi.reorderCard(cardId, newPosition);
      onBoardUpdate(await boardsApi.fetchBoard(board.id));
    }
  };

  const listSortableIds = displayLists.filter((l) => l.type === 'board').map((l) => `list-${l.id}`);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-1 gap-4 overflow-x-auto overflow-y-hidden px-4 pb-4">
        <SortableContext items={listSortableIds} strategy={horizontalListSortingStrategy}>
          {displayLists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              labels={board.labels}
              members={board.members}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              onOpenCard={onOpenCard}
              onAddCard={async (listId, title) => { const res = await cardsApi.createCard(listId, title); if (res.board) onBoardUpdate(res.board); }}
              onRenameList={async (listId, title) => { await listsApi.updateList(listId, title); onBoardUpdate({ ...board, lists: board.lists.map((l) => (l.id === listId ? { ...l, title } : l)) }); }}
              onDeleteList={async (listId) => { const updated = await listsApi.deleteList(listId); if (updated) onBoardUpdate(updated); }}
              sortable={list.type === 'board' && viewMode === 'board'}
            />
          ))}
        </SortableContext>
        {viewMode === 'board' && <AddListButton onAdd={async (title) => { const res = await listsApi.createList(board.id, title); if (res.board) onBoardUpdate(res.board); }} />}
      </div>
      <DragOverlay>
        {activeDrag?.type === 'card' && (
          <div className="w-64 rotate-2 rounded-lg bg-white p-3 shadow-lg ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-800">{activeDrag.card.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
