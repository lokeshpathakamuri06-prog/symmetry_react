import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07121C] text-[#F5F1E8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#36656B] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-white/60">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
