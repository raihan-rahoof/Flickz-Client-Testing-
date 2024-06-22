import React, {createContext,useState, useContext,useEffect } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = () => {
            const access = JSON.parse(localStorage.getItem('access'));
            const refresh = JSON.parse(localStorage.getItem('refresh'));

            if (access && refresh) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext

