import { memo, useMemo, useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import InboxCardItem from './InboxCardItem.jsx';
import InsertionPlaceholder from '../board/InsertionPlaceholder.jsx';
import * as inboxApi from '../../api/inbox.js';

function InboxSection({
  inboxCards,
  draggingInboxCardId,
  inboxDropPreview,
  onInboxUpdate,
  onOpenCard,
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const visibleCards = draggingInboxCardId
    ? inboxCards.filter((c) => c.id !== draggingInboxCardId)
    : inboxCards;

  const cardIds = useMemo(() => visibleCards.map((c) => `inbox-card-${c.id}`), [visibleCards]);

  const submitNew = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const result = await inboxApi.createInbox({ title: t });
    if (result.cards) onInboxUpdate(result.cards);
    setTitle('');
    setAdding(false);
  };

  const renderCards = () => {
    if (!inboxDropPreview) {
      return visibleCards.map((card) => (
        <InboxCardItem key={card.id} card={card} onOpen={onOpenCard} dimmed={false} />
      ));
    }

    const nodes = [];
    const beforeId = inboxDropPreview.beforeInboxCardId;

    if (!beforeId && visibleCards.length === 0) {
      return [<InsertionPlaceholder key="inbox-ph" />];
    }

    if (!beforeId) {
      visibleCards.forEach((card) => {
        nodes.push(<InboxCardItem key={card.id} card={card} onOpen={onOpenCard} dimmed={false} />);
      });
      nodes.push(<InsertionPlaceholder key="inbox-ph-end" />);
      return nodes;
    }

    visibleCards.forEach((card) => {
      if (card.id === beforeId) {
        nodes.push(<InsertionPlaceholder key="inbox-ph" />);
      }
      nodes.push(<InboxCardItem key={card.id} card={card} onOpen={onOpenCard} dimmed={false} />);
    });
    return nodes;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2 pb-1 pt-1">
      {adding ? (
        <form onSubmit={submitNew} className="mb-2 shrink-0">
          <textarea
            autoFocus
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a card"
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-400"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
            >
              Add card
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setTitle('');
              }}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mb-2 shrink-0 rounded-lg bg-white px-2.5 py-2 text-left text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition hover:text-slate-700"
        >
          Add a card
        </button>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {visibleCards.length === 0 && !inboxDropPreview ? (
          <div className="flex min-h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300/80 bg-white/40 px-3 py-5 text-center">
            <p className="text-sm font-medium text-slate-600">Drop cards here</p>
            <p className="mt-1 text-xs text-slate-500">Drag from any board list</p>
          </div>
        ) : (
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {renderCards()}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

export default memo(InboxSection);
