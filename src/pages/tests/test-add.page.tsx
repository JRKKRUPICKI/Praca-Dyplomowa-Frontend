import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../../auth/Auth";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { PAGES, usePage } from "./tests.provider";

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

export default function TestAdd() {

    const auth = useAuth();

    const [loading, setLoading] = useState(false);

    const page = usePage();

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState('');

    const [timeField, setTimeField] = useState(0);
    const [timeError, setTimeError] = useState('');

    const [loginTimeStartField, setLoginTimeStartField] = useState('');
    const [loginTimeStartError, setLoginTimeStartError] = useState('');

    const [loginTimeEndField, setLoginTimeEndField] = useState('');
    const [loginTimeEndError, setLoginTimeEndError] = useState('');

    const [error, setError] = useState('');

    const validate = () => {
        let valid = true;
        if (!nameField) {
            setNameError('Podaj nazwe testu');
            valid = false;
        }
        else if (nameField !== nameField.trim()) {
            setNameError('Nieprawidłowa nazwa testu');
            valid = false;
        }
        else setNameError('');
        if (isNaN(timeField)) {
            setTimeError('Podaj czas trwania testu');
            valid = false;
        }
        else if (timeField <= 0) {
            setTimeError('Podaj prawidłowy czas trwania testu');
            valid = false;
        }
        else setTimeError('');
        if (!loginTimeStartField) {
            setLoginTimeStartError('Podaj date z czasem');
            valid = false;
        }
        // else if (Date.parse(loginTimeStartField) <= Date.now()) {
        //     setLoginTimeStartError('Podaj późniejszą date z czasem');
        //     valid = false;
        // }
        else setLoginTimeStartError('');
        if (!loginTimeEndField) {
            setLoginTimeEndError('Podaj date z czasem');
            valid = false;
        }
        else if (Date.parse(loginTimeEndField) <= Date.parse(loginTimeStartField)) {
            setLoginTimeEndError('Podaj późniejszą date z czasem');
            valid = false;
        }
        else setLoginTimeEndError('');
        return valid;
    }

    const saveTest = () => {
        if (!validate()) return;
        setLoading(true);
        axios.post(API + 'test', {
            name: nameField,
            teacherId: auth?.user?.id,
            time: timeField,
            loginTimeStart: Date.parse(loginTimeStartField),
            loginTimeEnd: Date.parse(loginTimeEndField)
        }).then((res) => {
            page.setPage(PAGES.LIST);
            setError('');
        }).catch((err) => {
            if (err.response.data.message === 'Test already exists') setError('Test o podanej nazwie już istnieje');
            else setError('Nie można stworzyć nowego testu');
        }).finally(() => setLoading(false))
    }

    return (
        <Container>
            <Title>Tworzenie nowego testu</Title>
            <Item>
                <div>Nazwa testu:</div>
                <Input onChange={(e) => setNameField(e.target.value)} />
                {nameError && <Error>{nameError}</Error>}
            </Item>
            <Item>
                <div>Czas trwania testu w minutach:</div>
                <Input onChange={(e) => setTimeField(parseInt(e.target.value))} />
                {timeError && <Error>{timeError}</Error>}
            </Item>
            <Item>
                <div>Czas od kiedy można się zalogować do testu:</div>
                <Input type='datetime-local' onChange={(e) => setLoginTimeStartField(e.target.value)} />
                {loginTimeStartError && <Error>{loginTimeStartError}</Error>}
            </Item>
            <Item>
                <div>Czas do kiedy można się zalogować do testu:</div>
                <Input type='datetime-local' onChange={(e) => setLoginTimeEndField(e.target.value)} />
                {loginTimeEndError && <Error>{loginTimeEndError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Anuluj</Button>
                {loading ? <Button>Zapisz</Button> : <Button onClick={() => saveTest()}>Zapisz</Button>}
                {error && <Error>{error}</Error>}
            </Footer>
        </Container>
    )
}
