import { api } from './client.js';

export const fetchInbox = () => api.get('/inbox').then((r) => r.data.cards);

export const createInbox = (data) => api.post('/inbox', data).then((r) => r.data);

export const updateInbox = (id, data) => api.patch(`/inbox/${id}`, data).then((r) => r.data);

export const deleteInbox = (id) => api.delete(`/inbox/${id}`).then((r) => r.data);
