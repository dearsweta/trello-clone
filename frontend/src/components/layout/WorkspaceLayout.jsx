import Sidebar from '../sidebar/Sidebar.jsx';
import Topbar from '../topbar/Topbar.jsx';
import BoardPage from '../board/BoardPage.jsx';
import CardModal from '../modal/CardModal.jsx';

export default function WorkspaceLayout({
  boards, board, viewMode, inboxActive, search, filters, activeCard, loading, error,
  onSelectBoard, onSelectInbox, onCreateBoard, onSearchChange, onFiltersChange, onBackgroundChange,
  onBoardUpdate, onOpenCard, onCloseCard, onCardUpdate, onCardDelete, onCardArchive,
  onMembersChange, onLabelsChange, onAddChecklist, onToggleChecklist, onDeleteChecklist,
}) {
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">Loading workspace...</div>;
  }
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-center text-white">
        <p className="text-red-300">{error}</p>
        <p className="text-sm text-slate-400">Start MySQL, run db/schema.sql and db/seed.sql, then npm run dev in backend.</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar boards={boards} activeBoardId={board?.id} inboxActive={inboxActive} onSelectBoard={onSelectBoard} onSelectInbox={onSelectInbox} onCreateBoard={onCreateBoard} />
      <div className="flex min-w-0 flex-1 flex-col">
        {board && (
          <>
            <div style={{ backgroundColor: board.background }}>
              <Topbar
                boardTitle={viewMode === 'inbox' ? `${board.title} — Inbox` : board.title}
                boardBackground={board.background}
                labels={board.labels}
                members={board.members}
                search={search}
                filters={filters}
                onSearchChange={onSearchChange}
                onFiltersChange={onFiltersChange}
                onBackgroundChange={onBackgroundChange}
              />
            </div>
            <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: board.background }}>
              <BoardPage board={board} viewMode={viewMode} filters={{ ...filters, search }} onBoardUpdate={onBoardUpdate} onOpenCard={onOpenCard} />
            </main>
          </>
        )}
      </div>
      {activeCard && (
        <CardModal
          card={activeCard}
          labels={board.labels}
          members={board.members}
          onClose={onCloseCard}
          onUpdate={onCardUpdate}
          onDelete={onCardDelete}
          onArchive={onCardArchive}
          onMembersChange={onMembersChange}
          onLabelsChange={onLabelsChange}
          onAddChecklist={onAddChecklist}
          onToggleChecklist={onToggleChecklist}
          onDeleteChecklist={onDeleteChecklist}
        />
      )}
    </div>
  );
}
