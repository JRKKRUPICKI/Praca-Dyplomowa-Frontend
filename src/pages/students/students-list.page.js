import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { PAGES, usePage } from "../../providers/students.provider";
import { formatDatetime } from "../../utils/TimeUtils";
import { Description, Title } from "../../ui/typography";

const Tile = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;

    &:not(:first-child){
        margin-top: 16px;
    }
`;

const Button = styled.button`
    padding: 10px;
    border-radius: 8px;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    background: #000000;

    &.details{
        background: #307AF3;
    }

    &.delete{
        background: #EF233C;
    }

    &.show{
        margin-left: 16px;
        background: #307AF3;
    }

    &.add{
        background: #29bc88;
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

    &:focus{
        outline: none;
    }
`;

export default function StudentsList(){
    const auth = useAuth();

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/test').then((res) => {
            setData(res.data.filter(t => t.teacher.id === auth.user.id));
            setLoading(false);
        });
        if(page.testId) loadStudents();
    }, [])

    const page = usePage();

    const getStudent = (student) => {
        return(
            <tr key={student.id}>
                <td>{student.login}</td>
                <td>{student.password}</td>
                <td>{student.active ? 'aktywne' : 'nieaktywne'}</td>
                <td>{student.status === 0 ? 'nieprzesłane' : 'przesłane (' + formatDatetime(student.status) + ')'}</td>
                <td>
                    <Button className="details" onClick={() => {page.setStudentId(student.id); page.setPage(PAGES.DETAILS)}}>Otwórz</Button>
                    <Button className="details" onClick={() => {page.setStudentId(student.id); page.setPage(PAGES.EDIT)}}>Edytuj</Button>
                    <Button className="delete" onClick={() => removeStudent(student.id)}>Usuń</Button>
                </td>
            </tr>
        )
    }

    const removeStudent = (studentId) => {
        setLoading(true);
        axios.delete('http://localhost:4000/student/' + studentId).then((res) => {
            loadStudents()
        })
    }

    const [students, setStudents] = useState();

    const loadStudents = () => {
        setLoading(true);
        axios.get('http://localhost:4000/test/' + page.testId).then((res) => {
            setStudents(res.data.students);
            setLoading(false);
        })
    }

    return (
        <div>
            <Tile>
                <Title>Wybierz test</Title>
                <Select onChange={e => page.setTestId(e.target.value)} value={page.testId}>
                    <option value='0'>Wybierz test</option>
                    {data.map(test => <option value={test.id} key={test.id}>{test.name}</option>)}
                </Select>
                <Button onClick={() => loadStudents()} className='show'>Pokaż studentów</Button>
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
                        <Button className='add' onClick={() => page.setPage(PAGES.ADD)}>Dodaj konto studenta</Button>
                    </Tile>
                )
            )}
        </div>
    )
}
