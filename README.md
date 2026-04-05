# Finance Dashboard API

A role-based finance data processing and access control backend built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** — authentication
- **bcryptjs** — password hashing
- **dotenv** — environment configuration

---

## Project Structure

```
finance-dashboard/
├── src/
│   ├── index.js
│   ├── models/
│   │   ├── db.js
│   │   ├── User.js
│   │   └── Record.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── records.js
│       └── dashboard.js
├── .env
├── package.json
└── README.md
```

---

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Create `.env` file in root**
```env
MONGO_URI=
JWT_SECRET=
PORT=
```
*(Add your own values)*

**3. Run the server**
```bash
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and get JWT token |

---

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | Self or Admin | Get user by ID |
| PATCH | `/users/:id` | Admin | Update name, role, status, password |
| DELETE | `/users/:id` | Admin | Delete a user |

---

### Records

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/records` | All roles | List records with filters |
| GET | `/records/:id` | All roles | Get a single record |
| POST | `/records` | Admin | Create a record |
| PATCH | `/records/:id` | Admin | Update a record |
| DELETE | `/records/:id` | Admin | Soft delete a record |

**Query filters:** `?type=income` `?category=salary` `?from=2024-01-01` `?to=2024-12-31` `?page=1` `?limit=20`

---

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/summary` | All roles | Total income, expenses, net balance |
| GET | `/dashboard/by-category` | Analyst + Admin | Totals grouped by category |
| GET | `/dashboard/monthly` | Analyst + Admin | Month by month trend (last 12 months) |
| GET | `/dashboard/recent` | All roles | Latest transactions |

---

## Example Responses

**POST /auth/register**
```json
{
  "message": "User created",
  "id": "user_id"
}
```

**POST /auth/login**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "User",
    "email": "user@email.com",
    "role": "admin"
  }
}
```

**GET /records**
```json
{
  "page": 1,
  "limit": 20,
  "data": [
    {
      "_id": "record_id",
      "amount": 5000,
      "type": "income",
      "category": "Salary",
      "date": "2024-01-01",
      "notes": "January salary",
      "createdBy": { "name": "User" }
    }
  ]
}
```

**GET /dashboard/summary**
```json
{
  "total_income": 15000,
  "total_expenses": 6000,
  "net_balance": 9000,
  "total_records": 10
}
```

---

## Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| View records | ✅ | ✅ | ✅ |
| View summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View category breakdown | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| Create / edit records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Error Responses

```json
{ "error": "Error message here" }
```

| Code | Meaning |
|------|---------|
| 400 | Bad request / missing fields |
| 401 | Invalid or missing token |
| 403 | Insufficient role |
| 404 | Not found |
| 409 | Email already in use |
| 500 | Server error |

---

## Assumptions & Design Decisions

- MongoDB creates the `finance` database automatically on first connection.
- Passwords are hashed with bcrypt — never stored as plain text.
- Records use soft delete — `deletedAt` is set instead of permanent removal.
- JWT tokens expire in 7 days.
- Registration is open for demo purposes. In production only admins should create users.
- Roles are kept as simple strings — no separate permissions table needed for this scope.
