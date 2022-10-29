import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Student } from "../../models";
import { Label } from "../../components/label";
import { formatDatetime } from "../../utils/TimeUtils";
import { PAGES, usePage } from "./students.provider";

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
    const [isLoading, setIsLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'student/' + page.studentId).then((res) => {
            setData(res.data);
            setIsLoading(false);
        })
    }, [page.studentId])

    if (isLoading || !data) {
        return <div>Loading</div>;
    }

    return (
        <Container>
            <Title>Informacje o studencie</Title>
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
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Wróć</Button>
                <Button onClick={() => page.setPage(PAGES.EDIT)}>Edytuj</Button>
                <Button className='danger' onClick={() => { page.setStudentId(page.studentId); page.setPage(PAGES.DELETE) }}>Usuń</Button>
            </Footer>
        </Container>
    )
}
