import * as membersService from '../services/membersService.js';

export async function getMembers(req, res, next) {
  try {
    const members = await membersService.getAllMembers();
    res.json(members);
  } catch (err) {
    next(err);
  }
}
