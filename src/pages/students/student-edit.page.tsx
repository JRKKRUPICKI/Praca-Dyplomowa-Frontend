import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { API } from "../../App";
import { Student } from "../../models";

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

export default function StudentEdit() {

    const [data, setData] = useState<Student>();

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'student/' + page.studentId).then((res) => {
            setData(res.data);
            setLoginField(res.data.login);
            setPasswordField(res.data.password);
            setActiveField(res.data.active);
            setLoading(false);
        })
    }, [page.studentId])


    const [loginField, setLoginField] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [activeField, setActiveField] = useState(false);

    if (loading || !data) {
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
        setLoading(true);
        axios.patch(API + 'student/' + page.studentId, {
            login: loginField,
            password: passwordField,
            active: activeField
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return (
        <Container>
            <Title>Edycja konta studenta: {data.login}</Title>
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
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button onClick={() => saveStudent()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
