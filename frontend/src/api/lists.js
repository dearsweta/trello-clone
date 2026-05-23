import { api } from './client.js';

export const createList = (boardId, title) =>
  api.post('/lists', { boardId, title }).then((r) => r.data);

export const updateList = (id, title) =>
  api.patch(`/lists/${id}`, { title }).then((r) => r.data);

export const deleteList = (id) => api.delete(`/lists/${id}`).then((r) => r.data);

export const reorderList = (listId, newPosition) =>
  api.patch('/lists/reorder', { listId, newPosition }).then((r) => r.data);
