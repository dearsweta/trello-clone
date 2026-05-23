export function computeInboxDropPreview(inboxCards, overIdStr) {
  if (overIdStr.startsWith('inbox-card-')) {
    return { beforeInboxCardId: Number(overIdStr.replace('inbox-card-', '')) };
  }
  if (overIdStr === 'inbox-drop' || overIdStr === 'sidebar-inbox-drop') {
    return { beforeInboxCardId: null };
  }
  return null;
}

export function removeBoardCardOptimistic(board, cardId) {
  return {
    ...board,
    lists: board.lists.map((list) => ({
      ...list,
      cards: (list.cards || []).filter((c) => c.id !== cardId),
    })),
  };
}

export function addInboxCardOptimistic(inboxCards, card) {
  return [...inboxCards, card];
}

export function removeInboxCardOptimistic(inboxCards, inboxId) {
  return inboxCards.filter((c) => c.id !== inboxId);
}

export function moveInboxCardPreview(inboxCards, inboxId, beforeInboxCardId) {
  const moving = inboxCards.find((c) => c.id === inboxId);
  if (!moving) return inboxCards;
  const rest = inboxCards.filter((c) => c.id !== inboxId);
  if (!beforeInboxCardId) return [...rest, moving];
  const index = rest.findIndex((c) => c.id === beforeInboxCardId);
  const next = [...rest];
  next.splice(index >= 0 ? index : next.length, 0, moving);
  return next;
}
