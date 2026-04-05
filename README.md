# Finance Dashboard API

A role-based finance data processing and access control backend built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Node.js** + **Express** — server and routing
- **MongoDB** + **Mongoose** — database and models
- **JWT** — token-based authentication
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

**2. Create `.env` file in the root**

```env
MONGO_URI=mongodb://127.0.0.1:27017/finance
JWT_SECRET=supersecretkey123
PORT=3000
```

**3. Run the server**

```bash
npm run dev
```

---

## `/auth/register` Endpoint

### Description

Registers a new user with a name, email, password, and role.

### HTTP Method

`POST`

### Request Body

- `name` (string, required): User's full name.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.
- `role` (string, optional): One of `viewer`, `analyst`, `admin`. Defaults to `viewer`.

### Example Response

```json
{
  "message": "User created",
  "id": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

---

## `/auth/login` Endpoint

### Description

Authenticates a user with email and password. Returns a JWT token on success.

### HTTP Method

`POST`

### Request Body

- `email` (string, required): User's email address.
- `password` (string, required): User's password.

### Example Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Admin",
    "email": "admin@finance.com",
    "role": "admin"
  }
}
```

---

## `/users` Endpoint

### Description

Returns a list of all registered users.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token. Admin only.

`Authorization: Bearer <token>`

### Example Response

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Admin",
    "email": "admin@finance.com",
    "role": "admin",
    "status": "active"
  }
]
```

---

## `/users/:id` Endpoint (PATCH)

### Description

Updates a user's name, role, status, or password.

### HTTP Method

`PATCH`

### Authentication

Requires a valid JWT token. Admin only.

### Request Body (all fields optional)

- `name` (string): New name.
- `role` (string): One of `viewer`, `analyst`, `admin`.
- `status` (string): `active` or `inactive`.
- `password` (string): New password (minimum 6 characters).

### Example Response

```json
{
  "message": "User updated"
}
```

---

## `/users/:id` Endpoint (DELETE)

### Description

Deletes a user by ID. Admin cannot delete themselves.

### HTTP Method

`DELETE`

### Authentication

Requires a valid JWT token. Admin only.

### Example Response

```json
{
  "message": "User deleted"
}
```

---

## `/records` Endpoint (GET)

### Description

Returns a paginated list of financial records. Supports filtering by type, category, and date range.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token. All roles.

### Query Parameters

- `type` (string, optional): `income` or `expense`.
- `category` (string, optional): Filter by category name.
- `from` (string, optional): Start date in `YYYY-MM-DD` format.
- `to` (string, optional): End date in `YYYY-MM-DD` format.
- `page` (number, optional): Page number. Default is `1`.
- `limit` (number, optional): Records per page. Default is `20`.

### Example Response

```json
{
  "page": 1,
  "limit": 20,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "amount": 5000,
      "type": "income",
      "category": "Salary",
      "date": "2024-01-01",
      "notes": "January salary",
      "createdBy": { "name": "Admin" }
    }
  ]
}
```

---

## `/records` Endpoint (POST)

### Description

Creates a new financial record.

### HTTP Method

`POST`

### Authentication

Requires a valid JWT token. Admin only.

### Request Body

- `amount` (number, required): The transaction amount.
- `type` (string, required): `income` or `expense`.
- `category` (string, required): Category name e.g. Salary, Rent.
- `date` (string, required): Date in `YYYY-MM-DD` format.
- `notes` (string, optional): Additional description.

### Example Response

```json
{
  "message": "Record created",
  "id": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```

---

## `/records/:id` Endpoint (PATCH)

### Description

Updates an existing financial record by ID.

### HTTP Method

`PATCH`

### Authentication

Requires a valid JWT token. Admin only.

### Request Body (all fields optional)

- `amount`, `type`, `category`, `date`, `notes`

### Example Response

```json
{
  "message": "Record updated"
}
```

---

## `/records/:id` Endpoint (DELETE)

### Description

Soft deletes a record by setting a `deletedAt` timestamp. Data is never permanently removed.

### HTTP Method

`DELETE`

### Authentication

Requires a valid JWT token. Admin only.

### Example Response

```json
{
  "message": "Record deleted"
}
```

---

## `/dashboard/summary` Endpoint

### Description

Returns total income, total expenses, net balance, and total record count.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token. All roles.

### Example Response

```json
{
  "total_income": 15000,
  "total_expenses": 6000,
  "net_balance": 9000,
  "total_records": 10
}
```

---

## `/dashboard/by-category` Endpoint

### Description

Returns income and expense totals grouped by category.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token. Analyst and Admin only.

### Example Response

```json
[
  { "_id": { "category": "Salary", "type": "income" }, "total": 10000, "count": 2 },
  { "_id": { "category": "Rent", "type": "expense" }, "total": 2400, "count": 2 }
]
```

---

## `/dashboard/monthly` Endpoint

### Description

Returns month-by-month income and expense breakdown for the last 12 months.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token. Analyst and Admin only.

### Example Response

```json
[
  { "_id": "2024-02", "income": 5450, "expenses": 1400 },
  { "_id": "2024-01", "income": 5800, "expenses": 1650 }
]
```

---

## `/dashboard/recent` Endpoint

### Description

Returns the most recent financial transactions.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token. All roles.

### Query Parameters

- `limit` (number, optional): Number of records to return. Max 20. Default is 5.

### Example Response

```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-01",
    "createdBy": { "name": "Admin" }
  }
]
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

All endpoints return consistent error responses:

```json
{ "error": "Error message here" }
```

Common status codes:

- `200` — Success
- `201` — Created
- `400` — Bad request / missing fields
- `401` — Unauthorized / invalid token
- `403` — Forbidden / insufficient role
- `404` — Not found
- `409` — Conflict (e.g. email already in use)
- `500` — Internal server error

---

## Assumptions & Design Decisions

- MongoDB automatically creates the `finance` database on first connection. No manual setup needed.
- Passwords are hashed with bcrypt before storing. Never stored as plain text.
- Records use soft delete — a `deletedAt` timestamp is set instead of permanently removing data.
- JWT tokens expire in 7 days. Change `JWT_SECRET` in production.
- Registration is open for demo purposes. In production, only admins should be able to create users.
- Roles are simple strings on the user document — no separate permissions table needed for this scope.
- Pagination is built into `GET /records` using `page` and `limit` query params.
