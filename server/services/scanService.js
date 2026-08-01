const scanLogModel = require('../models/scanLogModel');

const parseUserAgent = (ua = '') => {
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';

  let browser = 'Unknown';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return { device, browser };
};

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
};

const logScan = async (req, customerId) => {
  try {
    const ua = req.headers['user-agent'] || '';
    const { device, browser } = parseUserAgent(ua);
    const ip_address = getClientIp(req);

    await scanLogModel.create({
      customer_id: customerId,
      ip_address,
      browser,
      device,
      country: null, // can integrate ip-api.com later
    });
  } catch (err) {
    console.error('Scan log error:', err.message);
  }
};

module.exports = { logScan };
