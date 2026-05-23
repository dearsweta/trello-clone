import { memo, useCallback, useMemo } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import ListColumn from './ListColumn.jsx';
import AddListButton from './AddListButton.jsx';
import * as listsApi from '../../api/lists.js';
import * as cardsApi from '../../api/cards.js';

function BoardPage({
  board,
  filters,
  draggingBoardCardId,
  dropPreview,
  onBoardUpdate,
  onOpenCard,
}) {
  const boardLists = useMemo(
    () => [...board.lists].sort((a, b) => a.position - b.position),
    [board.lists]
  );

  const hasActiveFilters = Boolean(
    filters.search || filters.dueDate || filters.labelIds?.length || filters.memberIds?.length
  );

  const listSortableIds = useMemo(
    () => boardLists.map((l) => `list-${l.id}`),
    [boardLists]
  );

  const handleAddCard = useCallback(
    async (listId, title) => {
      const res = await cardsApi.createCard(listId, title);
      if (res.board) onBoardUpdate(res.board);
    },
    [onBoardUpdate]
  );

  const handleRenameList = useCallback(
    async (listId, title) => {
      await listsApi.updateList(listId, title);
      onBoardUpdate({
        ...board,
        lists: board.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
      });
    },
    [board, onBoardUpdate]
  );

  const handleDeleteList = useCallback(
    async (listId) => {
      const updated = await listsApi.deleteList(listId);
      if (updated) onBoardUpdate(updated);
    },
    [onBoardUpdate]
  );

  const handleAddList = useCallback(
    async (title) => {
      const res = await listsApi.createList(board.id, title);
      if (res.board) onBoardUpdate(res.board);
    },
    [board.id, onBoardUpdate]
  );

  return (
    <div className="flex flex-1 gap-3 overflow-x-auto overflow-y-hidden px-4 pb-4 pt-1">
      <SortableContext items={listSortableIds} strategy={horizontalListSortingStrategy}>
        {boardLists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            labels={board.labels}
            members={board.members}
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            draggingCardId={draggingBoardCardId}
            dropPreview={dropPreview}
            onOpenCard={onOpenCard}
            onAddCard={handleAddCard}
            onRenameList={handleRenameList}
            onDeleteList={handleDeleteList}
            sortable
          />
        ))}
      </SortableContext>
      <AddListButton onAdd={handleAddList} />
    </div>
  );
}

export default memo(BoardPage);
