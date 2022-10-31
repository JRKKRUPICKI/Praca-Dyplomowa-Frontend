import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { PAGES, usePage } from "./students.provider";
import { Input } from "../../components/input";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;

    ${Footer} > ${Error}{
        text-align: center;
        margin-top: 8px;
    }
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: center;

    &:not(:first-child){
        margin-top: 10px;
    }
`;

export default function StudentAdd() {

    const [isLoading, setIsLoading] = useState(false);

    const page = usePage();

    const [loginField, setLoginField] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [error, setError] = useState('');

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

    const saveStudent = () => {
        if (!validate()) return;
        setIsLoading(true);
        axios.post(API + 'student', {
            login: loginField,
            password: passwordField,
            testId: parseInt(page.testId)
        }).then((res) => {
            page.setPage(PAGES.LIST);
        }).catch((err) => {
            if (err.response.data.message === 'Student already exists') setError('Student o podanym loginie już istnieje');
            else setError('Nie można dodać studenta');
        }).finally(() => setIsLoading(false));
    }

    return (
        <Container>
            <Title>Tworzenie nowego konta studenta</Title>
            <Item>
                <div>Login:</div>
                <Input onChange={(e) => setLoginField(e.target.value)} />
                {loginError && <Error>{loginError}</Error>}
            </Item>
            <Item>
                <div>Hasło:</div>
                <Input onChange={(e) => setPasswordField(e.target.value)} />
                {passwordError && <Error>{passwordError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Anuluj</Button>
                {isLoading ? <Button>Zapisz</Button> : <Button onClick={() => saveStudent()}>Zapisz</Button>}
                {error && <Error>{error}</Error>}
            </Footer>
        </Container>
    )
}
