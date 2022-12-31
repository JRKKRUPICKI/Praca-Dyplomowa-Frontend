import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { formatDatetime } from "../../utils/TimeUtils";
import { Description, Title } from "../../components/typography";
import { Tile } from "../../components/tile";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Label } from "../../components/label";
import { PAGES, usePage } from "./students.provider";
import { Select } from "../../components/select";
import PasswordVisible from "../../components/password-visible";

const Container = styled.div`
    ${Tile}:not(:first-child){
        margin-top: 16px;
    }
`;

export default function StudentsList() {

    const auth = useAuth();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const page = usePage();

    useEffect(() => {
        axios.get(API + 'test/teacher/' + auth?.user?.id).then((res) => {
            setData(res.data);
            setIsLoading(false);
        });
        loadStudents(page.testId);
    }, [auth?.user?.id]);


    const getStudent = (student: any) => {
        return (
            <tr key={student.id}>
                <td>{student.login}</td>
                <td><PasswordVisible>{student.password}</PasswordVisible></td>
                <td>{student.active ? <Label active>aktywne</Label> : <Label inactive>nieaktywne</Label>}</td>
                <td>{student.status === 0 ? <Label inactive>nieprzesłane</Label> : <Label active>przesłane ({formatDatetime(student.status)})</Label>}</td>
                <td>
                    <Button onClick={() => { page.setStudentId(student.id); page.setPage(PAGES.DETAILS) }}>Szczegóły</Button>
                    <Button onClick={() => { page.setStudentId(student.id); page.setPage(PAGES.EDIT) }}>Edytuj</Button>
                    <Button className='danger' onClick={() => { page.setStudentId(student.id); page.setPage(PAGES.DELETE) }}>Usuń</Button>
                </td>
            </tr>
        )
    }

    const [students, setStudents] = useState([]);

    const loadStudents = (testId: string) => {
        if (!testId || testId === '0') return;
        setIsLoading(true);
        axios.get(API + 'test/' + testId).then((res) => {
            setStudents(res.data.students);
            setIsLoading(false);
        });
    }

    const chooseTest = (testId: string) => {
        page.setTestId(testId);
        setStudents([]);
        loadStudents(testId);
    }

    return (
        <Container>
            <Tile>
                <Title>Wybierz test</Title>
                <Select onChange={e => chooseTest(e.target.value)} value={page.testId} disabled={isLoading}>
                    <option value='0'>Wybierz test</option>
                    {data.map((test: any) => <option value={test.id} key={test.id}>{test.name}</option>)}
                </Select>
            </Tile>
            <Tile>
                <Title>Lista studentów</Title>
                {!page.testId || page.testId === '0' ? (
                    <Description>Wybierz test, aby wyświetlić studentów</Description>
                ) : (
                    <>
                        {students.length === 0 ? (
                            <Description>Żaden student nie jest przypisany do testu</Description>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <td>Login</td>
                                        <td>Hasło</td>
                                        <td>Konto</td>
                                        <td>Odpowiedzi</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => getStudent(student))}
                                </tbody>
                            </table>
                        )}
                        <Footer>
                            <Button className='success' onClick={() => page.setPage(PAGES.ADD)}>Dodaj studenta</Button>
                        </Footer>
                    </>
                )}
            </Tile>
        </Container>
    )
}
