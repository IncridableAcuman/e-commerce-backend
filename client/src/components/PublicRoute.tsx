import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';

export const PublicRoute: React.FC = () => {
  const { user, isLoading } = UseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};