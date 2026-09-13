import 'dotenv/config';
import pg from 'pg';
import { initDatabase } from '../server/db.js';

async function runMigration() {
  console.log('--- Starting PostgreSQL Migration ---');
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    console.error('Please configure DATABASE_URL in .env or your deployment environment.');
    process.exit(1);
  }

  try {
    await initDatabase();
    console.log(' Migration completed successfully! Tables created and verified.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
