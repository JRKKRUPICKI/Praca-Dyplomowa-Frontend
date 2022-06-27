import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function TestAddPage() {

    const auth = useAuth();
    const navigate = useNavigate();

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState();

    const [timeField, setTimeField] = useState(0);
    const [timeError, setTimeError] = useState();

    const toHTMLinputDatetime = (datetime) => {
        let dt = new Date(datetime);
        return dt.getFullYear() + '-' + (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + dt.getDate() + 'T' + dt.getHours() + ':' + dt.getMinutes();
    }

    const [loginTimeStartField, setLoginTimeStartField] = useState(toHTMLinputDatetime(Date.now()));
    const [loginTimeStartError, setLoginTimeStartError] = useState();

    const [loginTimeEndField, setLoginTimeEndField] = useState(toHTMLinputDatetime(Date.now()));
    const [loginTimeEndError, setLoginTimeEndError] = useState();

    const validate = () => {
        let valid = true;
        if(!nameField){
            setNameError('Brak nazwy testu');
            valid = false;
        }
        else if(nameField !== nameField.trim()){
            setNameError('Nieprawidłowa nazwa testu');
            valid = false;
        }
        else setNameError('');
        if(timeField <= 0){
            setTimeError('Za krótki czas trwania testu');
            valid = false;
        }
        else setTimeError('');
        if(Date.parse(loginTimeStartField) <= Date.now()){
            setLoginTimeStartError('Wybierz późniejszą datę');
            valid = false;
        }
        else setLoginTimeStartError('');
        if(Date.parse(loginTimeEndField) <= Date.parse(loginTimeStartField)){
            setLoginTimeEndError('Wybierz późniejszą datę');
            valid = false;
        }
        else setLoginTimeEndError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        alert(timeField);
        axios.post('http://localhost:4000/test', {
            name: nameField,
            teacherId: auth.user.id,
            time: timeField,
            loginTimeStart: Date.parse(loginTimeStartField),
            loginTimeEnd: Date.parse(loginTimeEndField)
        }).then((res) => {
            setNameField('');
            navigate('/tests');
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return (
        <div>
            <Link to={'/tests'}><button>Powrót</button></Link>
            <form>
                <label>
                    Nazwa testu:
                    <input type='text' value={nameField} onChange={(e) => setNameField(e.target.value)}/>
                    {nameError && <div>{nameError}</div>}
                </label>
                <br/>
                <label>
                    Czas trwania testu w minutach:
                    <input type='number' value={timeField} onChange={(e) => setTimeField(parseInt(e.target.value))}/>
                    {timeError && <div>{timeError}</div>}
                </label>
                <br/>
                <label>
                    Czas od kiedy można się zalogować do testu:
                    <input type='datetime-local' value={loginTimeStartField} onChange={(e) => setLoginTimeStartField(e.target.value)}/>
                    {loginTimeStartError && <div>{loginTimeStartError}</div>}
                </label>
                <br/>
                <label>
                    Czas do kiedy można się zalogować do testu:
                    <input type='datetime-local' value={loginTimeEndField} onChange={(e) => setLoginTimeEndField(e.target.value)}/>
                    {loginTimeEndError && <div>{loginTimeEndError}</div>}
                </label>
                <button type='button' onClick={() => handleSubmit()}>Dodaj</button>
            </form>
        </div>
    );
}
