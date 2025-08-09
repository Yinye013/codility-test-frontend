import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Purchase from "./pages/Purchase";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "8px",
                padding: "16px",
                fontSize: "15px",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#10b981",
                  color: "#fff",
                  border: "1px solid #059669",
                },
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#10b981",
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: "#ef4444",
                  color: "#fff",
                  border: "1px solid #dc2626",
                },
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#ef4444",
                },
              },
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute>{<Dashboard />}</ProtectedRoute>}
            />
            <Route
              path="/purchase"
              element={<ProtectedRoute>{<Purchase />}</ProtectedRoute>}
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
