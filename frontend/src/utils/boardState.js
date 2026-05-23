export function insertBoardCardOptimistic(board, card, targetListId, insertBeforeCardId = null) {
  const lists = board.lists.map((list) => {
    if (list.id !== targetListId) return list;
    const cards = [...(list.cards || [])];
    if (insertBeforeCardId) {
      const index = cards.findIndex((c) => c.id === insertBeforeCardId);
      cards.splice(index >= 0 ? index : cards.length, 0, card);
    } else {
      cards.push(card);
    }
    cards.sort((a, b) => a.position - b.position);
    return { ...list, cards };
  });
  return { ...board, lists };
}

export function moveCardOptimistic(board, cardId, targetListId, newPosition, insertBeforeCardId = null) {
  let movedCard = null;

  const listsWithoutCard = board.lists.map((list) => {
    const cards = [...(list.cards || [])];
    const index = cards.findIndex((c) => c.id === cardId);
    if (index >= 0) {
      [movedCard] = cards.splice(index, 1);
    }
    return { ...list, cards };
  });

  if (!movedCard) return board;

  const updatedCard = { ...movedCard, listId: targetListId, position: newPosition };

  const lists = listsWithoutCard.map((list) => {
    if (list.id !== targetListId) return list;
    const cards = [...(list.cards || [])];
    if (insertBeforeCardId) {
      const index = cards.findIndex((c) => c.id === insertBeforeCardId);
      cards.splice(index >= 0 ? index : cards.length, 0, updatedCard);
    } else {
      cards.push(updatedCard);
    }
    cards.sort((a, b) => a.position - b.position);
    return { ...list, cards };
  });

  return { ...board, lists };
}

export function reorderListOptimistic(board, listId, newPosition) {
  const lists = board.lists.map((list) =>
    list.id === listId ? { ...list, position: newPosition } : list
  );
  lists.sort((a, b) => a.position - b.position);
  return { ...board, lists };
}

export function isInboxDropTarget(overIdStr) {
  return overIdStr === 'inbox-drop' || overIdStr === 'sidebar-inbox-drop';
}

export function resolveDropTarget(overIdStr) {
  if (overIdStr.startsWith('card-')) {
    return { type: 'card', cardId: Number(overIdStr.replace('card-', '')) };
  }
  if (overIdStr.startsWith('list-empty-')) {
    return { type: 'list', listId: Number(overIdStr.replace('list-empty-', '')), insertAtEnd: true };
  }
  if (overIdStr.startsWith('list-drop-')) {
    return { type: 'list', listId: Number(overIdStr.replace('list-drop-', '')), insertAtEnd: true };
  }
  if (isInboxDropTarget(overIdStr)) {
    return { type: 'inbox' };
  }
  return null;
}

export function computeDropPreview(board, activeCardId, overIdStr) {
  const target = resolveDropTarget(overIdStr);
  if (!target) return null;

  if (target.type === 'card') {
    for (const list of board.lists) {
      const card = list.cards?.find((c) => c.id === target.cardId);
      if (card) {
        return { listId: list.id, beforeCardId: target.cardId };
      }
    }
    return null;
  }

  return { listId: target.listId, beforeCardId: null };
}
