export function cardMatchesFilters(card, filters) {
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    if (q && !card.title.toLowerCase().includes(q)) return false;
  }

  if (filters.labelIds?.length) {
    if (!filters.labelIds.every((id) => card.labelIds?.includes(id))) return false;
  }

  if (filters.memberIds?.length) {
    if (!filters.memberIds.every((id) => card.memberIds?.includes(id))) return false;
  }

  if (filters.dueDate) {
    const due = card.dueDate ? new Date(card.dueDate) : null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filters.dueDate === 'none' && due) return false;
    if (filters.dueDate === 'has' && !due) return false;
    if (filters.dueDate === 'overdue') {
      if (!due) return false;
      const d = new Date(due);
      d.setHours(0, 0, 0, 0);
      if (d >= now) return false;
    }
    if (filters.dueDate === 'today') {
      if (!due) return false;
      const d = new Date(due);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() !== now.getTime()) return false;
    }
    if (filters.dueDate === 'week') {
      if (!due) return false;
      const d = new Date(due);
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      if (d < now || d > end) return false;
    }
  }

  return true;
}

export function filterListCards(cards, filters) {
  if (!filters.search && !filters.labelIds?.length && !filters.memberIds?.length && !filters.dueDate) {
    return cards;
  }
  return cards.filter((card) => cardMatchesFilters(card, filters));
}
