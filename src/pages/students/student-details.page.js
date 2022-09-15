import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { Title } from "../../ui/typography";
import { Footer } from "../../ui/footer";
import { Button } from "../../ui/button";

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

export default function StudentDetails(){

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get('http://54.37.232.57/api/student/' + page.studentId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [page.studentId])

    const deleteStudent = () => {
        setLoading(true);
        axios.delete('http://54.37.232.57/api/student/' + page.studentId).then((res) => {
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
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Wróc</Button>
                <Button onClick={() => page.setPage(PAGES.EDIT)}>Edytuj</Button>
                <Button className='danger' onClick={() => deleteStudent()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
