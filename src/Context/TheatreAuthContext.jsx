import React, { createContext, useState , useEffect } from "react";

const TheatreAuthContext = createContext();

export const TheatreAuthProvider = ({ children }) => {
  const [isTheatreLoggedIn, setIsTheatreLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const checkAuthStatus = () => {
      const access = JSON.parse(localStorage.getItem("theatre_access"));
      const refresh = JSON.parse(localStorage.getItem("theatre_refresh"));

      if (access && refresh) {
        setIsTheatreLoggedIn(true);
      } else {
        setIsTheatreLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  return (
    <TheatreAuthContext.Provider value={{ isTheatreLoggedIn, setIsTheatreLoggedIn , loading }}>
      {children}
    </TheatreAuthContext.Provider>
  );
};


export default TheatreAuthContext;
