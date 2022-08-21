import { useState } from "react";
import Login from "./login";
import Test from "./test";
import '../pages/StudentLoginPage.scss';

export default function Main(){

    const [user, setUser] = useState();

    return (
        user ? <Test user={user} setUser={setUser}/> : <Login setUser={setUser}/>
    );
}