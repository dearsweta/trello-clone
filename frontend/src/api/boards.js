import { api } from './client.js';

export const fetchBoards = () => api.get('/boards').then((r) => r.data);

export const fetchBoard = (boardId) => api.get(`/boards/${boardId}`).then((r) => r.data);

export const createBoard = (title) => api.post('/boards', { title }).then((r) => r.data);

export const updateBoard = (boardId, data) =>
  api.patch(`/boards/${boardId}`, data).then((r) => r.data);
