import { useState } from "react";
import Login from "./login";
import '../App.scss';
import TestPage from "./test.page";

export default function Main() {

    const [user, setUser] = useState();

    return (
        user ? <TestPage user={user} setUser={setUser} /> : <Login setUser={setUser} />
    );
}
