import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import styled from "styled-components";
import { API } from "../App";
import { Button } from "../components/button";
import { Input, InputLabel } from "../components/input";
import { Error, Title } from "../components/typography";
import { Test } from "../models";

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

export default function Login({ setUser }: any) {

    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [data, setData] = useState<Test>();
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const params = useParams();

    useEffect(() => {
        axios.get(API + 'test/' + params.testId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [params.testId]);

    if (loading || !data) {
        return <div>Loading</div>;
    }

    const validate = () => {
        let valid = true;
        if (!loginField) {
            setLoginError('Podaj login');
            valid = false;
        }
        else if (!loginField.match(/^[a-zA-Z0-9_]+$/)) {
            setLoginError('Podaj prawidłowy login');
            valid = false;
        }
        else setLoginError('');
        if (!passwordField) {
            setPasswordError('Podaj hasło');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const handleSubmit = () => {
        if (!validate()) return;
        axios.post(API + 'student/login', {
            login: loginField,
            password: passwordField,
            testId: params.testId ? parseInt(params.testId) : '0'
        }).then((res) => {
            setUser(res.data);
            setLoginField('');
            setPasswordField('');
        }).catch((err) => {
            if (err.response.data.message === 'Test has not started yet') setError('Test się jeszcze nie rozpoczał');
            else if (err.response.data.message === 'Time to log in has expired') setError('Czas na zalogowanie się minął');
            else if (err.response.data.message === 'Inactive student account') setError('Już wykorzystałeś swoją próbę na wypełnienie testu');
            else setError('Nieprawidłowy login lub hasło');
        });
    }

    function MyTimer({ expiryTimestamp }: any) {
        const {
            seconds,
            minutes,
            hours,
            days,
        } = useTimer({
            expiryTimestamp, onExpire: () => { }
        });

        return (
            <div style={{ textAlign: 'center' }} className='timer'>
                <div className='time'>
                    <span>{days < 10 ? '0' + days : days}</span>:<span>{hours < 10 ? '0' + hours : hours}</span>:<span>{minutes < 10 ? '0' + minutes : minutes}</span>:<span>{seconds < 10 ? '0' + seconds : seconds}</span>
                </div>
            </div>
        );
    }

    const loadTimer = () => {
        if (data.loginTimeStart > Date.now()) return (
            <div>
                <div>Logowanie możliwe za:</div>
                <MyTimer expiryTimestamp={data.loginTimeStart} />
            </div>
        );
        if (data.loginTimeEnd > Date.now()) return (
            <div>
                <div>Logowanie możliwe przez:</div>
                <MyTimer expiryTimestamp={data.loginTimeEnd} />
            </div>
        );
        return (
            <div>Czas na logowanie minął</div>
        );
    }

    return (
        <FlexContainer>
            <Container>
                <Title>{loadTimer()}</Title>
                <InputLabel>Login:</InputLabel>
                <Input value={loginField} onChange={(e) => setLoginField(e.target.value)} />
                {loginError && <Error>{loginError}</Error>}
                <InputLabel>Hasło:</InputLabel>
                <Input type='password' value={passwordField} onChange={(e) => setPasswordField(e.target.value)} />
                {passwordError && <Error>{passwordError}</Error>}
                <Button onClick={() => handleSubmit()}>Zaloguj</Button>
                {error && <Error>{error}</Error>}
            </Container>
        </FlexContainer>
    );
}
