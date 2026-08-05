const cloudinary = require('../config/cloudinary');
const customerModel = require('../models/customerModel');
const socialLinkModel = require('../models/socialLinkModel');
const { generateSlug } = require('../utils/slugify');
const { generateQRCode, deleteQRCode } = require('../utils/qrGenerator');

const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `smart-business-card/${folder}`, public_id: publicId, overwrite: true, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

const deleteFromCloudinary = async (url) => {
  if (!url || !url.startsWith('http')) return;
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`smart-business-card/${folder}/${filename}`);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

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
  const crypto = require('crypto');
  const uid = crypto.randomBytes(8).toString('hex');

  let profile_photo = null;
  let cover_photo = null;

  if (files?.profile_photo?.[0]) {
    profile_photo = await uploadToCloudinary(files.profile_photo[0].buffer, 'photos', `profile-${uid}`);
  }
  if (files?.cover_photo?.[0]) {
    cover_photo = await uploadToCloudinary(files.cover_photo[0].buffer, 'photos', `cover-${uid}`);
  }

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

  const crypto = require('crypto');
  const uid = crypto.randomBytes(8).toString('hex');

  let profile_photo = existing.profile_photo;
  let cover_photo = existing.cover_photo;

  if (files?.profile_photo?.[0]) {
    if (existing.profile_photo) await deleteFromCloudinary(existing.profile_photo);
    profile_photo = await uploadToCloudinary(files.profile_photo[0].buffer, 'photos', `profile-${uid}`);
  }
  if (files?.cover_photo?.[0]) {
    if (existing.cover_photo) await deleteFromCloudinary(existing.cover_photo);
    cover_photo = await uploadToCloudinary(files.cover_photo[0].buffer, 'photos', `cover-${uid}`);
  }

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

  if (customer.profile_photo) await deleteFromCloudinary(customer.profile_photo);
  if (customer.cover_photo) await deleteFromCloudinary(customer.cover_photo);
  if (customer.qr_code_path) await deleteQRCode(customer.qr_code_path);

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

module.exports = { getAll, getOne, create, update, remove };
