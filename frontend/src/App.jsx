import { useCallback, useEffect, useMemo, useState } from 'react';
import WorkspaceLayout from './components/layout/WorkspaceLayout.jsx';
import * as boardsApi from './api/boards.js';
import * as cardsApi from './api/cards.js';
import * as checklistApi from './api/checklist.js';
import * as inboxApi from './api/inbox.js';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);
  const [inboxCards, setInboxCards] = useState([]);
  const [viewMode, setViewMode] = useState('board');
  const [activeBoardCardId, setActiveBoardCardId] = useState(null);
  const [activeInboxCardId, setActiveInboxCardId] = useState(null);
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

  const loadInbox = useCallback(async () => {
    const cards = await inboxApi.fetchInbox();
    setInboxCards(cards);
    return cards;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [list] = await Promise.all([loadBoards(), loadInbox()]);
        if (list.length) {
          await loadBoard(list[0].id);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to connect to API');
      } finally {
        setLoading(false);
      }
    })();
  }, [loadBoards, loadBoard, loadInbox]);

  const activeBoardCard = useMemo(() => {
    if (!board || !activeBoardCardId) return null;
    for (const list of board.lists) {
      const card = list.cards?.find((c) => c.id === activeBoardCardId);
      if (card) return card;
    }
    return null;
  }, [board, activeBoardCardId]);

  const activeInboxCard = useMemo(
    () => inboxCards.find((c) => c.id === activeInboxCardId) ?? null,
    [inboxCards, activeInboxCardId]
  );

  const updateCardInBoard = (updatedCard) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => ({
        ...list,
        cards: (list.cards || []).map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c)),
      })),
    }));
  };

  const updateInboxCardLocal = (updatedCard) => {
    setInboxCards((prev) => prev.map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c)));
  };

  const handleSelectBoard = async (id) => {
    setViewMode('board');
    setActiveBoardCardId(null);
    setActiveInboxCardId(null);
    try {
      await loadBoard(id);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSelectInbox = () => {
    setViewMode('inbox');
    setActiveBoardCardId(null);
    setActiveInboxCardId(null);
  };

  return (
    <WorkspaceLayout
      boards={boards}
      board={board}
      inboxCards={inboxCards}
      viewMode={viewMode}
      inboxActive={viewMode === 'inbox'}
      search={search}
      filters={filters}
      activeBoardCard={activeBoardCard}
      activeInboxCard={activeInboxCard}
      loading={loading}
      error={error}
      onSelectBoard={handleSelectBoard}
      onSelectInbox={handleSelectInbox}
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
      onInboxUpdate={setInboxCards}
      onOpenBoardCard={setActiveBoardCardId}
      onOpenInboxCard={setActiveInboxCardId}
      onCloseBoardCard={() => setActiveBoardCardId(null)}
      onCloseInboxCard={() => setActiveInboxCardId(null)}
      onBoardCardUpdate={async (data) => {
        const updated = await cardsApi.updateCard(activeBoardCard.id, data);
        updateCardInBoard(updated);
      }}
      onBoardCardDelete={async () => {
        const updated = await cardsApi.deleteCard(activeBoardCard.id);
        if (updated) {
          setBoard(updated);
          setActiveBoardCardId(null);
        }
      }}
      onBoardCardArchive={async () => {
        const res = await cardsApi.archiveCard(activeBoardCard.id, true);
        if (res.board) {
          setBoard(res.board);
          setActiveBoardCardId(null);
        }
      }}
      onMembersChange={async (memberIds) => {
        const res = await cardsApi.setCardMembers(activeBoardCard.id, memberIds);
        updateCardInBoard(res.card);
      }}
      onLabelsChange={async (labelIds) => {
        const res = await cardsApi.setCardLabels(activeBoardCard.id, labelIds);
        updateCardInBoard(res.card);
      }}
      onAddChecklist={async (text) => {
        const item = await checklistApi.createChecklistItem(activeBoardCard.id, text);
        updateCardInBoard({
          ...activeBoardCard,
          checklistItems: [...(activeBoardCard.checklistItems || []), item],
        });
      }}
      onToggleChecklist={async (id, completed) => {
        const item = await checklistApi.updateChecklistItem(id, completed);
        updateCardInBoard({
          ...activeBoardCard,
          checklistItems: (activeBoardCard.checklistItems || []).map((i) =>
            i.id === id ? item : i
          ),
        });
      }}
      onDeleteChecklist={async (id) => {
        await checklistApi.deleteChecklistItem(id);
        updateCardInBoard({
          ...activeBoardCard,
          checklistItems: (activeBoardCard.checklistItems || []).filter((i) => i.id !== id),
        });
      }}
      onInboxCardUpdate={async (data) => {
        const updated = await inboxApi.updateInbox(activeInboxCard.id, data);
        updateInboxCardLocal(updated);
      }}
      onInboxCardDelete={async () => {
        const result = await inboxApi.deleteInbox(activeInboxCard.id);
        if (result?.cards) setInboxCards(result.cards);
        setActiveInboxCardId(null);
      }}
    />
  );
}
