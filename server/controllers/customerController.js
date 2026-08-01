const customerService = require('../services/customerService');

const getAll = async (req, res, next) => {
  try {
    const result = await customerService.getAll(req.query);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const customer = await customerService.getOne(req.params.id);
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    if (!req.body.full_name) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
    const customer = await customerService.create(req.body, req.files);
    res.status(201).json({ success: true, data: customer });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    if (!req.body.full_name) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
    const customer = await customerService.update(req.params.id, req.body, req.files);
    res.json({ success: true, data: customer });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await customerService.remove(req.params.id);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
