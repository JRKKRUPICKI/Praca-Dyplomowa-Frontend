import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from 'react-timer-hook';

export default function StudentLoginPage() {

    const params = useParams();

    const [data, setData] = useState();
    const [questionData, setQuestionData] = useState();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setData(res.data);
            axios.get('http://localhost:4000/question/test/' + params.testId).then((res) => {
                setQuestionData(res.data);
                setLoading(false);
            });
        })
    }, [params])

    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const [loginError, setLoginError] = useState();
    const [passwordError, setPasswordError] = useState();

    const [loginTimeError, setLoginTimeError] = useState();

    const validate = () => {
        let valid = true;
        if(!loginField){
            setLoginError('Podaj login');
            valid = false;
        }
        else if(loginField !== loginField.trim()){
            setLoginError('Podaj prawidłowy login');
            valid = false;
        }
        else setLoginError('');
        if(!passwordField){
            setPasswordError('Podaj hasło');
            valid = false;
        }
        else if(passwordField !== passwordField.trim()){
            setPasswordError('Podaj prawidłowe hasło');
            valid = false;
        }
        else setPasswordError('');
        const now = new Date();
        const start = new Date(data.loginTimeStart);
        const end = new Date(data.loginTimeEnd);
        if(now < start){
            setLoginTimeError('Test jeszcze nie rozpoczął się');
            valid = false;
        }
        else if(now >= end){
            setLoginTimeError('Czas za zalogowanie się minął');
            valid = false;
        }
        else setLoginTimeError();
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        axios.post('http://localhost:4000/student/login', {
            login: loginField,
            password: passwordField,
            testId: parseInt(params.testId)
        }).then((res) => {
            setUser(res.data);
            setLoginField('');
            setPasswordField('');
        }).catch((err) => {
            alert(err.response.data.message);
        })
    }

    function MyTimer({ expiryTimestamp }) {
        const {
            seconds,
            minutes,
            hours,
            days,
            isRunning,
            start,
            pause,
            resume,
            restart,
        } = useTimer({ expiryTimestamp, onExpire: () => {
            alert('Koniec czasu, odpowiedzi zostały automatycznie przesłane');
            setUser();
        }});


        return (
            <div style={{textAlign: 'center'}}>
                <h1>Czas na przesłanie odpowiedzi</h1>
                <div style={{fontSize: '70px'}}>
                    <span>{hours < 10 ? '0' + hours : hours}</span>:<span>{minutes < 10 ? '0' + minutes : minutes}</span>:<span>{seconds < 10 ? '0' + seconds : seconds}</span>
                </div>
            </div>
        );
    }

    const testTime = () => {
        const time = new Date();
        time.setMinutes(time.getMinutes() + data.time);
        return time;
    }

    const loadQuestions = () => {
        let list = [];
        questionData.forEach(q => {
            let b = [];
            b.id = q.id;
            b.name = q.name;
            b.type = q.type;
            b.answers = [];
            q.answers.forEach(a => {
                let c = [];
                c.id = a.id;
                c.name = a.name;
                b.answers.push(c);
            });
            list.push(b);
        });
        return list;
    }

    const toHTMLinputDatetime = (datetime) => {
        let dt = new Date(datetime);
        return dt.getFullYear() + '-' + (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + dt.getDate() + 'T' + dt.getHours() + ':' + dt.getMinutes();
    }

    return loading ? <div>Loading</div> : (
        !data ? <div>Test nie istnieje</div> : (
            !user ? (
                <div>
                    {toHTMLinputDatetime(new Date(data.loginTimeStart)) + ' - ' + toHTMLinputDatetime(new Date(data.loginTimeEnd))}
                    <form>
                        <label>
                            Login:
                            <input type='text' value={loginField} onChange={(e) => setLoginField(e.target.value)}/>
                            {loginError && <div>{loginError}</div>}
                        </label>
                        <label>
                            Hasło:
                            <input type='password' value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
                            {passwordError && <div>{passwordError}</div>}
                        </label>
                        <button type='button' onClick={() => handleSubmit()}>Zaloguj</button>
                        {loginTimeError && <div>{loginTimeError}</div>}
                    </form>
                </div>
            ) : (
                <div>
                    <MyTimer expiryTimestamp={testTime}/>
                    <center>
                    <form method='POST'>
                        {loadQuestions().map(q => <div key={q.id}>
                            <div><b>{q.name}</b></div>
                            {!q.type ? (
                                q.answers.map(a => <div key={a.id}>
                                    <input type='radio' id={a.id} name={q.id} value={a.id}/>
                                    <label htmlFor={a.id}>{a.name}</label>
                                </div>)
                            ) : (
                                q.answers.map(a => <div key={a.id}>
                                    <input type='checkbox' id={a.id} name={a.id} value={a.id}/>
                                    <label htmlFor={a.id}>{a.name}</label>
                                </div>)
                            )}
                            
                        </div>)}
                        <input type='submit' value='Prześlij odpowiedzi'/>
                    </form>
                    </center>
                </div>
            )
        )
    );
}
