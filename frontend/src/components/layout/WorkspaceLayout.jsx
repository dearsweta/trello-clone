import { memo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Sidebar from '../sidebar/Sidebar.jsx';
import Topbar from '../topbar/Topbar.jsx';
import BoardPage from '../board/BoardPage.jsx';
import InboxPage from '../inbox/InboxPage.jsx';
import CardModal from '../modal/CardModal.jsx';
import InboxCardModal from '../inbox/InboxCardModal.jsx';
import { useWorkspaceDnd } from '../../hooks/useWorkspaceDnd.js';

function WorkspaceLayout({
  boards,
  board,
  inboxCards,
  viewMode,
  inboxActive,
  search,
  filters,
  activeBoardCard,
  activeInboxCard,
  loading,
  error,
  onSelectBoard,
  onSelectInbox,
  onCreateBoard,
  onSearchChange,
  onFiltersChange,
  onBackgroundChange,
  onBoardUpdate,
  onInboxUpdate,
  onOpenBoardCard,
  onOpenInboxCard,
  onCloseBoardCard,
  onCloseInboxCard,
  onBoardCardUpdate,
  onBoardCardDelete,
  onBoardCardArchive,
  onMembersChange,
  onLabelsChange,
  onAddChecklist,
  onToggleChecklist,
  onDeleteChecklist,
  onInboxCardUpdate,
  onInboxCardDelete,
}) {
  const dnd = useWorkspaceDnd({
    board,
    setBoard: onBoardUpdate,
    inboxCards,
    setInboxCards: onInboxUpdate,
    viewMode,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1f26] text-white">
        Loading TaskFlow...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1e1f26] p-6 text-center text-white">
        <p className="text-red-300">{error}</p>
        <p className="text-sm text-slate-400">
          Run db/schema.sql and db/seed.sql (or db/migrate_global_inbox.sql), then start the backend.
        </p>
      </div>
    );
  }

  const mainBackground = viewMode === 'inbox' ? '#5b21b6' : board?.background ?? '#7C3AED';

  return (
    <DndContext
      sensors={dnd.sensors}
      collisionDetection={dnd.collisionDetection}
      onDragStart={dnd.onDragStart}
      onDragOver={dnd.onDragOver}
      onDragEnd={dnd.onDragEnd}
      onDragCancel={dnd.onDragCancel}
    >
      <div className="flex min-h-screen">
        <Sidebar
          boards={boards}
          activeBoardId={board?.id}
          inboxActive={inboxActive}
          inboxCardCount={inboxCards.length}
          inboxDropActive={dnd.inboxDropActive}
          onSelectBoard={onSelectBoard}
          onSelectInbox={onSelectInbox}
          onCreateBoard={onCreateBoard}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <div style={{ backgroundColor: mainBackground }}>
            <Topbar
              boardTitle={viewMode === 'inbox' ? 'Inbox' : board?.title ?? 'Board'}
              boardBackground={mainBackground}
              labels={board?.labels ?? []}
              members={board?.members ?? []}
              search={search}
              filters={filters}
              onSearchChange={onSearchChange}
              onFiltersChange={onFiltersChange}
              onBackgroundChange={viewMode === 'board' ? onBackgroundChange : () => {}}
            />
          </div>
          <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: mainBackground }}>
            {viewMode === 'inbox' ? (
              <InboxPage
                inboxCards={inboxCards}
                draggingInboxCardId={dnd.draggingInboxCardId}
                inboxDropPreview={dnd.inboxDropPreview}
                inboxDropActive={dnd.inboxDropActive}
                onInboxUpdate={onInboxUpdate}
                onOpenCard={onOpenInboxCard}
              />
            ) : (
              board && (
                <BoardPage
                  board={board}
                  filters={{ ...filters, search }}
                  draggingBoardCardId={dnd.draggingBoardCardId}
                  dropPreview={dnd.dropPreview}
                  onBoardUpdate={onBoardUpdate}
                  onOpenCard={onOpenBoardCard}
                />
              )
            )}
          </main>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {dnd.activeDrag?.type === 'board-card' && (
          <div className="w-64 rotate-1 rounded-lg bg-white p-3 shadow-xl ring-1 ring-violet-200">
            <p className="text-sm font-medium text-slate-800">{dnd.activeDrag.card.title}</p>
          </div>
        )}
        {dnd.activeDrag?.type === 'inbox-card' && (
          <div className="w-64 rotate-1 rounded-lg bg-white p-3 shadow-xl ring-1 ring-violet-300">
            <p className="text-sm font-medium text-slate-800">{dnd.activeDrag.card.title}</p>
          </div>
        )}
      </DragOverlay>

      {activeBoardCard && board && (
        <CardModal
          card={activeBoardCard}
          labels={board.labels}
          members={board.members}
          onClose={onCloseBoardCard}
          onUpdate={onBoardCardUpdate}
          onDelete={onBoardCardDelete}
          onArchive={onBoardCardArchive}
          onMembersChange={onMembersChange}
          onLabelsChange={onLabelsChange}
          onAddChecklist={onAddChecklist}
          onToggleChecklist={onToggleChecklist}
          onDeleteChecklist={onDeleteChecklist}
        />
      )}

      {activeInboxCard && (
        <InboxCardModal
          card={activeInboxCard}
          onClose={onCloseInboxCard}
          onUpdate={onInboxCardUpdate}
          onDelete={onInboxCardDelete}
        />
      )}
    </DndContext>
  );
}

export default memo(WorkspaceLayout);
