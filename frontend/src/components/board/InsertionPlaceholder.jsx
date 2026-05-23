import { memo } from 'react';

function InsertionPlaceholder() {
  return (
    <div
      className="h-[52px] shrink-0 rounded-lg border-2 border-dashed border-violet-400/80 bg-violet-100/50 shadow-inner"
      aria-hidden
    />
  );
}

export default memo(InsertionPlaceholder);
