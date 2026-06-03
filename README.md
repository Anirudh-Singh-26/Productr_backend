# Productr Backend API

## Overview
Productr Backend is a Node.js, Express, and MongoDB REST API that powers the Productr product management dashboard. It provides OTP-based authentication, JWT session management using HttpOnly cookies, product management APIs, image uploads, and secure user access control.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cookie Parser
- Cloudinary
- Multer
- CORS

## Features
- OTP-based login and verification
- JWT authentication with HttpOnly cookies
- User session management
- Product CRUD operations
- Cloudinary image uploads
- Input validation
- Centralized error handling

## Project Structure
```text
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── config/
├── server.js
└── package.json
```

## Installation

```bash
git clone <repository-url>
cd backend
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OTP_EXPIRY_MINUTES=10
CLIENT_URL=http://localhost:5173
```

## Run Locally

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Modules

### Authentication
- Login
- OTP Verification
- Resend OTP
- Logout
- Current User

### Products
- Create Product
- Update Product
- Delete Product
- Fetch Products

## Security
- HttpOnly cookies
- JWT authentication
- Protected routes
- Validation middleware
- Secure file uploads

## Deployment
Recommended:
- Backend: Render
- Database: MongoDB Atlas
- Media Storage: Cloudinary

## License
@anirudhSinghRathore
For assessment and educational purposes.
