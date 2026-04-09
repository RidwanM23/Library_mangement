# Library Management System

A full-stack application for managing library operations, including book inventory, member registration, and book borrowing/returning processes.

## Project Structure

The project is structured into two main directories:
- `backend/`: Express.js application handling the REST API.
- `frontend/`: React application built with Vite for the user interface.

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:
- Node.js (v16.0.0 or higher recommended)
- MySQL Server

## Setup Instructions

### 1. Database Setup

1. Start your MySQL service.
2. Create a new database named `library_db` (or a name of your choice).
   ```sql
   CREATE DATABASE library_db;
   ```
3. Create the necessary tables. The application uses the following tables:
   - `users`: (id, nama, email, password)
   - `books`: (id, judul, penulis, tahun)
   - `loans`: (id, user_id, book_id, tanggal_pinjam, tanggal_kembali, status)

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory based on your local database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=library_db
   JWT_SECRET=supersecretkey_beginner_friendly_123
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```
   The backend server should now be running on `http://localhost:5000`.

### 3. Administrator Setup

To set up an initial administrator account to log into the application using the front-end, run the provided utility script in the backend directory.

1. Ensure your database is running and credentials are correct in the `.env` file.
2. In the `backend` directory, run:
   ```bash
   node fix-admin.js
   ```
   This will create (or reset) the admin user with:
   - Email: `admin@lib.com`
   - Password: `admin123`

### 4. Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application should now be accessible. The terminal will output the local development URL, usually `http://localhost:5173`.

## Usage

1. Navigate to the frontend URL in your browser.
2. Log in using the admin configuration generated during the Administrator Setup step.
3. Access the Dashboard to manage Users, Books, and Library Loans.
