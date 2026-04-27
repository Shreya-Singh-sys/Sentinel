import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'staff' | 'guest';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  
  // Abhi ke liye hum localStorage se check kar rahe hain
  // Production mein aap Firebase Auth state use karenge
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Agar login nahi hai toh login page bhej do
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== requiredRole) {
    // Agar role match nahi karta toh home ya unauthorized page bhej do
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;