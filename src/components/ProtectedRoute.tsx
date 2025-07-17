import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login, but save the location they tried to access
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  // Check admin permissions if required
  if (requireAdmin && (!user || !user.isAdmin)) {
    return (
      <div className="permission-error">
        <h2>Permission Denied</h2>
        <p>You need administrator privileges to access this page.</p>
      </div>
    );
  }
  
  // User is authenticated and has proper permissions, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 