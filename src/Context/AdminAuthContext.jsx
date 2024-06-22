import React, { createContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const access = JSON.parse(localStorage.getItem("admin_access"));
      const refresh = JSON.parse(localStorage.getItem("admin_refresh"));

      if (access && refresh) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
