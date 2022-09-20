import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { formatDatetime } from "../../utils/TimeUtils";
import { Description, Title } from "../../components/typography";
import { Tile } from "../../components/tile";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Label } from "../../components/label";

const Container = styled.div`
    ${Tile}:not(:first-child){
        margin-top: 16px;
    }
`;

const Select = styled.select`
    background: #1e1f24;
    border: 1px solid #7d8093;
    border-radius: 10px;
    padding: 8px;
    font-size: 14px;
    color: #FFFFFF;
    width: 400px;
    cursor: pointer;
    margin-right: 16px;

    &:focus{
        outline: none;
    }
`;

export default function StudentsList() {
    const auth = useAuth();

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setData(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
            setLoading(false);
        });
        if (page.testId) loadStudents();
    }, [auth?.user?.id])

    const page = usePage();

    const getStudent = (student: any) => {
        return (
            <tr key={student.id}>
                <td>{student.login}</td>
                <td>{student.password}</td>
                <td>{student.active ? <Label active>aktywne</Label> : <Label inactive>nieaktywne</Label>}</td>
                <td>{student.status === 0 ? <Label inactive>nieprzesłane</Label> : <Label active>przesłane ({formatDatetime(student.status)})</Label>}</td>
                <td>
                    <Button onClick={() => { page.setStudentId(student.id); page.setPage(PAGES.DETAILS) }}>Otwórz</Button>
                    <Button onClick={() => { page.setStudentId(student.id); page.setPage(PAGES.EDIT) }}>Edytuj</Button>
                    <Button className="danger" onClick={() => removeStudent(student.id)}>Usuń</Button>
                </td>
            </tr>
        )
    }

    const removeStudent = (studentId: any) => {
        setLoading(true);
        axios.delete(API + 'student/' + studentId).then((res) => {
            loadStudents()
        })
    }

    const [students, setStudents] = useState([]);

    const loadStudents = () => {
        setLoading(true);
        axios.get(API + 'test/' + page.testId).then((res) => {
            setStudents(res.data.students);
            setLoading(false);
        })
    }

    return (
        <Container>
            <Tile>
                <Title>Wybierz test</Title>
                <Select onChange={e => page.setTestId(e.target.value)} value={page.testId}>
                    <option value='0'>Wybierz test</option>
                    {data.map((test: any) => <option value={test.id} key={test.id}>{test.name}</option>)}
                </Select>
                <Button onClick={() => loadStudents()}>Pokaż studentów</Button>
            </Tile>
            {students && (
                loading ? <div>Loading</div> : (
                    <Tile>
                        <Title>Lista studentów</Title>
                        {students.length === 0 ? <Description>Żaden student nie jest przypisany do testu</Description> : (
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
                            <Button className='success' onClick={() => page.setPage(PAGES.ADD)}>Dodaj konto studenta</Button>
                        </Footer>
                    </Tile>
                )
            )}
        </Container>
    )
}
