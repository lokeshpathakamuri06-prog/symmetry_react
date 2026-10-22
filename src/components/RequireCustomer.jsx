import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCustomer } from '../context/CustomerContext';

/** Cart and checkout are for signed-in customers: visitors go to sign-in and come back here afterwards */
export const RequireCustomer = ({ children }) => {
  const { status } = useCustomer();
  const { pathname, search } = useLocation();
  if (status === 'guest') {
    return <Navigate to={`/account/login?next=${encodeURIComponent(pathname + search)}&reason=cart`} replace />;
  }
  if (status === 'checking') {
    return (
      <div className="pt-36 pb-24 site-container">
        <p className="text-muted inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>
      </div>
    );
  }
  return children;
};

export default RequireCustomer;
