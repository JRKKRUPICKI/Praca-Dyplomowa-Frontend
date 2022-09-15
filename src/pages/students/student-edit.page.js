import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { Error, Title } from "../../ui/typography";
import { Footer } from "../../ui/footer";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

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

export default function StudentEdit(){

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get('http://54.37.232.57/api/student/' + page.studentId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [page.studentId])

    const [loginField, setLoginField] = useState(data.login);
    const [loginError, setLoginError] = useState('');
    const [passwordField, setPasswordField] = useState(data.password);
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
        else if(loginField === data.login){
            setLoginError('Nowy login jest taki sam jak poprzedni');
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
        else if(passwordField === data.password){
            setPasswordError('Nowe hasło jest takie samo jak poprzednie');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const saveStudent = () => {
        if(!validate()) return;
        setLoading(true);
        axios.patch('http://54.37.232.57/api/student/' + page.studentId, {
            login: loginField,
            password: passwordField,
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Edycja konta studenta: {data.login}</Title>
            <Item>
                <div>Login:</div>
                <Input defaultValue={data.login} onChange={(e) => setLoginField(e.target.value)}/>
                {loginError && <Error>{loginError}</Error>}
            </Item>
            <Item>
                <div>Hasło:</div>
                <Input defaultValue={data.password} onChange={(e) => setPasswordField(e.target.value)}/>
                {passwordError && <Error>{passwordError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button onClick={() => saveStudent()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
