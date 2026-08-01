require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { query } = require('./db');

async function initDatabase() {
  try {
    console.log('Running schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await query(schema);
    console.log('Schema applied.');

    // Seed admin only if none exists
    const { rows } = await query('SELECT id FROM admins LIMIT 1');
    if (rows.length === 0) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await query(
        'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
        [process.env.ADMIN_USERNAME, hash]
      );
      console.log(`Admin created — username: ${process.env.ADMIN_USERNAME}`);
    } else {
      console.log('Admin already exists, skipping seed.');
    }

    console.log('Database ready.');
    process.exit(0);
  } catch (err) {
    console.error('Database init failed:', err.message);
    process.exit(1);
  }
}

initDatabase();
