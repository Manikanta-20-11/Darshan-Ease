# Darshan Ease 🛕

A full-stack MERN pilgrimage management system that replaces physical temple queues with a digital slot-booking platform.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), Tailwind CSS v4 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Authentication** | JWT + bcrypt |
| **Architecture** | MVC (Models, Controllers, Routes) |

---

## 📁 Project Structure

```
darshan-ease/
├── client/                 # React Frontend
│   └── src/
│       ├── context/        # AuthContext (JWT persistence)
│       ├── pages/          # HomePage, Dashboard, BookSlot, AdminPortal, Login, Register
│       ├── components/     # Navbar
│       └── utils/          # api.js (Axios instance + JWT interceptor)
│
└── server/                 # Node/Express Backend
    ├── config/db.js        # MongoDB connection
    ├── models/             # User, Slot, Booking (Mongoose schemas)
    ├── controllers/        # authController, slotController, bookingController, adminController
    ├── routes/             # authRoutes, slotRoutes, bookingRoutes, adminRoutes
    ├── middleware/         # authMiddleware (protect, admin)
    └── server.js           # App entry point
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/darshan-ease.git
cd darshan-ease
```

### 2. Configure Backend
```bash
cd server
npm install
```
Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
```bash
npm run dev    # Starts on http://localhost:5000
```

### 3. Configure Frontend
```bash
cd ../client
npm install
npm run dev    # Starts on http://localhost:5173
```

---

## 🔗 API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT |

### Slot Routes (`/api/slots`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get slots (filter by `?date=YYYY-MM-DD`) |
| POST | `/` | Admin | Create a new darshan slot |
| PUT | `/:id` | Admin | Update slot capacity or status |

### Booking Routes (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | User | Book a darshan slot |
| GET | `/mybookings` | User | Get logged-in user's bookings |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/stats` | Admin | Platform-wide stats |
| GET | `/bookings` | Admin | All system bookings |
| GET | `/users` | Admin | All registered devotees |

---

## 👤 User Roles

- **Devotee (User):** Register, login, view and book available darshan slots, view personal booking history with Darshan Token.
- **Admin:** All user capabilities + create/edit/cancel slots, view all system bookings, view all registered devotees, see real-time platform metrics.

---

## 🔐 Security

- Passwords hashed with **bcrypt** before database storage
- All protected routes validate a **Bearer JWT** token in the `Authorization` header
- Admin routes require **both** a valid JWT **and** `role === 'admin'`

---

## ✨ Key Features

- ✅ JWT-based authentication with localStorage persistence
- ✅ Unique **Darshan Token** generated per booking (e.g., `DE-3FA2C91B`)
- ✅ Real-time capacity checking prevents overbooking
- ✅ Expired/cancelled slots shown with visual grey state
- ✅ Admin Portal with live stats, slot management, booking history, and devotee list
- ✅ Responsive Divine Modern (orange/cream) theme
