import { useCallback, useRef, useState } from 'react';
import { PointerSensor, useSensor, useSensors, closestCorners, pointerWithin } from '@dnd-kit/core';
import { getMidPosition } from '../utils/position.js';
import {
  moveCardOptimistic,
  insertBoardCardOptimistic,
  reorderListOptimistic,
  computeDropPreview,
  isInboxDropTarget,
} from '../utils/boardState.js';
import {
  computeInboxDropPreview,
  removeBoardCardOptimistic,
  addInboxCardOptimistic,
  removeInboxCardOptimistic,
} from '../utils/inboxState.js';
import * as listsApi from '../api/lists.js';
import * as cardsApi from '../api/cards.js';
import * as inboxApi from '../api/inbox.js';

function collisionDetection(args) {
  const pointerHits = pointerWithin(args);
  if (pointerHits.length > 0) return pointerHits;
  return closestCorners(args);
}

export function useWorkspaceDnd({
  board,
  setBoard,
  inboxCards,
  setInboxCards,
}) {
  const [activeDrag, setActiveDrag] = useState(null);
  const [draggingBoardCardId, setDraggingBoardCardId] = useState(null);
  const [draggingInboxCardId, setDraggingInboxCardId] = useState(null);
  const [dropPreview, setDropPreview] = useState(null);
  const [inboxDropPreview, setInboxDropPreview] = useState(null);
  const [inboxDropActive, setInboxDropActive] = useState(false);

  const boardRef = useRef(board);
  const inboxRef = useRef(inboxCards);
  boardRef.current = board;
  inboxRef.current = inboxCards;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const findBoardCard = useCallback((cardId, sourceBoard = boardRef.current) => {
    if (!sourceBoard) return null;
    for (const list of sourceBoard.lists) {
      const card = list.cards?.find((c) => c.id === cardId);
      if (card) return { card, list };
    }
    return null;
  }, []);

  const findInboxCard = useCallback((inboxId, cards = inboxRef.current) => {
    return cards.find((c) => c.id === inboxId) ?? null;
  }, []);

  const clearDragState = useCallback(() => {
    setActiveDrag(null);
    setDraggingBoardCardId(null);
    setDraggingInboxCardId(null);
    setDropPreview(null);
    setInboxDropPreview(null);
    setInboxDropActive(false);
  }, []);

  const handleDragStart = useCallback(
    (event) => {
      const id = String(event.active.id);
      if (id.startsWith('card-')) {
        const cardId = Number(id.replace('card-', ''));
        const found = findBoardCard(cardId);
        if (found) {
          setActiveDrag({ type: 'board-card', card: found.card });
          setDraggingBoardCardId(cardId);
          setDropPreview(null);
          setInboxDropPreview(null);
        }
      } else if (id.startsWith('inbox-card-')) {
        const inboxId = Number(id.replace('inbox-card-', ''));
        const card = findInboxCard(inboxId);
        if (card) {
          setActiveDrag({ type: 'inbox-card', card });
          setDraggingInboxCardId(inboxId);
          setDropPreview(null);
          setInboxDropPreview(null);
        }
      }
    },
    [findBoardCard, findInboxCard]
  );

  const handleDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) {
        setInboxDropActive(false);
        return;
      }

      const activeId = String(active.id);
      const overId = String(over.id);

      setInboxDropActive(isInboxDropTarget(overId));

      if (activeId.startsWith('card-') && draggingBoardCardId) {
        if (isInboxDropTarget(overId)) {
          setDropPreview(null);
          return;
        }
        const preview = computeDropPreview(boardRef.current, draggingBoardCardId, overId);
        setDropPreview((prev) => {
          if (prev?.listId === preview?.listId && prev?.beforeCardId === preview?.beforeCardId) {
            return prev;
          }
          return preview;
        });
      }

      if (activeId.startsWith('inbox-card-') && draggingInboxCardId) {
        if (
          overId.startsWith('card-') ||
          overId.startsWith('list-drop-') ||
          overId.startsWith('list-empty-')
        ) {
          setInboxDropPreview(null);
          const preview = computeDropPreview(boardRef.current, -1, overId);
          setDropPreview((prev) => {
            if (prev?.listId === preview?.listId && prev?.beforeCardId === preview?.beforeCardId) {
              return prev;
            }
            return preview;
          });
          return;
        }
        const preview = computeInboxDropPreview(inboxRef.current, overId);
        setInboxDropPreview((prev) => {
          if (prev?.beforeInboxCardId === preview?.beforeInboxCardId) return prev;
          return preview;
        });
        setDropPreview(null);
      }
    },
    [draggingBoardCardId, draggingInboxCardId]
  );

  const handleDragCancel = useCallback(() => {
    clearDragState();
  }, [clearDragState]);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      const currentBoardCardId = draggingBoardCardId;
      const currentInboxCardId = draggingInboxCardId;
      const currentDropPreview = dropPreview;
      const currentInboxPreview = inboxDropPreview;
      clearDragState();

      if (!over) return;

      const currentBoard = boardRef.current;
      const currentInbox = inboxRef.current;
      const activeId = String(active.id);
      const overId = String(over.id);

      if (activeId.startsWith('list-') && currentBoard) {
        const listId = Number(activeId.replace('list-', ''));
        const lists = [...currentBoard.lists].sort((a, b) => a.position - b.position);
        const oldIndex = lists.findIndex((l) => l.id === listId);
        let newIndex = oldIndex;
        if (overId.startsWith('list-')) {
          newIndex = lists.findIndex((l) => l.id === Number(overId.replace('list-', '')));
        }
        if (oldIndex === newIndex || oldIndex < 0) return;

        const reordered = [...lists];
        const [removed] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, removed);
        const newPosition = getMidPosition(
          reordered[newIndex - 1]?.position ?? null,
          reordered[newIndex + 1]?.position ?? null
        );

        const snapshot = currentBoard;
        setBoard(reorderListOptimistic(currentBoard, listId, newPosition));
        listsApi.reorderList(listId, newPosition).catch(() => setBoard(snapshot));
        return;
      }

      if (activeId.startsWith('card-') && currentBoardCardId && isInboxDropTarget(overId)) {
        const found = findBoardCard(currentBoardCardId, currentBoard);
        if (!found) return;

        const snapshotBoard = currentBoard;
        const snapshotInbox = currentInbox;
        const optimisticInboxCard = {
          id: `temp-${Date.now()}`,
          title: found.card.title,
          description: found.card.description,
          createdBy: found.card.memberIds?.[0] ?? null,
          archived: false,
          createdAt: new Date().toISOString(),
          createdByMember: null,
        };

        setBoard(removeBoardCardOptimistic(currentBoard, currentBoardCardId));
        setInboxCards(addInboxCardOptimistic(currentInbox, optimisticInboxCard));

        try {
          const result = await inboxApi.createInbox({ fromCardId: currentBoardCardId });
          if (result.board) setBoard(result.board);
          if (result.cards) setInboxCards(result.cards);
        } catch {
          setBoard(snapshotBoard);
          setInboxCards(snapshotInbox);
        }
        return;
      }

      if (activeId.startsWith('inbox-card-') && currentInboxCardId && currentBoard) {
        let targetListId = null;
        let insertBeforeCardId = null;

        if (currentDropPreview) {
          targetListId = currentDropPreview.listId;
          insertBeforeCardId = currentDropPreview.beforeCardId;
        } else {
          const fallback = computeDropPreview(currentBoard, null, overId);
          if (fallback) {
            targetListId = fallback.listId;
            insertBeforeCardId = fallback.beforeCardId;
          }
        }

        if (!targetListId) return;

        const inboxCard = findInboxCard(currentInboxCardId, currentInbox);
        if (!inboxCard) return;

        const targetList = currentBoard.lists.find((l) => l.id === targetListId);
        if (!targetList) return;

        const cardsWithout = (targetList.cards || []).filter((c) => c.id !== currentInboxCardId);
        let insertIndex = cardsWithout.length;
        if (insertBeforeCardId) {
          insertIndex = cardsWithout.findIndex((c) => c.id === insertBeforeCardId);
          if (insertIndex < 0) insertIndex = cardsWithout.length;
        }

        const newPosition = getMidPosition(
          insertIndex > 0 ? cardsWithout[insertIndex - 1]?.position : null,
          insertIndex < cardsWithout.length ? cardsWithout[insertIndex]?.position : null
        );

        const snapshotBoard = currentBoard;
        const snapshotInbox = currentInbox;

        const placeholderCard = {
          id: -currentInboxCardId,
          listId: targetListId,
          title: inboxCard.title,
          description: inboxCard.description,
          position: newPosition,
          dueDate: null,
          archived: false,
          coverImageUrl: null,
          memberIds: inboxCard.createdBy ? [inboxCard.createdBy] : [],
          labelIds: [],
          checklistItems: [],
        };

        setInboxCards(removeInboxCardOptimistic(currentInbox, currentInboxCardId));
        setBoard(insertBoardCardOptimistic(currentBoard, placeholderCard, targetListId, insertBeforeCardId));

        try {
          const result = await cardsApi.createCardFromInbox(
            currentInboxCardId,
            targetListId,
            newPosition
          );
          if (result.board) setBoard(result.board);
          if (result.cards) setInboxCards(result.cards);
        } catch {
          setBoard(snapshotBoard);
          setInboxCards(snapshotInbox);
        }
        return;
      }

      if (activeId.startsWith('card-') && currentBoardCardId && currentBoard) {
        const cardId = currentBoardCardId;
        const found = findBoardCard(cardId, currentBoard);
        if (!found) return;

        let targetListId = found.list.id;
        let insertBeforeCardId = null;

        if (currentDropPreview) {
          targetListId = currentDropPreview.listId;
          insertBeforeCardId = currentDropPreview.beforeCardId;
        } else {
          const fallback = computeDropPreview(currentBoard, cardId, overId);
          if (fallback) {
            targetListId = fallback.listId;
            insertBeforeCardId = fallback.beforeCardId;
          }
        }

        const targetList = currentBoard.lists.find((l) => l.id === targetListId);
        if (!targetList) return;

        const cardsWithoutDragged = (targetList.cards || []).filter((c) => c.id !== cardId);
        let insertIndex = cardsWithoutDragged.length;
        if (insertBeforeCardId) {
          insertIndex = cardsWithoutDragged.findIndex((c) => c.id === insertBeforeCardId);
          if (insertIndex < 0) insertIndex = cardsWithoutDragged.length;
        }

        const newPosition = getMidPosition(
          insertIndex > 0 ? cardsWithoutDragged[insertIndex - 1]?.position : null,
          insertIndex < cardsWithoutDragged.length ? cardsWithoutDragged[insertIndex]?.position : null
        );

        if (targetListId === found.list.id && found.card.position === newPosition) return;

        const snapshot = currentBoard;
        setBoard(
          moveCardOptimistic(currentBoard, cardId, targetListId, newPosition, insertBeforeCardId)
        );

        const sync =
          targetListId !== found.list.id
            ? cardsApi.moveCard(cardId, targetListId, newPosition)
            : cardsApi.reorderCard(cardId, newPosition);

        sync.catch(() => setBoard(snapshot));
      }
    },
    [
      draggingBoardCardId,
      draggingInboxCardId,
      dropPreview,
      inboxDropPreview,
      clearDragState,
      findBoardCard,
      findInboxCard,
      setBoard,
      setInboxCards,
    ]
  );

  return {
    sensors,
    collisionDetection,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
    onDragCancel: handleDragCancel,
    activeDrag,
    draggingBoardCardId,
    draggingInboxCardId,
    dropPreview,
    inboxDropPreview,
    inboxDropActive,
  };
}
