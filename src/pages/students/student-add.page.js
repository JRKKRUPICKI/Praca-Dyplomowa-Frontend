import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: center;

    &:not(:first-child){
        margin-top: 10px;
    }
`;

const Input = styled.input`
    background: #1e1f24;
    border: 1px solid #7d8093;
    border-radius: 10px;
    padding: 14px;
    font-size: 14px;
    color: #FFFFFF;
    height: 40px;

    &:focus{
        outline: none;
    }
`;

export default function StudentAdd(){

    const [loading, setLoading] = useState(false);

    const page = usePage();

    const [loginField, setLoginField] = useState();
    const [loginError, setLoginError] = useState('');
    const [passwordField, setPasswordField] = useState();
    const [passwordError, setPasswordError] = useState('');

    const validate = () => {
        let valid = true;
        if(!loginField){
            setLoginError('Nieprawidłowy login');
            valid = false;
        }
        else if(loginField !== loginField.trim()){
            setLoginError('Nieprawidłowy login');
            valid = false;
        }
        else if(!loginField.match(/^[0-9a-zA-Z]+$/)){
            setLoginError('Nieprawidłowy login');
            return true;
        }
        else setLoginError('');
        if(!passwordField){
            setPasswordError('Nieprawidłowe hasło');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const saveStudent = () => {
        if(!validate()) return;
        setLoading(true);
        axios.post(API + 'student', {
            login: loginField,
            password: passwordField,
            testId: parseInt(page.testId)
        }).then((res) => {
            page.setPage(PAGES.LIST);
        }).catch((err) => {
            alert(err.response.data.message)
        }).finally(
            setLoading(false)
        )
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Tworzenie nowego konta studenta</Title>
            <Item>
                <div>Login:</div>
                <Input onChange={(e) => setLoginField(e.target.value)}/>
                {loginError && <Error>{loginError}</Error>}
            </Item>
            <Item>
                <div>Hasło:</div>
                <Input onChange={(e) => setPasswordField(e.target.value)}/>
                {passwordError && <Error>{passwordError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Anuluj</Button>
                <Button onClick={() => saveStudent()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
