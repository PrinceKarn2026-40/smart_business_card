-- admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  job_title VARCHAR(150),
  company VARCHAR(150),
  bio TEXT,
  phone VARCHAR(50),
  email VARCHAR(150),
  website VARCHAR(255),
  address TEXT,
  profile_photo VARCHAR(255),
  cover_photo VARCHAR(255),
  qr_code_path VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL
);

-- scan_logs table
CREATE TABLE IF NOT EXISTS scan_logs (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  ip_address VARCHAR(100),
  browser VARCHAR(255),
  device VARCHAR(255),
  country VARCHAR(100),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_slug ON customers(slug);
CREATE INDEX IF NOT EXISTS idx_social_links_customer_id ON social_links(customer_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_customer_id ON scan_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_at ON scan_logs(scanned_at);
