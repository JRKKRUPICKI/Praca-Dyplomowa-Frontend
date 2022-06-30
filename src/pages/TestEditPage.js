import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function TestEditPage() {

    const [loading, setLoading] = useState(true);

    const [test, setTest] = useState([]);

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState();

    const [timeField, setTimeField] = useState(0);
    const [timeError, setTimeError] = useState();

    const [loginTimeStartField, setLoginTimeStartField] = useState(Date.now());
    const [loginTimeStartError, setLoginTimeStartError] = useState();

    const [loginTimeEndField, setLoginTimeEndField] = useState(Date.now());
    const [loginTimeEndError, setLoginTimeEndError] = useState();

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setTest(res.data);
            setNameField(res.data.name);
            setTimeField(res.data.time);
            setLoginTimeStartField(new Date(new Date(res.data.loginTimeStart) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1));
            setLoginTimeEndField(new Date(new Date(res.data.loginTimeEnd) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1));
            setLoading(false);
        });
        
    }, [params])

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
        /*
        else if(nameField === test.name){
            setNameError('Nazwa testu jest taka sama');
            valid = false;
        }
        */
        else setNameError('');
        if(!timeField){
            setTimeError('Brak czasu trwania');
            valid = false;
        }
        else if(timeField < 1){
            setTimeError('Czas trwania nie może być krótszy niż jedna minuta');
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
        axios.patch('http://localhost:4000/test/' + test.id, {
            name: nameField,
            time: timeField,
            loginTimeStart: Date.parse(loginTimeStartField),
            loginTimeEnd: Date.parse(loginTimeEndField)
        }).then((res) => {
            alert('OK');
            getData();
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    const getData = () => {
        setLoading(true);
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setTest(res.data);
            setNameField(res.data.name);
            setTimeField(res.data.time);
            setLoginTimeStartField(new Date(new Date(res.data.loginTimeStart) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1));
            setLoginTimeEndField(new Date(new Date(res.data.loginTimeEnd) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1));
            setLoading(false);
        });
    }

    return loading ? <div>Loading</div> : (
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
                    Czas trwania (minuty):
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
                </label><br/>
                <Link to={'/tests'}><button>Anuluj</button></Link>
                <button type='button' onClick={() => handleSubmit()}>Zapisz</button>
            </form>
        </div>
    );
}
