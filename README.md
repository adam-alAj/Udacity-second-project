# Store API (Node.js + TypeScript)

## 📦 Project Overview
This project is a backend RESTful API built with **Node.js**, **Express**, and **TypeScript** for managing users, products, and orders. It follows a layered architecture with models, and handlers, to ensure scalability and clean code organization.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/adam-alAj/Udacity-second-project.git
cd Udacity-second-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following variables:

```
PORT=3000

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_dev
POSTGRES_TEST_DB=store_tests
POSTGRES_USER=store_user
POSTGRES_PASSWORD=store_pass
ENV=dev
BCRYPT_PASSWORD=A6hY@&2gPzT4!KmX9qLpW$s7DjNfC8bR1eUoV0iZbGyE5t
SALT_ROUNDS=10
TOKEN_SECRET=M!r5p&k9T_h2Z@t7bx4W$y8C^v0Q*u3L+j6G-a1S/d0Fe2Io5Pq7Nm9Rl4Kc6Vz8E



JWT_SECRET=M!r5p&k9T_h2Z@t7bx4W$y8C^v0Q*u3L+j6G-a1S/d0Fe2Io5Pq7Nm9Rl4Kc6Vz8E
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10yar
```

### 4. Database Setup
Make sure PostgreSQL is installed and running.

Create the databases:
```bash
psql -U postgres
CREATE DATABASE store_dev;
CREATE DATABASE store_test;
```

Run migrations:
```bash
npx db-migrate up
```

### 5. Start the Server
```bash
npm run build
npm start
```
The server will start on **http://localhost:3000**

### 6. Running Tests
```bash
npm run test
```

---

## 🧠 Technologies Used
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication
- bcrypt Password Hashing
- Jasmine (for testing)

---

## 🧩 Project Structure
```
src/
 ├── db/
 |   ├── index.ts
 ├── server.ts
 ├── app.ts
 ├── handlers/
 │    ├── users.ts
 │    ├── products.ts
 │    └── orders.ts
 ├── models/
 │    ├── user.ts
 │    ├── product.ts
 │    └── order.ts
 └── tests/
      ├── user_endpoint.spec.ts
      ├── user_model.spc.ts
      ├── product_model.spec.ts
      ├── product_endpoint.spec.ts
      └── order_model.spec.ts
      ├── order_endpoint.spec.ts
```

---

## 🪶 Scripts
| Command | Description |
|----------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run dev` | Run development server with nodemon |
| `npm run test` | Run all Jasmine tests |

---


