# Smart Expense Tracker

A modern, premium-quality personal finance management web application that helps users track expenses, manage budgets, and gain financial insights through beautiful visualizations. Designed with a clean, high-end SaaS aesthetic.

## Features

- **Secure Authentication**: User sign up, log in, and secure session management using JWT and bcrypt.
- **Interactive Dashboard**: View summary statistics and spending trends through animated `Recharts` visualizations.
- **Expense Management**: Easily add, categorize, search, filter, and delete expenses in a comprehensive data table.
- **Smart Budgeting**: Set monthly spending limits and track your progress with dynamic circular progress bars.
- **Financial Analytics**: Get a dynamically calculated "Financial Health Score" based on your budget vs. spending ratio, along with personalized insights.
- **Data Export**: Download your transaction history as a CSV file.
- **Dark Mode**: Fully supported, persistent dark mode toggle with smooth transitions.
- **Responsive Design**: Flawlessly works across desktop, tablet, and mobile devices using an intuitive Sidebar and App Shell.

## Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, Framer Motion, React Router, Recharts, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & HTTP-only cookies

## Installation & Setup

Follow these instructions to run the project locally.

### Prerequisites
- Node.js (v16 or higher)
- A local MongoDB instance or a MongoDB Atlas connection URI.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2. Setup the Backend
Navigate to the `server` directory, install dependencies, and setup your environment variables.
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
# or: node server.js
```

### 3. Setup the Frontend
Open a new terminal, navigate to the `client` directory, and install the dependencies.
```bash
cd client
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Open the App
Visit `http://localhost:5173` in your browser. The backend API will be running on `http://localhost:5000`.

## Project Architecture

The project is structured into a separated client/server architecture:
- `/client`: Vite + React frontend containing the UI, contexts, and routing logic.
- `/server`: Express.js backend containing the REST API, MongoDB schemas, and authentication middleware.

## License
MIT License
