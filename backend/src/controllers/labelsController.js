import * as labelsService from '../services/labelsService.js';

export async function getLabels(req, res, next) {
  try {
    const labels = await labelsService.getAllLabels();
    res.json(labels);
  } catch (err) {
    next(err);
  }
}
