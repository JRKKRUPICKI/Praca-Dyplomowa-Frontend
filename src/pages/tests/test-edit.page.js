import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/tests.provider";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
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

export default function TestEdit(){

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'test/' + page.testId).then((res) => {
            setNameField(res.data.name);
            setTimeField(res.data.time);
            setLoginTimeStartField(new Date(new Date(res.data.loginTimeStart) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1));
            setLoginTimeEndField(new Date(new Date(res.data.loginTimeEnd) - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -1));
            setLoading(false);
        })
    }, [page.testId])

    const [nameField, setNameField] = useState();
    const [nameError, setNameError] = useState();

    const [timeField, setTimeField] = useState();
    const [timeError, setTimeError] = useState();

    const [loginTimeStartField, setLoginTimeStartField] = useState();
    const [loginTimeStartError, setLoginTimeStartError] = useState();

    const [loginTimeEndField, setLoginTimeEndField] = useState();
    const [loginTimeEndError, setLoginTimeEndError] = useState();

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
        // if(Date.parse(loginTimeStartField) <= Date.now()){
        //     setLoginTimeStartError('Wybierz późniejszą datę');
        //     valid = false;
        // }
        // else setLoginTimeStartError('');
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
        axios.patch(API + 'test/' + page.testId, {
            name: nameField,
            time: timeField,
            loginTimeStart: Date.parse(loginTimeStartField),
            loginTimeEnd: Date.parse(loginTimeEndField)
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Edytowanie testu</Title>
            <Item>
                <div>Nazwa testu:</div>
                <Input defaultValue={nameField} onChange={(e) => setNameField(e.target.value)}/>
                {nameError && <Error>{nameError}</Error>}
            </Item>
            <Item>
                <div>Czas trwania testu w minutach:</div>
                <Input defaultValue={timeField} onChange={(e) => setTimeField(parseInt(e.target.value))}/>
                {timeError && <Error>{timeError}</Error>}
            </Item>
            <Item>
                <div>Czas od kiedy można się zalogować do testu:</div>
                <Input defaultValue={loginTimeStartField} type='datetime-local' onChange={(e) => setLoginTimeStartField(e.target.value)}/>
                {loginTimeStartError && <Error>{loginTimeStartError}</Error>}
            </Item>
            <Item>
                <div>Czas do kiedy można się zalogować do testu:</div>
                <Input defaultValue={loginTimeEndField} type='datetime-local' onChange={(e) => setLoginTimeEndField(e.target.value)}/>
                {loginTimeEndError && <Error>{loginTimeEndError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button onClick={() => saveTest()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
