import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";

export default function RequireAuth({children}: any){
    const auth = useAuth();
    const location = useLocation();
    if(!auth || !auth.user){
        return <Navigate to='/' state={{path: location.pathname}}/>;
    }
    return children;
}
