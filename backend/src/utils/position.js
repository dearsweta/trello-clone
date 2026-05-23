export function getNextPosition(maxPosition) {
  return (maxPosition ?? 0) + 1000;
}

export function getMidPosition(before, after) {
  if (before == null && after == null) return 1000;
  if (before == null) return Math.floor(after / 2) || 500;
  if (after == null) return before + 1000;
  const mid = Math.floor((before + after) / 2);
  if (mid === before || mid === after) {
    return before + Math.floor((after - before) / 2) || before + 500;
  }
  return mid;
}
