import db from './db.js';

async function fetchItems() {
  try {
    const [rows] = await db.query('SELECT * FROM Item');
    console.log('Items:', rows);
  } catch (err) {
    console.error('Query error:', err);
  }
}

fetchItems();