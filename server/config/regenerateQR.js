require('dotenv').config();
const { query } = require('./db');
const { generateQRCode } = require('../utils/qrGenerator');

async function regenerateQRCodes() {
  try {
    const { rows } = await query('SELECT id, slug FROM customers');

    if (rows.length === 0) {
      console.log('No customers found.');
      process.exit(0);
    }

    console.log(`Regenerating QR codes for ${rows.length} customer(s)...`);

    for (const customer of rows) {
      const qr_code_path = await generateQRCode(customer.slug);
      await query('UPDATE customers SET qr_code_path = $1 WHERE id = $2', [qr_code_path, customer.id]);
      console.log(`✓ ${customer.slug}`);
    }

    console.log('All QR codes regenerated.');
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

regenerateQRCodes();
