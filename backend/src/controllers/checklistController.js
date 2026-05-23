import * as checklistService from '../services/checklistService.js';

export async function createItem(req, res, next) {
  try {
    const item = await checklistService.createChecklistItem(Number(req.params.id), req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const item = await checklistService.updateChecklistItem(Number(req.params.id), req.body);
    if (!item) return res.status(404).json({ error: 'Checklist item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const ok = await checklistService.deleteChecklistItem(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Checklist item not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
