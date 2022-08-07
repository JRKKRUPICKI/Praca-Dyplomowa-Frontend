import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/Auth";

const FlexContainer = styled.div`
    display: flex;
    height: 100vh;
    align-items: center;
`;

const Container = styled.div`
    background: #1e1f24;
    border-radius: 10px;
    padding: 50px;
    width: fit-content;
    height: fit-content;
    margin: 0 auto 0 auto;
    color: #7d8093;
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
`;

const Label = styled.div`
    font-size: 18px;
    margin: 14px 0 8px 0;
`;

const Input = styled.input`
    width: 500px;
    display: block;
    font-size: 20px;
    padding: 14px;
    background: #F2F2F2;
    border-radius: 10px;
    border: none;
    background: #7d8093;
    &:active{
        border: none;
    }
`;

const Button = styled.button`
    background: #1363DF;
    width: 500px;
    border-radius: 10px;
    margin-top: 20px;
    padding: 14px;
    border: none;
    color: #FFFFFF;
    font-size: 20px;
    cursor: pointer;
`;

const Error = styled.div`
    color: #FF0000;
    margin-top: 10px;
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
                <Label>Adres e-mail:</Label>
                <Input type='text' value={emailField} onChange={(e) => setEmailField(e.target.value)}/>
                {emailError && <Error>{emailError}</Error>}
                <Label>Hasło:</Label>
                <Input type='password' value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
                {passwordError && <Error>{passwordError}</Error>}
                <Button type='button' onClick={() => handleSubmit()}>Zaloguj</Button>
            </Container>
        </FlexContainer>
    );
}
