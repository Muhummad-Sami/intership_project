# 🏎️ DriveLux – Luxury Car Rental Platform

```markdown
# 🏎️ DriveLux – Luxury Car Rental Platform

![DriveLux Banner](https://via.placeholder.com/1200x400/0d0d0d/D4AF37?text=DriveLux)

A premium, full‑stack car rental application that redefines how users book high‑end vehicles. From browsing a curated fleet to receiving real‑time admin approval, DriveLux delivers a seamless, concierge‑level experience.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Key Features](#-key-features)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Seeding the Database](#-seeding-the-database)
- [API Documentation](#-api-documentation)
- [Email Notifications](#-email-notifications)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## Overview

**DriveLux** is a bespoke car rental platform built for discerning customers who expect luxury and convenience. Users can explore an exclusive collection of vehicles, request bookings with detailed preferences, and receive real‑time updates via email. Administrators have full control over bookings, car availability, and customer communication through a dedicated dashboard.

The project demonstrates a modern, production‑ready full‑stack architecture using React, Node.js, MongoDB, and Brevo for transactional emails. It combines robust authentication, role‑based access, and a polished, responsive UI.

### 🎯 Purpose

- **For Users:** A frictionless way to browse luxury cars and request bookings with all necessary details (dates, location, passengers, special requests).
- **For Admins:** A centralised dashboard to manage requests, update car availability, and communicate with customers via automated emails.
- **For Developers:** A clean, well‑structured codebase showcasing modern full‑stack development practices.

---

## ✨ Key Features

### 👤 User Side

| Feature | Description |
|---------|-------------|
| **Secure Authentication** | JWT‑based login/registration with session storage. |
| **Explore the Fleet** | Browse all cars with real‑time availability status (Available / Reserved). |
| **Detailed Car Pages** | View specs, images, and price; select pickup/drop‑off dates, time, location, number of passengers, and special requests. |
| **Request a Booking** | Submit a request that instantly notifies the admin. |
| **My Bookings** | View only pending requests in your personal cart; confirmed and cancelled bookings are automatically hidden. |
| **Real‑time Status Updates** | Car availability badges update without refreshing (polling every 30 seconds). |
| **Email Notifications** | Receive confirmation or cancellation emails with full booking details. |

### 👑 Admin Side

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Centralised control panel accessible only to users with `isAdmin: true`. |
| **Manage Bookings** | View all bookings (pending, confirmed, cancelled) with customer details. |
| **Confirm / Cancel** | One‑click approval or rejection; booking status and car availability update automatically. |
| **Manage Cars** | Toggle availability of any car; see a clear status badge. |
| **Email Automation** | Admin notification on new requests; user confirmation and cancellation emails. |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | Component‑based UI library |
| **Vite** | 4.0.0 | Fast build tool and dev server |
| **React Router DOM** | 6.8.0 | Client‑side routing |
| **Axios** | 1.3.0 | HTTP client with interceptors |
| **CSS3** | — | Custom, responsive luxury theme |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime |
| **Express** | 4.18.0 | REST API framework |
| **JSON Web Tokens** | 9.0.0 | Secure authentication |
| **Bcrypt** | 5.1.0 | Password hashing |
| **Mongoose** | 7.0.0 | MongoDB ODM |
| **Axios** | 1.3.0 | HTTP client for Brevo API |
| **dotenv** | 16.0.0 | Environment variable management |
| **CORS** | 2.8.5 | Cross‑origin resource sharing |

### Database
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | Cloud‑hosted NoSQL database |

### Email Service
| Technology | Purpose |
|------------|---------|
| **Brevo (Sendinblue)** | Transactional email API (free tier) |

---

## 🧩 System Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSES                           │
│                    (Homepage / Fleet / Car Details)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SUBMIT BOOKING REQUEST                     │
│         (Dates, Location, Passengers, Special Requests)        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND: CREATE BOOKING                      │
│              Status: "pending" – Store in MongoDB              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SEND ADMIN NOTIFICATION EMAIL                │
│                 (via Brevo API → Admin Inbox)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ADMIN LOGIN → DASHBOARD                      │
│              View pending requests, confirm or cancel          │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│    ADMIN CONFIRMS       │     │     ADMIN CANCELLS          │
│  Status: "confirmed"    │     │   Status: "cancelled"       │
│  Car → available: false │     │   Car → available: true     │
│  Send confirmation email│     │   Send cancellation email   │
│  to the user            │     │   to the user               │
└─────────────────────────┘     └─────────────────────────────┘
```

### Component Hierarchy (Frontend)

```
App (BrowserRouter)
├── AuthProvider (Context)
│   └── BookingProvider (Context)
│       └── AppLayout
│           ├── Navbar
│           ├── Routes
│           │   ├── HomePage (CarCard → CarDetailsPage)
│           │   ├── CarsPage (CarCard → CarDetailsPage)
│           │   ├── CarDetailsPage (Booking Form)
│           │   ├── BookingPage (Cart)
│           │   ├── LoginPage
│           │   └── AdminPage (Dashboard)
│           ├── Footer
│           └── Toast
└──
```

```


### 📁 Folder Structure

```
drivelux-app/
├── backend/
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, isAdmin)
│   │   ├── Car.js                # Car schema (carId, name, price, image, brand, available, specs)
│   │   └── Booking.js            # Booking schema (user, car, dates, locations, passengers, status)
│   ├── routes/
│   │   ├── authRoutes.js         # Registration, login, get users
│   │   ├── carRoutes.js          # CRUD operations for cars, availability toggle
│   │   └── bookingRoutes.js      # Request, confirm, cancel, get user/admin bookings
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification and admin role check
│   ├── utils/
│   │   └── email.js              # Brevo API integration – admin/user email templates
│   ├── .env                      # Environment variables (not committed)
│   ├── server.js                 # Express app entry point
│   ├── seedCars.js               # Script to populate the car catalogue
│   └── package.json              # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance with interceptors (JWT injection, 401 handling)
│   │   ├── components/
│   │   │   ├── CarCard.jsx       # Displays a single car with availability badge and "Reserve Now" button
│   │   │   ├── Navbar.jsx        # Navigation bar with auth‑aware links
│   │   │   ├── Footer.jsx        # Site footer
│   │   │   └── Toast.jsx         # Global toast notification
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Auth state provider (login, logout, user, registerRefresh)
│   │   │   └── BookingContext.jsx # Booking state provider (add, remove, fetch, clear)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero, featured carousel, categories, testimonials, CTA
│   │   │   ├── CarsPage.jsx      # Fleet listing with filters, search, sort
│   │   │   ├── CarDetailsPage.jsx # Detailed car view + booking form
│   │   │   ├── BookingPage.jsx   # User's cart (pending bookings) with summary and checkout
│   │   │   ├── LoginPage.jsx     # Login/Register form with redirect back
│   │   │   └── AdminPage.jsx     # Admin dashboard (pending requests, car management)
│   │   ├── utils/
│   │   │   └── auth.js           # Token and user helpers (get/set/remove)
│   │   ├── data/
│   │   │   └── cars.js           # Static car catalogue (used for seeding)
│   │   ├── App.jsx               # Main app wrapper with routes and context providers
│   │   ├── main.jsx              # ReactDOM entry point
│   │   └── index.css             # Global styles (luxury theme variables)
│   ├── index.html                # Vite template
│   └── package.json              # Frontend dependencies
│
├── .gitignore                    # Ignored files (node_modules, .env, dist)
└── README.md                     # This file

```


## 🗄️ Database Schema

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  timestamps: true
}
```

### Car Model
```javascript
{
  carId: { type: Number, unique: true },
  name: String,
  price: Number,
  image: String,
  brand: String,
  category: String,
  available: { type: Boolean, default: true },
  deposit: { type: Number, default: 0 },
  acceleration: String,
  power: String,
  transmission: String,
  fuel: String,
  seats: String,
  engine: String,
  description: String,
  subtitle: String
}
```

### Booking Model
```javascript
{
  user: { type: ObjectId, ref: "User", required: true },
  carName: { type: String, required: true },
  carId: { type: String, required: true },
  car: { type: Object, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pickupLocation: { type: String, default: "" },
  dropoffLocation: { type: String, default: "" },
  specialRequests: { type: String, default: "" },
  passengers: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },
  bookedBy: { type: ObjectId, ref: "User" },
  timestamps: true
}
```

### Relationships
- **User → Booking**: One-to-many (a user can have multiple bookings)
- **Booking → Car**: Embedded car object (denormalised for performance)
- **Admin → Booking**: `bookedBy` references the admin who confirmed/cancelled

---

## 📦 Installation & Setup

### Prerequisites
- Node.js ≥ 16
- MongoDB Atlas account (or local MongoDB)
- Brevo account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/Muhummad-Sami/intership_project.git
cd drivelux-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `backend/` folder (see [Environment Variables](#-environment-variables)).

### 5. Seed the car catalogue

```bash
cd ../backend
node seedCars.js
```

This populates the `cars` collection with the data from `frontend/src/data/cars.js`.

### 6. Start the backend

```bash
npm start        # Production
npm run dev      # Development with nodemon
```

### 7. Start the frontend

```bash
cd ../frontend
npm run dev
```

### 8. Access the application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your_super_secret_key_here

# Email (Brevo)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_USER=your_verified_sender_email@domain.com
EMAIL_TO=admin@yourdomain.com
```

### Email Configuration Notes

- `EMAIL_USER` must be verified in Brevo (**Settings → Senders & Domains**).
- `EMAIL_TO` receives admin notifications.
- `BREVO_API_KEY` is a v3 API key from Brevo (**SMTP & API → API Keys**).

---

## 🌱 Seeding the Database

The `seedCars.js` script reads car data from `frontend/src/data/cars.js` and inserts it into the `cars` collection.

```bash
node backend/seedCars.js
```

**Output:**
```
✅ Cars seeded successfully
```

**Note:** Re‑running the script clears existing car entries.

---

## 📬 API Documentation

All endpoints are prefixed with `/api`.

### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in and receive a JWT | Public |
| GET | `/auth/users` | Get all users | Admin |

### 🚗 Cars

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/cars` | Get all cars | Public |
| GET | `/cars/:id` | Get a car by `carId` | Public |
| POST | `/cars` | Add a new car | Admin |
| PATCH | `/cars/:id/availability` | Toggle availability | Admin |
| PUT | `/cars/:id` | Update car details | Admin |
| DELETE | `/cars/:id` | Delete a car | Admin |

### 📋 Bookings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/bookings/request` | Submit a booking request | User |
| PATCH | `/bookings/confirm/:id` | Confirm a booking | Admin |
| DELETE | `/bookings/:id` | Cancel a booking | Admin |
| GET | `/bookings` | Get user's pending bookings | User |
| GET | `/bookings/all` | Get all bookings | Admin |

**Authentication:**  
All protected endpoints require a `Bearer` token in the `Authorization` header.

```http
Authorization: Bearer <jwt_token>
```

---

## 📧 Email Notifications

DriveLux uses **Brevo's API** to send three types of emails:

### 1. Admin Notification
- **Sent to:** `EMAIL_TO` (admin)
- **Trigger:** User submits a booking request
- **Content:** Customer name, car details, dates, location, passengers, special requests, and a link to the admin panel.

### 2. User Confirmation
- **Sent to:** The booking user
- **Trigger:** Admin confirms the booking
- **Content:** Booking details, car image (if available), status badge, and a "View My Bookings" button.

### 3. User Cancellation
- **Sent to:** The booking user
- **Trigger:** Admin cancels the booking
- **Content:** Notification of cancellation, booking details, and a link to view bookings.

All email templates use a consistent **luxury dark‑theme** with gold accents, responsive layout, and professional typography.

---

## 🖼️ Screenshots

### Homepage
*(Insert image)*

### Car Details Page
*(Insert image)*

### Admin Dashboard
*(Insert image)*

### Email Template
*(Insert image)*

---

## 🚀 Future Improvements

- **Payment Integration** – Stripe / PayPal for deposit collection.
- **Real‑time Updates** – WebSockets (Socket.io) instead of polling.
- **User Profile** – Edit personal details and view booking history.
- **Advanced Filters** – Filter cars by price, category, availability.
- **Multi‑language Support** – i18n internationalisation.
- **Analytics Dashboard** – Charts and reports for admin.
- **Car Image Upload** – Cloudinary integration for car images.
- **Reviews & Ratings** – Allow users to rate cars.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/your-feature
   ```
5. **Open a Pull Request.**

### Code Style
- **Frontend:** ESLint + Prettier (recommended)
- **Backend:** Standard JS

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Author:** Sami Abid  
**GitHub:** [github.com/Muhummad-Sami/Muhummad-Sami](https://github.com/Muhummad-Sami/Muhummad-Sami)  
**Email:** samirao9372@gmail.com  
**LinkedIn:** [linkedin.com/in/rao-sami-344a11333](https://www.linkedin.com/in/rao-sami-344a11333)
---

## 🙏 Acknowledgements

- [React](https://reactjs.org/) – UI library
- [Vite](https://vitejs.dev/) – Build tool
- [Node.js](https://nodejs.org/) – Runtime environment
- [Express](https://expressjs.com/) – Web framework
- [MongoDB](https://www.mongodb.com/) – Database
- [Brevo](https://www.brevo.com/) – Email service
- [Google Fonts](https://fonts.google.com/) – Typography

---

> Built with ❤️ and a passion for luxury.  
> © 2026 DriveLux. All rights reserved.
```