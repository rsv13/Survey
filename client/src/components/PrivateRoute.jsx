import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {

<<<<<<< HEAD
    const { currentUser } = useSelector ((state) => state.user);
    return currentUser ? <Outlet /> : <Navigate to='/sign-in' />

=======
    const { currentUser } = useSelector(state => state.user);

  return currentUser ? <Outlet /> : <Navigate to = '/sign-in' />;
>>>>>>> 902bd37 (Make the dashboard private)
}
