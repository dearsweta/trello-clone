import { memo, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FiPlus } from 'react-icons/fi';
import InboxCardItem from './InboxCardItem.jsx';
import InsertionPlaceholder from '../board/InsertionPlaceholder.jsx';
import * as inboxApi from '../../api/inbox.js';

function InboxDropArea({ children, isTarget }) {
  const { setNodeRef } = useDroppable({
    id: 'inbox-drop',
    data: { type: 'inbox-drop' },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-0 flex-1 flex-col rounded-xl bg-slate-100/95 p-3 shadow-sm transition-colors ${
        isTarget ? 'ring-2 ring-violet-400/60' : ''
      }`}
    >
      {children}
    </div>
  );
}

function InboxPage({
  inboxCards,
  draggingInboxCardId,
  inboxDropPreview,
  inboxDropActive,
  onInboxUpdate,
  onOpenCard,
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const visibleCards = draggingInboxCardId
    ? inboxCards.filter((c) => c.id !== draggingInboxCardId)
    : inboxCards;

  const cardIds = useMemo(() => visibleCards.map((c) => `inbox-card-${c.id}`), [visibleCards]);

  const isTarget = inboxDropPreview !== null || inboxDropActive;

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
    <div className="flex h-full flex-1 gap-4 overflow-x-auto px-4 pb-4 pt-1">
      <div className="flex w-full max-w-sm shrink-0 flex-col">
        <InboxDropArea isTarget={isTarget}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Inbox</h2>
            <span className="text-xs text-slate-500">{inboxCards.length} cards</span>
          </div>

          <div className="flex min-h-[200px] flex-1 flex-col gap-2 overflow-y-auto">
            {visibleCards.length === 0 && !inboxDropPreview ? (
              <div className="flex min-h-[160px] flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300/70 bg-slate-50/80 px-4 text-center">
                <p className="text-sm font-medium text-slate-500">Your inbox is empty</p>
                <p className="mt-1 text-xs text-slate-400">Drop cards here or add one below</p>
              </div>
            ) : (
              <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                {renderCards()}
              </SortableContext>
            )}
          </div>

          {adding ? (
            <form onSubmit={submitNew} className="mt-3 flex flex-col gap-2">
              <textarea
                autoFocus
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to get done?"
                className="w-full resize-none rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-violet-500"
              />
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white">
                  Add to Inbox
                </button>
                <button type="button" onClick={() => setAdding(false)} className="text-sm text-slate-500">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-slate-200/60"
            >
              <FiPlus size={14} />
              Add a card
            </button>
          )}
        </InboxDropArea>
      </div>
    </div>
  );
}

export default memo(InboxPage);
