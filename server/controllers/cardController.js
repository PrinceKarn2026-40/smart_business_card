const customerModel = require('../models/customerModel');
const socialLinkModel = require('../models/socialLinkModel');
const { logScan } = require('../services/scanService');

const getCard = async (req, res, next) => {
  try {
    const customer = await customerModel.findBySlug(req.params.slug);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    const socialLinks = await socialLinkModel.findByCustomer(customer.id);

    // Log the scan (non-blocking)
    logScan(req, customer.id);

    res.json({
      success: true,
      data: { ...customer, socialLinks },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCard };
