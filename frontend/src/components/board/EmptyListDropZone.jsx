import { useDroppable } from '@dnd-kit/core';
import { memo } from 'react';

function EmptyListDropZone({ listId, isTarget }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-empty-${listId}`,
    data: { type: 'list-empty', listId },
  });

  const highlighted = isOver || isTarget;

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed px-3 py-6 transition-colors ${
        highlighted
          ? 'border-violet-400/90 bg-violet-100/60'
          : 'border-slate-300/60 bg-slate-50/50'
      }`}
    >
      <p className={`text-center text-xs font-medium ${highlighted ? 'text-violet-600' : 'text-slate-400'}`}>
        {highlighted ? 'Release to drop card' : 'Drop cards here'}
      </p>
    </div>
  );
}

export default memo(EmptyListDropZone);
