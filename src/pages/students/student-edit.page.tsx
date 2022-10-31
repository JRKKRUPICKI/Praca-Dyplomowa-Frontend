import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { API } from "../../App";
import { Student } from "../../models";
import { PAGES, usePage } from "./students.provider";

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

    & > ${Error}{
        text-align: center;
        margin-top: 8px;
    }
`;

export default function StudentEdit() {

    const [data, setData] = useState<Student>();
    const [isLoading, setIsLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'student/' + page.studentId).then((res) => {
            setData(res.data);
            setLoginField(res.data.login);
            setPasswordField(res.data.password);
            setActiveField(res.data.active);
            setIsLoading(false);
        })
    }, [page.studentId]);


    const [loginField, setLoginField] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [activeField, setActiveField] = useState(false);

    const [error, setError] = useState('');

    if (isLoading || !data) {
        return <div>Loading</div>;
    }

    const validate = () => {
        let valid = true;
        if (!loginField) {
            setLoginError('Nieprawidłowy login');
            valid = false;
        }
        else if (!loginField.match(/^[a-zA-Z0-9_]+$/)) {
            setLoginError('Nieprawidłowy login');
            valid = false;
        }
        else setLoginError('');
        if (!passwordField) {
            setPasswordError('Nieprawidłowe hasło');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const saveStudent = () => {
        if (!validate()) return;
        setSaveLoading(true);
        axios.patch(API + 'student/' + page.studentId, {
            login: loginField,
            password: passwordField,
            active: activeField
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            if (err.response.data.message === 'Student already exists') setError('Student o podanym loginie już istnieje');
            else setError('Nie można dodać studenta');
        }).finally(() => setSaveLoading(false));
    }

    return isLoading ? <div>Loading</div> : (
        <Container>
            <Title>Edycja studenta: {data.login}</Title>
            <Item>
                <div>Login:</div>
                <Input defaultValue={data.login} onChange={(e) => setLoginField(e.target.value)} />
                {loginError && <Error>{loginError}</Error>}
            </Item>
            <Item>
                <div>Hasło:</div>
                <Input defaultValue={data.password} onChange={(e) => setPasswordField(e.target.value)} />
                {passwordError && <Error>{passwordError}</Error>}
            </Item>
            <Item>
                <div>Status</div>
                <Input type='checkbox' onChange={(e) => setActiveField(e.target.checked)} defaultChecked={activeField} />
                <div></div>{!data.active && activeField && <Error>Przesłane odpowiedzi oraz wpisy z dziennika interakcji zostaną usunięte po zapisaniu!</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                {saveLoading ? <Button>Zapisz</Button> : <Button onClick={() => saveStudent()}>Zapisz</Button>}
                {error && <Error>{error}</Error>}
            </Footer>
        </Container>
    )
}
