import { createContext, useContext, useState } from "react";
import Cookies from 'universal-cookie';

const AuthContext = createContext<AuthType | null>(null);

type User = {
    id: number,
    email: string
}

type AuthType = {
    user: User | null,
    login: (user: User) => void,
    logout: () => void
}

export const AuthProvider = ({children}: any) => {
    const cookies = new Cookies();
    const [user, setUser] = useState(cookies.get('user'));

    const login = (user: User) => {
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
