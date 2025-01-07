# Backend Repository: URL Shortener Nestjs

## Overview
This repository contains the backend service for the **URL Shortener Application**. The backend is built using **NestJS** and provides RESTful APIs for URL shortening, user authentication, analytics, and topic management.

**Deployed at:** [https://nestjs-us-back.onrender.com](https://nestjs-us-back.onrender.com)

## Features
- **User Management**: Supports user registration, login, and authentication.
- **URL Shortening**: Converts long URLs into short aliases.
- **Analytics**: Tracks and provides performance metrics for shortened URLs.
- **Topics Management**: Allows users to categorize their URLs under specific topics.
- **Scalable Architecture**: Built with modularized NestJS modules for scalability and maintainability.
- **Database Integration**: Uses **PostgreSQL** with **Prisma ORM** for seamless database operations.

## Tech Stack
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT-based authentication

## Installation
### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- NPM >= 9.x

### Steps to Set Up Locally

1. Clone the repository:
   git clone <backend-repo-url>
   cd <backend-repo-folder>

2. Install dependencies:
   npm install

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

  ALLOWED_ORIGINS=http:localhost:5173,http://localhost:3000,........
  DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
  JWT_SECRET=<your-jwt-secret>
  FRONTEND_URL=<your-frontend-url>
  GOOGLE_CLIENT_ID=<your-google-clientId> like ******-******.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=<your-google-client secret>
  NODE_ENV=development/production
  BASE_URL = <your-backend-url>

4. Run database migrations:
   npx prisma migrate dev

5. Start the development server:
   npm run start:dev

6. Access the API at:
   [http://localhost:3001](http://localhost:3001)

## API Documentation
https://nestjs-us-back.onrender.com/docs
- **Swagger Documentation URL**: [https://nestjs-us-back.onrender.com/docs](https://nestjs-us-back.onrender.com/docs)
Remember to have jwt.connect.sid present in your browser cookie to test protected routes.
For that you need to successfully login from browser at- [https://nestjs-us-back.onrender.com](https://nestjs-us-back.onrender.com)


## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b Feat/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin your-feature`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

For further queries, contact [Kavit G. Patel](mailto:kvpatel.er@gmail.com).