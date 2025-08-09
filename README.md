# Airtime Wallet Frontend

A modern React application for managing airtime purchases and digital wallet transactions.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC)
![Axios](https://img.shields.io/badge/Axios-1.11.0-purple)
![React Router](https://img.shields.io/badge/React_Router-7.8.0-CA4245)

## 📋 Features

- **User Authentication**: Secure login and registration
- **Wallet Management**: View balance and transaction history
- **Add Funds**: Top up your wallet easily
- **Airtime Purchase**: Buy airtime for any mobile network
- **Transaction History**: Track all your transactions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16.x or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/airtime-wallet-frontend.git
cd airtime-wallet-frontend
```

2. Install dependencies:

```bash
npm install
# or with yarn
yarn install
```

3. Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_BASE_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm start
# or with yarn
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🏗️ Architecture

### Project Structure

```plaintext
airtime-wallet-frontend/
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable components
│   ├── context/             # React context providers
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── App.js               # Main application component
│   └── index.js             # Application entry point
└── package.json             # Project dependencies and scripts
```

### Key Components

- **AuthContext**: Manages authentication state and user information
- **ProtectedRoute**: Controls access to authenticated routes
- **TopUpModal**: Modal component for adding funds to the wallet
- **Dashboard**: Main user interface showing wallet information and transactions
- **Purchase**: Interface for buying airtime

### API Integration

The application uses axios for API communication with the backend. All API calls are organized in service modules:

- **authAPI**: Authentication-related endpoints
- **purchaseAPI**: Transaction and wallet endpoints

## 🔒 Authentication Flow

1. User submits login/register form
2. Application sends credentials to the backend
3. On successful authentication, the backend returns a JWT token
4. Token is stored in localStorage and used for subsequent API calls
5. API interceptors handle token expiration and automatic logout

## 🛠️ Technologies

- **React**: UI library for building the interface
- **React Router**: For navigation and routing
- **Tailwind CSS**: For styling and responsive design
- **Axios**: For API calls
- **React Hot Toast**: For displaying notifications
- **Framer Motion**: For animations and transitions

## 🌐 API Endpoints

The application interacts with the following API endpoints:

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user
- `GET /api/auth/currentUser`: Get current user information

### Transactions

- `POST /api/purchase/airtime`: Purchase airtime
- `GET /api/purchase/wallet`: Get wallet information
- `GET /api/purchase/transactions`: Get transaction history
- `POST /api/purchase/add-funds`: Add funds to wallet

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🚀 Deployment

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory, ready to be deployed to a static hosting service.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Your Name](https://github.com/Yinye013)

## 🙏 Acknowledgments

- Thanks to all contributors and libraries used in this project.
