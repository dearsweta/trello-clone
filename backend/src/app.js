import express from 'express';
import cors from 'cors';
import boardsRouter from './routes/boards.js';
import listsRouter from './routes/lists.js';
import cardsRouter from './routes/cards.js';
import membersRouter from './routes/members.js';
import labelsRouter from './routes/labels.js';
import checklistRouter from './routes/checklist.js';
import inboxRouter from './routes/inbox.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/boards', boardsRouter);
app.use('/lists', listsRouter);
app.use('/cards', cardsRouter);
app.use('/members', membersRouter);
app.use('/labels', labelsRouter);
app.use('/inbox', inboxRouter);
app.use('/', checklistRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

export default app;
