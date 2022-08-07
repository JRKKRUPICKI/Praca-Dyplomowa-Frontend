import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;

    &:not(:first-child){
        margin-top: 10px;
    }
`;

const Footer = styled.div`
    margin-top: 16px;
`;

const Button = styled.button`
    padding: 10px;
    border-radius: 8px;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    background: #000000;

    &.edit{
        background: #307AF3;
    }

    &.delete{
        background: #EF233C;
    }

    &.back{
        background: #8a817c;
    }

    &:not(:first-child){
        margin-left: 8px;
    }
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 16px;
    color: #FFFFFF;
`;

export default function StudentDetails(){

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get('http://localhost:4000/student/' + page.studentId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [])

    const deleteStudent = () => {
        setLoading(true);
        axios.delete('http://localhost:4000/student/' + page.studentId).then((res) => {
            page.setStudentId()
            page.setPage(PAGES.LIST);
        })
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Informacje o koncie studenta</Title>
            <Item>
                <div>Login:</div>
                <div>{data.login}</div>
            </Item>
            <Item>
                <div>Hasło:</div>
                <div>{data.password}</div>
            </Item>
            <Footer>
                <Button className='back' onClick={() => page.setPage(PAGES.LIST)}>Wróc</Button>
                <Button className='edit' onClick={() => page.setPage(PAGES.EDIT)}>Edytuj</Button>
                <Button className='delete' onClick={() => deleteStudent()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
