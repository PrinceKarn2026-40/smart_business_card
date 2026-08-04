const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');

const generateQRCode = async (slug) => {
  const url = `${process.env.APP_URL}/card/${slug}`;

  // Generate QR code as buffer
  const buffer = await QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' },
  });

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'smart-business-card/qrcodes', public_id: `qr-${slug}`, overwrite: true },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  return result.secure_url;
};

const deleteQRCode = async (publicIdOrUrl) => {
  if (!publicIdOrUrl) return;
  try {
    // Extract public_id from URL if needed
    if (publicIdOrUrl.startsWith('http')) {
      const parts = publicIdOrUrl.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      await cloudinary.uploader.destroy(`smart-business-card/qrcodes/${filename}`);
    }
  } catch (err) {
    console.error('QR delete error:', err.message);
  }
};

module.exports = { generateQRCode, deleteQRCode };
