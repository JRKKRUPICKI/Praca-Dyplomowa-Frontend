import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Student } from "../../models";
import { Label } from "../../components/label";
import { formatDatetime } from "../../utils/TimeUtils";

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

export default function StudentDetails() {

    const [data, setData] = useState<Student>();

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'student/' + page.studentId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [page.studentId])

    if (loading || !data) {
        return <div>Loading</div>;
    }

    const deleteStudent = () => {
        setLoading(true);
        axios.delete(API + 'student/' + page.studentId).then((res) => {
            page.setStudentId()
            page.setPage(PAGES.LIST);
        })
    }

    return (
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
            <Item>
                <div>Status:</div>
                <div>{data.active ? <Label active>aktywne</Label> : <Label inactive>nieaktywne</Label>}</div>
            </Item>
            <Item>
                <div>Odpowiedzi:</div>
                <div>{data.status === 0 ? <Label inactive>nieprzesłane</Label> : <Label active>przesłane ({formatDatetime(data.status)})</Label>}</div>
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Wróc</Button>
                <Button onClick={() => page.setPage(PAGES.EDIT)}>Edytuj</Button>
                <Button className='danger' onClick={() => deleteStudent()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
