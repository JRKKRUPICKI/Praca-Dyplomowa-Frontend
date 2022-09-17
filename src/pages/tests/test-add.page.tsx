import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/tests.provider";
import { useAuth } from "../../auth/Auth";
import { formatDatetime } from "../../utils/TimeUtils";
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

export default function TestAdd(){

    const auth = useAuth();

    const [loading, setLoading] = useState(false);

    const page = usePage();

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState('');

    const [timeField, setTimeField] = useState(0);
    const [timeError, setTimeError] = useState('');

    const [loginTimeStartField, setLoginTimeStartField] = useState(formatDatetime(Date.now()));
    const [loginTimeStartError, setLoginTimeStartError] = useState('');

    const [loginTimeEndField, setLoginTimeEndField] = useState(formatDatetime(Date.now()));
    const [loginTimeEndError, setLoginTimeEndError] = useState('');

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
        else setNameError('');
        if(timeField <= 0){
            setTimeError('Za krótki czas trwania testu');
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

    const saveTest = () => {
        if(!validate()) return;
        setLoading(true);
        axios.post(API + 'test', {
            name: nameField,
            teacherId: auth?.user?.id,
            time: timeField,
            loginTimeStart: Date.parse(loginTimeStartField),
            loginTimeEnd: Date.parse(loginTimeEndField)
        }).then((res) => {
            page.setPage(PAGES.LIST);
        }).catch((err) => {
            alert(err.response.data.message)
        }).finally(() => setLoading(false))
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Tworzenie nowego testu</Title>
            <Item>
                <div>Nazwa testu:</div>
                <Input onChange={(e) => setNameField(e.target.value)}/>
                {nameError && <Error>{nameError}</Error>}
            </Item>
            <Item>
                <div>Czas trwania testu w minutach:</div>
                <Input onChange={(e) => setTimeField(parseInt(e.target.value))}/>
                {timeError && <Error>{timeError}</Error>}
            </Item>
            <Item>
                <div>Czas od kiedy można się zalogować do testu:</div>
                <Input type='datetime-local' onChange={(e) => setLoginTimeStartField(e.target.value)}/>
                {loginTimeStartError && <Error>{loginTimeStartError}</Error>}
            </Item>
            <Item>
                <div>Czas do kiedy można się zalogować do testu:</div>
                <Input type='datetime-local' onChange={(e) => setLoginTimeEndField(e.target.value)}/>
                {loginTimeEndError && <Error>{loginTimeEndError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Anuluj</Button>
                <Button onClick={() => saveTest()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
