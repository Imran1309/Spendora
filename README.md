# Spendora – Full Stack Expense Tracker

A professional full-stack mobile application built for managing daily expenses and income. This project was developed as a technical assessment for the Full Stack Development Internship.

## 🚀 Features

- **User Authentication**: Secure Register and Login system using JWT (JSON Web Tokens).
- **Expense Management**: Full CRUD (Create, Read, Update, Delete) functionality for transactions.
- **Dashboard Summary**: Real-time visualization of total balance, income, and expenses with category-wise filtering.
- **Offline Support**: Transactions are cached locally using `AsyncStorage`, allowing users to view their data even without an active internet connection.
- **Form Validation**: Secure input handling with clear error feedback.
- **Modern UI/UX**: Premium design using Linear Gradients, Glassmorphism effects, and professional icons.
- **Dynamic Greeting**: Personalized dashboard greeting based on the logged-in user.

## 🛠️ Tech Stack

- **Frontend**: React Native (Expo), React Navigation, Context API.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Styling**: Vanilla CSS with professional color palettes.

## 📦 Project Structure

```
Spendora/
├── backend/            # Express.js Server & API
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints (Auth, Expenses)
│   └── server.js       # Entry point
└── src/                # React Native Frontend
    ├── components/     # Reusable UI Components
    ├── context/        # State Management (Auth, Currency)
    ├── navigation/     # App Routing
    ├── screens/        # Application Pages
    └── config.js       # Global Configurations
```

## ⚙️ Setup & Installation

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file with your `MONGO_URI` and `JWT_SECRET`.
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the root folder:
   ```bash
   npm install
   ```
2. Update the API IP address in `src/config.js` to match your computer's local IP.
3. Start the Expo project:
   ```bash
   npx expo start
   ```
4. Scan the QR code with **Expo Go** or press `a` for Android Emulator.

### 3. Run process
```they will make singup a account with there email and password and then they will login and then they will be able to use the app
```


