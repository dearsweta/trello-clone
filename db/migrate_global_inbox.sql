USE trello_clone;

CREATE TABLE IF NOT EXISTS inbox_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by BIGINT NULL,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inbox_created_by
    FOREIGN KEY (created_by)
    REFERENCES members(id)
    ON DELETE SET NULL
);

INSERT INTO inbox_cards (title, description, created_by)
SELECT c.title, c.description, (
  SELECT cm.member_id FROM card_members cm WHERE cm.card_id = c.id LIMIT 1
)
FROM cards c
INNER JOIN lists l ON c.list_id = l.id
WHERE l.type = 'inbox' AND c.archived = FALSE;

DELETE c FROM cards c
INNER JOIN lists l ON c.list_id = l.id
WHERE l.type = 'inbox';

DELETE FROM lists WHERE type = 'inbox';

ALTER TABLE lists MODIFY COLUMN type ENUM('board') DEFAULT 'board';
