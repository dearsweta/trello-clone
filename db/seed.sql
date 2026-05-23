USE trello_clone;

INSERT INTO members (name, avatar_color) VALUES
  ('Alex Chen', '#3B82F6'),
  ('Jordan Lee', '#10B981'),
  ('Sam Rivera', '#F59E0B'),
  ('Taylor Kim', '#EF4444');

INSERT INTO labels (name, color) VALUES
  ('Bug', '#EF4444'),
  ('Feature', '#3B82F6'),
  ('Design', '#8B5CF6'),
  ('Docs', '#6B7280'),
  ('Urgent', '#F97316');

INSERT INTO boards (title, background) VALUES
  ('Product Roadmap', '#7C3AED'),
  ('Marketing Sprint', '#0EA5E9'),
  ('Engineering', '#059669');

INSERT INTO lists (board_id, title, type, position) VALUES
  (1, 'Backlog', 'board', 1000),
  (1, 'In Progress', 'board', 2000),
  (1, 'Review', 'board', 3000),
  (1, 'Done', 'board', 4000),
  (2, 'Ideas', 'board', 1000),
  (2, 'Scheduled', 'board', 2000),
  (3, 'Todo', 'board', 1000),
  (3, 'Doing', 'board', 2000);

INSERT INTO inbox_cards (title, description, created_by) VALUES
  ('Review competitor analysis', 'Compare top 3 competitors', 1),
  ('Capture ideas from standup', 'Quick notes before assigning to a board', 2);

INSERT INTO cards (list_id, title, description, position, due_date, archived, cover_image_url) VALUES
  (1, 'Define Q3 OKRs', 'Align with leadership', 1000, '2026-06-01 12:00:00', FALSE, NULL),
  (1, 'User interview synthesis', NULL, 2000, NULL, FALSE, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400'),
  (2, 'Build API layer', 'Express + MySQL', 1000, '2026-05-30 18:00:00', FALSE, NULL),
  (2, 'Kanban drag and drop', 'dnd-kit integration', 2000, NULL, FALSE, NULL),
  (3, 'Design system tokens', NULL, 1000, NULL, FALSE, NULL),
  (4, 'Ship MVP', 'Polish and deploy', 1000, '2026-05-28 09:00:00', FALSE, NULL),
  (5, 'Social campaign draft', NULL, 1000, NULL, FALSE, NULL),
  (6, 'Newsletter #12', 'May edition', 1000, '2026-05-27 10:00:00', FALSE, NULL),
  (7, 'Fix login redirect', 'Edge case on mobile', 1000, NULL, FALSE, NULL),
  (8, 'Database migrations', NULL, 1000, NULL, FALSE, NULL);

INSERT INTO card_members (card_id, member_id) VALUES
  (1, 1), (1, 3),
  (2, 2), (2, 4),
  (3, 1), (3, 3),
  (4, 3), (4, 4),
  (5, 2),
  (6, 1), (6, 2), (6, 3),
  (7, 4),
  (8, 2), (8, 3),
  (9, 1),
  (10, 3);

INSERT INTO card_labels (card_id, label_id) VALUES
  (1, 2),
  (2, 3), (2, 2),
  (3, 2), (3, 5),
  (4, 2),
  (5, 3),
  (6, 2), (6, 5),
  (7, 3),
  (8, 4),
  (9, 1), (9, 5),
  (10, 2);

INSERT INTO checklist_items (card_id, text, completed) VALUES
  (3, 'Setup Express routes', TRUE),
  (3, 'Connect MySQL pool', TRUE),
  (3, 'Add Zod validators', FALSE),
  (4, 'List reorder', FALSE),
  (4, 'Card move between lists', FALSE),
  (6, 'QA checklist', FALSE),
  (6, 'Deploy staging', FALSE),
  (6, 'Product sign-off', FALSE);
