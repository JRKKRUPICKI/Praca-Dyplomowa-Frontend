import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { API } from "../App";
import { useAuth } from "../auth/Auth";
import { LINKS, Navigation } from "../components/navigation";
import { Button } from "../components/button";
import { Tile } from "../components/tile";
import { Title } from "../components/typography";
import { Test } from "../models";
import { formatDatetime } from "../utils/TimeUtils";
import { Topbar } from "../components/topbar";

const Container = styled.div`
    display: grid;
    grid-template-columns: 270px auto;

    ${Tile}:not(:first-child){
        margin-top: 16px;
    }
`;

const Content = styled.div`
    margin: 20px;

    table{
        width: 100%;
        border-collapse: collapse;
        color: #7d8093;
        white-space: nowrap;

        thead tr{
            font-weight: bold;
        }

        tr{
            border: none;
        }

        tbody tr:hover{
            background: #333541;
            color: #c9c9c9;
            
            td:first-child{
                border-top-left-radius: 16px;
                border-bottom-left-radius: 16px;
            }

            td:last-child{
                border-top-right-radius: 16px;
                border-bottom-right-radius: 16px;
            }
        }

        td{
            padding: 8px;
            text-align: center;

            &:nth-child(1), &:nth-child(2){
                text-align: left;
            }
        }
    }

    & > *:nth-child(2){
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

const SpecialText = styled.span`
    color: #FFFFFF;
    font-weigth: bold;
`;

export default function LogsPage() {

    const auth = useAuth();
    const [loading, setLoading] = useState(true);

    const [testList, setTestList] = useState([]);
    const [testId, setTestId] = useState('');
    const [studentList, setStudentList] = useState([]);
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setTestList(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
            setLoading(false);
        });
    }, [auth?.user?.id])

    const loadStudents = () => {
        if (!testId) return;
        setLoading(true);
        axios.get(API + 'test/' + testId).then((res) => {
            setStudentList(res.data.students);
            setLoading(false);
        })
    }

    const [logs, setLogs] = useState([]);

    const loadLogs = () => {
        if (!testId || !studentId) return;
        setLoading(true);
        axios.get(API + 'logs/student/' + studentId).then((res) => {
            setLogs(res.data);
            setLoading(false);
        })
    }

    const chooseTest = (testId: string) => {
        setTestId(testId);
        setStudentId('');
        setStudentList([]);
        setLogs([]);
    }

    return (
        <Container>
            <Navigation activeLink={LINKS.LOGS} />
            <Content>
                <Topbar userName={auth?.user?.email ? auth?.user?.email : 'none'} />
                <Tile>
                    <Title>Wybierz test</Title>
                    <Select onChange={e => chooseTest(e.target.value)} value={testId}>
                        <option value=''>Wybierz test</option>
                        {testList.map((test: Test) => <option value={test.id} key={test.id}>{test.name}</option>)}
                    </Select>
                    <Button onClick={() => loadStudents()}>Pokaż studentów</Button>
                </Tile>
                <Tile>
                    <Title>Wybierz studenta</Title>
                    <Select onChange={e => setStudentId(e.target.value)} value={studentId}>
                        <option value=''>Wybierz studenta</option>
                        {studentList.map((student: any) => <option value={student.id} key={student.id}>{student.login}</option>)}
                    </Select>
                    <Button onClick={() => loadLogs()}>Pokaż wpisy</Button>
                </Tile>
                {loading ? <div>Loading</div> : (
                    <Tile>
                        <Title>Zapisane odpowiedzi</Title>
                        {logs.length > 0 && (
                            <table>
                                <thead>
                                    <tr>
                                        <td>Data i czas interakcji</td>
                                        <td>Interakcja</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log: any, i) => (
                                        <tr key={i}>
                                            <td>{formatDatetime(new Date(log.datetime), true, false)}</td>
                                            {log.actionType === 0 && <td>Student <SpecialText>{log.student.login}</SpecialText> wybrał odpowiedź <SpecialText>{log.answer.name}</SpecialText> w pytaniu <SpecialText>{log.question.name}</SpecialText></td>}
                                            {log.actionType === 1 && <td>Student <SpecialText>{log.student.login}</SpecialText> zaznaczył odpowiedź <SpecialText>{log.answer.name}</SpecialText> w pytaniu <SpecialText>{log.question.name}</SpecialText></td>}
                                            {log.actionType === 2 && <td>Student <SpecialText>{log.student.login}</SpecialText> odznaczył odpowiedź <SpecialText>{log.answer.name}</SpecialText> w pytaniu <SpecialText>{log.question.name}</SpecialText></td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Tile>
                )}
            </Content>
        </Container>
    )
}
