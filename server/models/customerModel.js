const db = require('../config/db');

const findAll = async ({ search = '', limit = 10, offset = 0 }) => {
  const pattern = `%${search}%`;
  const { rows } = await db.query(
    `SELECT id, slug, full_name, job_title, company, email, phone,
            profile_photo, qr_code_path, created_at
     FROM customers
     WHERE full_name ILIKE $1 OR company ILIKE $1 OR email ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [pattern, limit, offset]
  );
  return rows;
};

const countAll = async (search = '') => {
  const pattern = `%${search}%`;
  const { rows } = await db.query(
    `SELECT COUNT(*) FROM customers
     WHERE full_name ILIKE $1 OR company ILIKE $1 OR email ILIKE $1`,
    [pattern]
  );
  return parseInt(rows[0].count);
};

const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM customers WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const findBySlug = async (slug) => {
  const { rows } = await db.query(
    'SELECT * FROM customers WHERE slug = $1',
    [slug]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const {
    slug, full_name, job_title, company, bio,
    phone, email, website, address,
    profile_photo, cover_photo, qr_code_path,
  } = data;

  const { rows } = await db.query(
    `INSERT INTO customers
      (slug, full_name, job_title, company, bio, phone, email, website, address,
       profile_photo, cover_photo, qr_code_path)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [slug, full_name, job_title, company, bio, phone, email, website, address,
     profile_photo, cover_photo, qr_code_path]
  );
  return rows[0];
};

const update = async (id, data) => {
  const {
    full_name, job_title, company, bio,
    phone, email, website, address,
    profile_photo, cover_photo,
  } = data;

  const { rows } = await db.query(
    `UPDATE customers SET
      full_name=$1, job_title=$2, company=$3, bio=$4,
      phone=$5, email=$6, website=$7, address=$8,
      profile_photo=COALESCE($9, profile_photo),
      cover_photo=COALESCE($10, cover_photo),
      updated_at=NOW()
     WHERE id=$11
     RETURNING *`,
    [full_name, job_title, company, bio, phone, email, website, address,
     profile_photo, cover_photo, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  await db.query('DELETE FROM customers WHERE id = $1', [id]);
};

module.exports = { findAll, countAll, findById, findBySlug, create, update, remove };
