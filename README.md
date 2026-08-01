# Smart Business Card

A production-ready NFC Digital Business Card Management System.

The admin creates and manages customer profiles. Each customer gets a unique public digital business card accessible via URL, QR code, or NFC tap.

---

## Features

- Admin dashboard with statistics
- Full customer management (create, edit, delete, search)
- Photo uploads (profile + cover)
- Auto-generated QR codes
- Public digital business card page
- Social links (Facebook, Instagram, LinkedIn, GitHub, TikTok, YouTube, WhatsApp, X, Website)
- vCard download (Save Contact)
- Scan analytics (device, browser, IP, time)
- JWT authentication
- Responsive design (Bootstrap 5)

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | HTML5, CSS3, Bootstrap 5, Vanilla JS |
| Backend    | Node.js, Express.js     |
| Database   | PostgreSQL               |
| Auth       | JWT + bcrypt             |
| Uploads    | Multer                   |
| QR Code    | qrcode npm package       |
| Deployment | Render                   |

---

## Project Structure

```
smart_business_card/
├── client/
│   ├── css/
│   │   └── admin.css
│   ├── js/
│   │   ├── admin.js
│   │   └── layout.js
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── customers.html
│   │   ├── analytics.html
│   │   └── card.html
│   └── index.html
├── server/
│   ├── config/
│   │   ├── db.js
│   │   ├── initDb.js
│   │   ├── multer.js
│   │   └── schema.sql
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cardController.js
│   │   ├── customerController.js
│   │   ├── dashboardController.js
│   │   └── scanController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── adminModel.js
│   │   ├── customerModel.js
│   │   ├── dashboardModel.js
│   │   ├── scanLogModel.js
│   │   └── socialLinkModel.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── cardRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── scanRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── customerService.js
│   │   └── scanService.js
│   ├── utils/
│   │   ├── qrGenerator.js
│   │   └── slugify.js
│   ├── uploads/
│   │   ├── photos/
│   │   └── qrcodes/
│   └── app.js
├── index.js
├── .env
├── .env.example
├── .gitignore
├── render.yaml
└── package.json
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/smart-business-card.git
cd smart-business-card
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create PostgreSQL database

```sql
CREATE DATABASE smart_business_card;
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/smart_business_card
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
APP_URL=http://localhost:3000
```

### 5. Initialize database (creates tables + admin account)

```bash
npm run db:init
```

### 6. Start development server

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**Change these in your `.env` before running `npm run db:init`**

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |

### Customers (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create customer |
| GET | `/api/customers/:id` | Get customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/card/:slug` | Public business card page |
| GET | `/api/card/:slug` | Card data (JSON) |

### Analytics (protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scans` | Scan logs + stats |
| GET | `/api/dashboard/stats` | Dashboard statistics |

---

## Deployment on Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/smart-business-card.git
git push -u origin main
```

### 2. Create Render account

Go to [https://render.com](https://render.com) and sign up.

### 3. Create PostgreSQL database on Render

- Dashboard → New → PostgreSQL
- Name: `smart-business-card-db`
- Plan: Free
- Copy the **Internal Database URL**

### 4. Create Web Service on Render

- Dashboard → New → Web Service
- Connect your GitHub repository
- Configure:
  - **Build Command:** `npm install`
  - **Start Command:** `node index.js`

### 5. Set environment variables on Render

```
NODE_ENV=production
DATABASE_URL=<your render internal database url>
JWT_SECRET=<generate a strong random string>
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your secure password>
APP_URL=https://your-app-name.onrender.com
```

### 6. Initialize the database on Render

In Render dashboard → your web service → Shell:

```bash
node server/config/initDb.js
```

### 7. Update APP_URL

After deployment, update `APP_URL` in Render environment variables to your actual Render URL. This ensures QR codes point to the correct address.

---

## How NFC Cards Work

1. Admin creates a customer profile → unique slug is generated (e.g. `john-doe`)
2. Public card URL is: `https://your-app.onrender.com/card/john-doe`
3. QR code is auto-generated pointing to that URL
4. NFC card is programmed to store only that URL
5. When someone taps the NFC card or scans the QR code → the digital business card opens
6. If customer info changes → admin updates it in the dashboard → URL never changes

---

## License

MIT
