import { api } from './client.js';

export const createChecklistItem = (cardId, text) =>
  api.post(`/cards/${cardId}/checklist`, { text }).then((r) => r.data);

export const updateChecklistItem = (id, completed) =>
  api.patch(`/checklist-items/${id}`, { completed }).then((r) => r.data);

export const deleteChecklistItem = (id) =>
  api.delete(`/checklist-items/${id}`).then((r) => r.data);
