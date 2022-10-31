import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Student } from "../../models";
import { PAGES, usePage } from "./students.provider";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

export default function StudentDelete() {

    const [data, setData] = useState<Student>();
    const [isLoading, setIsLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'student/' + page.studentId).then((res) => {
            setData(res.data);
            setIsLoading(false);
        })
    }, [page.studentId]);

    const deleteStudent = () => {
        setIsLoading(true);
        axios.delete(API + 'student/' + page.studentId).then((res) => {
            page.setStudentId()
            page.setPage(PAGES.LIST);
        })
    }

    if (isLoading || !data) {
        return <div>Loading</div>;
    }

    return (
        <Container>
            <Title>Czy na pewno chcesz usunąć studenta {data.login}?</Title>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button className='danger' onClick={() => deleteStudent()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
