import * as inboxService from '../services/inboxService.js';

export async function getInbox(req, res, next) {
  try {
    const cards = await inboxService.getInboxCards();
    res.json({ cards });
  } catch (err) {
    next(err);
  }
}

export async function createInbox(req, res, next) {
  try {
    const result = await inboxService.createInboxCard(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

export async function updateInbox(req, res, next) {
  try {
    const card = await inboxService.updateInboxCard(Number(req.params.id), req.body);
    if (!card) return res.status(404).json({ error: 'Inbox card not found' });
    res.json(card);
  } catch (err) {
    next(err);
  }
}

export async function deleteInbox(req, res, next) {
  try {
    const result = await inboxService.deleteInboxCard(Number(req.params.id));
    if (!result) return res.status(404).json({ error: 'Inbox card not found' });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
