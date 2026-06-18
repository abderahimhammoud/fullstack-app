# Fullstack App

This project contains a frontend React application and a backend Express API.

## Installation

### 1. Clone the repository
```bash
git clone "https://github.com/abderahimhammoud/fullstack-app.git"
cd fullstack-app
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
Create a `.env` file in the `backend` folder using the example below:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
```

### 5. Start the application

Start the backend:
```bash
cd backend
node server.js
```

Start the frontend in another terminal:
```bash
cd frontend
npm start
```

## Project Structure

```text
fullstack-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── Auth.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Main Features

- User authentication (login/signup)
- JWT-based authentication
- Protected profile/dashboard views
- Responsive frontend design

## Notes

- The frontend is configured to communicate with the backend using the API URL defined in the environment.
- For production deployment, make sure to use a valid MongoDB connection string and secure JWT secret.
