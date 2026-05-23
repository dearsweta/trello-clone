import { api } from './client.js';

export const createCard = (listId, title) =>
  api.post('/cards', { listId, title }).then((r) => r.data);

export const createCardFromInbox = (fromInboxId, listId, newPosition) =>
  api.post('/cards', { fromInboxId, listId, newPosition }).then((r) => r.data);

export const updateCard = (id, data) => api.patch(`/cards/${id}`, data).then((r) => r.data);

export const deleteCard = (id) => api.delete(`/cards/${id}`).then((r) => r.data);

export const archiveCard = (id, archived = true) =>
  api.patch(`/cards/${id}/archive`, { archived }).then((r) => r.data);

export const moveCard = (id, newListId, newPosition) =>
  api.patch(`/cards/${id}/move`, { newListId, newPosition }).then((r) => r.data);

export const reorderCard = (id, newPosition) =>
  api.patch(`/cards/${id}/reorder`, { newPosition }).then((r) => r.data);

export const setCardMembers = (id, memberIds) =>
  api.post(`/cards/${id}/members`, { memberIds }).then((r) => r.data);

export const setCardLabels = (id, labelIds) =>
  api.post(`/cards/${id}/labels`, { labelIds }).then((r) => r.data);
