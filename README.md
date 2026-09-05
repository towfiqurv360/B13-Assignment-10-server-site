# 🍽️ RecipeHub — Backend API Server

<div align="center">
  <h3>The robust and secure RESTful API powering the RecipeHub platform.</h3>
  <p>Built with Node.js, Express.js, and MongoDB to handle secure authentication, dynamic recipe management, role-based authorization, and Stripe payment processing.</p>
</div>

---

## ⚠️ Important Note for Evaluators (Cross-Origin Cookie Policy)
> **Cookie Configuration:** This backend is deployed on **Render**, while the client is on **Vercel**. To ensure seamless authentication across these domains, the JWT token is sent via HTTP-only cookies with `secure: true` and `sameSite: 'none'`. 
> 
> Please note that aggressive third-party cookie blocking in some modern browsers (or Incognito mode) may block these cross-origin cookies in the live environment. However, **the authentication and role-based access control (RBAC) work perfectly in the local environment**.

---

## 🌐 Live API URL

- 🔗 **Production Server:** [RecipeHub API](#) *(https://b13-assignment-10-server-site.onrender.com)*
- 🔗 **Client Application:** [RecipeHub Frontend](#) *(https://b13-assignment-10-recipehub.vercel.app/)*

---

## 🛠️ Technology Stack

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT) & Firebase Authentication
- **Security:** bcryptjs (Password Hashing), CORS, cookie-parser
- **Payments:** Stripe API integration

---

## 🔐 Key Features

- **JWT Authentication:** Secure user login and registration with HTTP-only cookies.
- **Role-Based Access Control:** Middleware to protect routes and verify `Admin` vs `User` privileges.
- **RESTful API Design:** Clean and structured endpoints for Users, Recipes, Favorites, Reports, and Payments.
- **Stripe Integration:** Secure payment intent generation and transaction logging.
- **Cross-Origin Resource Sharing:** Properly configured CORS to allow requests specifically from the Vercel frontend.

---

## ⚙️ Environment Variables (`.env`)

To run this server locally, create a `.env` file in the root directory and add the following keys:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
---

## 🚀 How to Run Locally
1. Clone the repository:

git clone (https://github.com/towfiqurv360/B13-Assignment-10-server-site.git)
