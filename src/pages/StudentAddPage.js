import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function StudentAddPage() {

    const params = useParams();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(login + ':' + password);
        if(!login){
            alert('Nieprawidłowy login');
            return true;
        }
        if(!password){
            alert('Nieprawidłowe hasło');
            return true;
        }
        if(!login.match(/^[0-9a-zA-Z]+$/)){
            alert('Nieprawidłowy login');
            return true;
        }
        axios.post('http://localhost:4000/student', {
            login,
            password,
            testId: parseInt(params.testId)
        }).then((res) => {
            alert('OK')
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return (
        <div>
            <Link to={'/tests/' + params.testId + '/students'}><button>Powrót</button></Link>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    <input type='text' value={login} onChange={(e) => setLogin(e.target.value)}/>
                </label>
                <label>
                    Hasło:
                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <input type='submit'/>
            </form>
        </div>
    );
}
