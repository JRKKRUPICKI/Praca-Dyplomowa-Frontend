import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import styled from "styled-components";
import { API } from "../App";
import { Button } from "../components/button";
import { Input, InputLabel } from "../components/input";
import { Error, Title } from "../components/typography";

const FlexContainer = styled.div`
    display: flex;
    height: 100vh;
    align-items: center;
`;

const Container = styled.div`
    background: #1e1f24;
    border-radius: 10px;
    padding: 50px;
    width: 500px;
    height: fit-content;
    margin: 0 auto 0 auto;
    display: flex;
    flex-direction: column;

    & ${Error}{
        text-align: center;
        margin-top: 8px;
    }

    & ${Title}{
        font-size: 20px;
        text-align: center;
    }

    ${Button}{
        font-size: 16px;
        margin-top: 16px;
    }
`;

export default function Login({ setUser }){

    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const [loginError, setLoginError] = useState();
    const [passwordError, setPasswordError] = useState();

    const [loginTimeError, setLoginTimeError] = useState();

    const [data, setData] = useState();
    const [questionData, setQuestionData] = useState();
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        axios.get(API + 'test/' + params.testId).then((res) => {
            setData(res.data);
            axios.get(API + 'question/test/' + params.testId).then((res) => {
                setQuestionData(res.data);
                setLoading(false);
            });
        })
    }, [params.testId])

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
        axios.post(API + 'student/login', {
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
            //isRunning,
            //start,
            //pause,
            //resume,
            //restart,
        } = useTimer({ expiryTimestamp, onExpire: () => {
            alert('Koniec czasu, odpowiedzi zostały automatycznie przesłane');
            setUser();
        }});

        return (
            <div style={{textAlign: 'center'}} className='timer'>
                <div className='time'>
                    <span>{days < 10 ? '0' + days : days}</span>:<span>{hours < 10 ? '0' + hours : hours}</span>:<span>{minutes < 10 ? '0' + minutes : minutes}</span>:<span>{seconds < 10 ? '0' + seconds : seconds}</span>
                </div>
            </div>
        );
    }

    const loadTimer = () => {
        if(data.loginTimeStart > Date.now()) return (
            <div>
                <div>Logowanie możliwe za:</div>
                <MyTimer expiryTimestamp={data.loginTimeStart}/>
            </div>
        );
        if(data.loginTimeEnd > Date.now()) return (
            <div>
                <div>Logowanie możliwe przez:</div>
                <MyTimer expiryTimestamp={data.loginTimeEnd}/>
            </div>
        );
        return (
            <div>Czas na logowanie minął</div>
        );
    }

    return loading ? <div>Loading</div> : (
        <FlexContainer>
            <Container>
                <Title>{loadTimer()}</Title>
                <InputLabel>Login:</InputLabel>
                <Input value={loginField} onChange={(e) => setLoginField(e.target.value)}/>
                {loginError && <Error>{loginError}</Error>}
                <InputLabel>Hasło:</InputLabel>
                <Input type='password' value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
                {passwordError && <Error>{passwordError}</Error>}
                <Button onClick={() => handleSubmit()}>Zaloguj</Button>
                {loginTimeError && <Error>{loginTimeError}</Error>}
            </Container>
        </FlexContainer>
    );
}