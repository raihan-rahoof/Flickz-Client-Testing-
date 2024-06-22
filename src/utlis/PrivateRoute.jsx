import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
