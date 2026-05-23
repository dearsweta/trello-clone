import { useCallback, useEffect, useMemo, useState } from 'react';
import WorkspaceLayout from './components/layout/WorkspaceLayout.jsx';
import * as boardsApi from './api/boards.js';
import * as cardsApi from './api/cards.js';
import * as checklistApi from './api/checklist.js';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);
  const [viewMode, setViewMode] = useState('board');
  const [activeCardId, setActiveCardId] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ labelIds: [], memberIds: [], dueDate: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBoards = useCallback(async () => {
    const data = await boardsApi.fetchBoards();
    setBoards(data);
    return data;
  }, []);

  const loadBoard = useCallback(async (boardId) => {
    const data = await boardsApi.fetchBoard(boardId);
    setBoard(data);
    return data;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await loadBoards();
        if (list.length) {
          await loadBoard(list[0].id);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to connect to API');
      } finally {
        setLoading(false);
      }
    })();
  }, [loadBoards, loadBoard]);

  const activeCard = useMemo(() => {
    if (!board || !activeCardId) return null;
    for (const list of board.lists) {
      const card = list.cards?.find((c) => c.id === activeCardId);
      if (card) return card;
    }
    return null;
  }, [board, activeCardId]);

  const updateCardInBoard = (updatedCard) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => ({
        ...list,
        cards: (list.cards || []).map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c)),
      })),
    }));
  };

  return (
    <WorkspaceLayout
      boards={boards}
      board={board}
      viewMode={viewMode}
      inboxActive={viewMode === 'inbox'}
      search={search}
      filters={filters}
      activeCard={activeCard}
      loading={loading}
      error={error}
      onSelectBoard={async (id) => { setViewMode('board'); setActiveCardId(null); try { await loadBoard(id); } catch (e) { setError(e.message); } }}
      onSelectInbox={() => { setViewMode('inbox'); setActiveCardId(null); }}
      onCreateBoard={async () => {
        const title = window.prompt('Board title');
        if (!title?.trim()) return;
        const created = await boardsApi.createBoard(title.trim());
        await loadBoards();
        setBoard(created);
        setViewMode('board');
      }}
      onSearchChange={setSearch}
      onFiltersChange={setFilters}
      onBackgroundChange={async (background) => {
        const updated = await boardsApi.updateBoard(board.id, { background });
        setBoard(updated);
        setBoards((prev) => prev.map((b) => (b.id === updated.id ? { ...b, background } : b)));
      }}
      onBoardUpdate={setBoard}
      onOpenCard={setActiveCardId}
      onCloseCard={() => setActiveCardId(null)}
      onCardUpdate={async (data) => { const updated = await cardsApi.updateCard(activeCard.id, data); updateCardInBoard(updated); }}
      onCardDelete={async () => { const updated = await cardsApi.deleteCard(activeCard.id); if (updated) { setBoard(updated); setActiveCardId(null); } }}
      onCardArchive={async () => { const res = await cardsApi.archiveCard(activeCard.id, true); if (res.board) { setBoard(res.board); setActiveCardId(null); } }}
      onMembersChange={async (memberIds) => { const res = await cardsApi.setCardMembers(activeCard.id, memberIds); updateCardInBoard(res.card); }}
      onLabelsChange={async (labelIds) => { const res = await cardsApi.setCardLabels(activeCard.id, labelIds); updateCardInBoard(res.card); }}
      onAddChecklist={async (text) => {
        const item = await checklistApi.createChecklistItem(activeCard.id, text);
        updateCardInBoard({ ...activeCard, checklistItems: [...(activeCard.checklistItems || []), item] });
      }}
      onToggleChecklist={async (id, completed) => {
        const item = await checklistApi.updateChecklistItem(id, completed);
        updateCardInBoard({ ...activeCard, checklistItems: (activeCard.checklistItems || []).map((i) => (i.id === id ? item : i)) });
      }}
      onDeleteChecklist={async (id) => {
        await checklistApi.deleteChecklistItem(id);
        updateCardInBoard({ ...activeCard, checklistItems: (activeCard.checklistItems || []).filter((i) => i.id !== id) });
      }}
    />
  );
}
