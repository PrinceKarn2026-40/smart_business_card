const fs = require('fs');
const path = require('path');
const customerModel = require('../models/customerModel');
const socialLinkModel = require('../models/socialLinkModel');
const { generateSlug } = require('../utils/slugify');
const { generateQRCode, deleteQRCode } = require('../utils/qrGenerator');

const getAll = async (query) => {
  const search = query.search || '';
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, parseInt(query.limit) || 10);
  const offset = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    customerModel.findAll({ search, limit, offset }),
    customerModel.countAll(search),
  ]);

  return { customers, total, page, limit, pages: Math.ceil(total / limit) };
};

const getOne = async (id) => {
  const customer = await customerModel.findById(id);
  if (!customer) throw { status: 404, message: 'Customer not found' };
  const socialLinks = await socialLinkModel.findByCustomer(id);
  return { ...customer, socialLinks };
};

const create = async (data, files) => {
  const slug = await generateSlug(data.full_name);
  const profile_photo = files?.profile_photo?.[0]?.filename || null;
  const cover_photo = files?.cover_photo?.[0]?.filename || null;
  const qr_code_path = await generateQRCode(slug);

  const customer = await customerModel.create({
    slug, full_name: data.full_name, job_title: data.job_title,
    company: data.company, bio: data.bio, phone: data.phone,
    email: data.email, website: data.website, address: data.address,
    profile_photo, cover_photo, qr_code_path,
  });

  const links = parseLinks(data.social_links);
  await socialLinkModel.replaceAll(customer.id, links);

  return { ...customer, socialLinks: links };
};

const update = async (id, data, files) => {
  const existing = await customerModel.findById(id);
  if (!existing) throw { status: 404, message: 'Customer not found' };

  const profile_photo = files?.profile_photo?.[0]?.filename || null;
  const cover_photo = files?.cover_photo?.[0]?.filename || null;

  // Delete old photos if replaced
  if (profile_photo && existing.profile_photo) deletePhoto(existing.profile_photo);
  if (cover_photo && existing.cover_photo) deletePhoto(existing.cover_photo);

  const customer = await customerModel.update(id, {
    full_name: data.full_name, job_title: data.job_title,
    company: data.company, bio: data.bio, phone: data.phone,
    email: data.email, website: data.website, address: data.address,
    profile_photo, cover_photo,
  });

  const links = parseLinks(data.social_links);
  await socialLinkModel.replaceAll(id, links);

  return { ...customer, socialLinks: links };
};

const remove = async (id) => {
  const customer = await customerModel.findById(id);
  if (!customer) throw { status: 404, message: 'Customer not found' };

  if (customer.profile_photo) deletePhoto(customer.profile_photo);
  if (customer.cover_photo) deletePhoto(customer.cover_photo);
  if (customer.qr_code_path) deleteQRCode(customer.qr_code_path);

  await customerModel.remove(id);
};

const parseLinks = (raw) => {
  if (!raw) return [];
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
};

const deletePhoto = (filename) => {
  const filepath = path.join(__dirname, '..', 'uploads', 'photos', filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
};

module.exports = { getAll, getOne, create, update, remove };
