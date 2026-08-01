const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generateQRCode = async (slug) => {
  const url = `${process.env.APP_URL}/card/${slug}`;
  const filename = `${slug}.png`;
  const filepath = path.join(__dirname, '..', 'uploads', 'qrcodes', filename);

  await QRCode.toFile(filepath, url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
  });

  return filename;
};

const deleteQRCode = (filename) => {
  if (!filename) return;
  const filepath = path.join(__dirname, '..', 'uploads', 'qrcodes', filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
};

module.exports = { generateQRCode, deleteQRCode };
