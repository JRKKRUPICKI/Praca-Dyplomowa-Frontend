import { createContext, useContext, useState } from "react";
import Cookies from 'universal-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const cookies = new Cookies();
    const [user, setUser] = useState(cookies.get('user'));

    const login = user => {
        setUser(user);
        cookies.set('user', user);
    }

    const logout = () => {
        setUser(null);
        cookies.remove('user');
    }

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
