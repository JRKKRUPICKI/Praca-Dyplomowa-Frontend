import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function StudentPage() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            const student = res.data.students.filter(student => student.id === parseInt(params.studentId))[0];
            setData(student);
            setLogin(student.login);
            setPassword(student.password);
            setLoading(false);
        });
    }, [params])

    const [login, setLogin] = useState();
    const [password, setPassword] = useState();

    const [loginError, setLoginError] = useState();
    const [passwordError, setPasswordError] = useState();

    const validate = () => {
        let valid = true;
        if(!login){
            setLoginError('Podaj login');
            valid = false;
        }
        else if(!login.match(/^[0-9a-zA-Z]+$/)){
            setLoginError('Nieprawidłowy login');
            valid = false;
        }
        else if(login === data.login){
            setLoginError('Login jest taki sam');
            valid = false;
        }
        else setLoginError('');
        if(!password){
            setPasswordError('Podaj hasło');
            valid = false;
        }
        else if(password === data.password){
            setPasswordError('Hasło jest takie samo');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!validate()) return;
        alert(login + ':' + password);
        axios.patch('http://localhost:4000/student/' + data.id, {
            login,
            password
        }).then((res) => {
            alert('OK');
            setLoading(true);
            axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
                const student = res.data.students.filter(student => student.id === parseInt(params.studentId))[0];
                setData(student);
                setLogin(student.login);
                setPassword(student.password);
                setLoading(false);
            });
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId + '/students'}><button>Powrót</button></Link>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    <input type='text' value={login} onChange={(e) => setLogin(e.target.value)}/>
                    {loginError && <div>{loginError}</div>}
                </label>
                <label>
                    Hasło:
                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    {passwordError && <div>{passwordError}</div>}
                </label>
                <input type='submit'/>
            </form>
        </div>
    );
}
