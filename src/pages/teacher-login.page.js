import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/Auth";
import { Button } from "../ui/button";
import { Input, InputLabel } from "../ui/input";
import { Error, Title } from "../ui/typography";

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

export default function TeacherLoginPage() {

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.path || '/tests';

    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();

    const validate = () => {
        let valid = true;
        if(!emailField){
            setEmailError('Podaj adres e-mail');
            valid = false;
        }
        else if(emailField !== emailField.trim()){
            setEmailError('Podaj prawidłowy adres e-mail');
            valid = false;
        }
        else setEmailError('');
        if(!passwordField){
            setPasswordError('Podaj hasło');
            valid = false;
        }
        else if(passwordField !== passwordField.trim()){
            setPasswordError('Podaj prawidłowe hasło');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        axios.post('http://localhost:4000/teacher/login', {
            email: emailField,
            password: passwordField
        }).then((res) => {
            auth.login(res.data);
            navigate(redirectPath, {replace: true});
        }).catch((err) => {
            alert(err.response.data.message);
        })
    }

    return (
        <FlexContainer>
            <Container>
                <Title>Logowanie na istniejące konto</Title>
                <InputLabel>Adres e-mail:</InputLabel>
                <Input value={emailField} onChange={(e) => setEmailField(e.target.value)}/>
                {emailError && <Error>{emailError}</Error>}
                <InputLabel>Hasło:</InputLabel>
                <Input type='password' value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
                {passwordError && <Error>{passwordError}</Error>}
                <Button onClick={() => handleSubmit()}>Zaloguj</Button>
            </Container>
        </FlexContainer>
    );
}