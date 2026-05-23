export function mapBoard(row) {
  return {
    id: row.id,
    title: row.title,
    background: row.background,
    createdAt: row.created_at,
  };
}

export function mapList(row) {
  return {
    id: row.id,
    boardId: row.board_id,
    title: row.title,
    type: row.type,
    position: row.position,
    createdAt: row.created_at,
  };
}

export function mapCard(row) {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    description: row.description,
    position: row.position,
    dueDate: row.due_date,
    archived: Boolean(row.archived),
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
  };
}

export function mapInboxCard(row, member = null) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    createdBy: row.created_by,
    archived: Boolean(row.archived),
    createdAt: row.created_at,
    createdByMember: member
      ? { id: member.id, name: member.name, avatarColor: member.avatar_color }
      : null,
  };
}

export function mapMember(row) {
  return {
    id: row.id,
    name: row.name,
    avatarColor: row.avatar_color,
  };
}

export function mapLabel(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}

export function mapChecklistItem(row) {
  return {
    id: row.id,
    cardId: row.card_id,
    text: row.text,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
  };
}
