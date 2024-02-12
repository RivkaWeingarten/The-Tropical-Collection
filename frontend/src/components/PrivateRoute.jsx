import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function PrivateRoute() {
  const { signedIn } = useUser();

  return signedIn ? <Outlet /> : <Navigate to="login" replace />;
}

export default PrivateRoute;