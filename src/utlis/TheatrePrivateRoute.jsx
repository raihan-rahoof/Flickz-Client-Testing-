import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import TheatreAuthContext from '../Context/TheatreAuthContext';

const TheatrePrivateRoute = ({ element: Element, ...rest }) => {
  const { isTheatreLoggedIn , loading} = useContext(TheatreAuthContext);

  if (loading) {
        return <div>Loading...</div>;
    }

  return isTheatreLoggedIn ? <Element {...rest} /> : <Navigate to="/theatre/login" replace />;
};

export default TheatrePrivateRoute;
