import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { initDatabase } from '../server/db.js';
import { apiRouter } from '../server/routes.js';

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

let initialized = false;
async function ensureDb() {
  if (!initialized) {
    await initDatabase();
    initialized = true;
  }
}

// In Vercel serverless execution, the URL may arrive with or without the /api prefix
app.use(async (req, res, next) => {
  await ensureDb();
  next();
});

app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
