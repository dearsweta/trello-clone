
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
  (1, 'Inbox', 'inbox', 500),
  (1, 'Backlog', 'board', 1000),
  (1, 'In Progress', 'board', 2000),
  (1, 'Review', 'board', 3000),
  (1, 'Done', 'board', 4000),
  (2, 'Inbox', 'inbox', 500),
  (2, 'Ideas', 'board', 1000),
  (2, 'Scheduled', 'board', 2000),
  (3, 'Inbox', 'inbox', 500),
  (3, 'Todo', 'board', 1000),
  (3, 'Doing', 'board', 2000);

INSERT INTO cards (list_id, title, description, position, due_date, archived, cover_image_url) VALUES
  (1, 'Review competitor analysis', 'Compare top 3 competitors', 1000, '2026-05-25 17:00:00', FALSE, NULL),
  (2, 'Define Q3 OKRs', 'Align with leadership', 1000, '2026-06-01 12:00:00', FALSE, NULL),
  (2, 'User interview synthesis', NULL, 2000, NULL, FALSE, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400'),
  (3, 'Build API layer', 'Express + MySQL', 1000, '2026-05-30 18:00:00', FALSE, NULL),
  (3, 'Kanban drag and drop', 'dnd-kit integration', 2000, NULL, FALSE, NULL),
  (4, 'Design system tokens', NULL, 1000, NULL, FALSE, NULL),
  (5, 'Ship MVP', 'Polish and deploy', 1000, '2026-05-28 09:00:00', FALSE, NULL),
  (7, 'Social campaign draft', NULL, 1000, NULL, FALSE, NULL),
  (8, 'Newsletter #12', 'May edition', 1000, '2026-05-27 10:00:00', FALSE, NULL),
  (10, 'Fix login redirect', 'Edge case on mobile', 1000, NULL, FALSE, NULL),
  (11, 'Database migrations', NULL, 1000, NULL, FALSE, NULL);

INSERT INTO card_members (card_id, member_id) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 3),
  (3, 2), (3, 4),
  (4, 1), (4, 3),
  (5, 3), (5, 4),
  (6, 2),
  (7, 1), (7, 2), (7, 3),
  (8, 4),
  (9, 2), (9, 3),
  (10, 1),
  (11, 3);

INSERT INTO card_labels (card_id, label_id) VALUES
  (1, 4), (1, 5),
  (2, 2),
  (3, 3), (3, 2),
  (4, 2), (4, 5),
  (5, 2),
  (6, 3),
  (7, 2), (7, 5),
  (8, 3),
  (9, 4),
  (10, 1), (10, 5),
  (11, 2);

INSERT INTO checklist_items (card_id, text, completed) VALUES
  (4, 'Setup Express routes', TRUE),
  (4, 'Connect MySQL pool', TRUE),
  (4, 'Add Zod validators', FALSE),
  (5, 'List reorder', FALSE),
  (5, 'Card move between lists', FALSE),
  (7, 'QA checklist', FALSE),
  (7, 'Deploy staging', FALSE),
  (7, 'Product sign-off', FALSE);
