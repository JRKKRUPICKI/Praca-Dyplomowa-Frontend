import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { API } from "../App";
import { useAuth } from "../auth/Auth";
import { LINKS, Navigation } from "../components/navigation";
import Answer from "../components/answer";
import { Tile } from "../components/tile";
import { Description, Title } from "../components/typography";
import { Test } from "../models";
import { Topbar } from "../components/topbar";
import { Label } from "../components/label";
import { Select } from "../components/select";

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

            &:nth-child(1){
                text-align: left;
                width: 100%;
            }

            &:nth-child(2), &:nth-child(3){
                width: fit-content;
            }
        }
    }

    & > *:nth-child(2){
        margin-top: 16px;
    }
`;

export default function Results() {

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
    }, [auth?.user?.id]);

    const loadStudents = (testId: string) => {
        if (!testId || testId === '0') return;
        setLoading(true);
        axios.get(API + 'test/' + testId).then((res) => {
            setStudentList(res.data.students);
            setLoading(false);
        })
    }

    const [results, setResults] = useState([]);

    const [isTestResultsLoading, setIsTestResultsLoading] = useState(false);
    const [testResults, setTestResults] = useState([]);

    const loadResults = (studentId: string) => {
        if (!studentId || studentId === '0') return;
        setLoading(true);
        axios.get(API + 'results/student/' + studentId).then((res) => {
            setResults(res.data);
            setLoading(false);
        });
    }

    const loadTestResults = (testId: string) => {
        if (!testId || testId === '0') return;
        setIsTestResultsLoading(true);
        axios.get(API + 'results/test/' + testId).then((res) => {
            setTestResults(res.data);
            setIsTestResultsLoading(false);
        });
    }

    const chooseTest = (testId: string) => {
        setTestId(testId);
        setStudentId('0');
        setStudentList([]);
        setResults([]);
        setTestResults([]);
        loadTestResults(testId);
        loadStudents(testId);
    }

    const chooseStudent = (studentId: string) => {
        setStudentId(studentId);
        setResults([]);
        loadResults(studentId);
    }

    return (
        <Container>
            <Navigation activeLink={LINKS.RESULTS} />
            <Content>
                <Topbar userName={auth?.user?.email ? auth?.user?.email : 'none'} />
                <Tile>
                    <Title>Wybierz test</Title>
                    <Select onChange={e => chooseTest(e.target.value)} value={testId}>
                        <option value='0'>Wybierz test</option>
                        {testList.map((test: Test) => <option value={test.id} key={test.id}>{test.name}</option>)}
                    </Select>
                </Tile>
                <Tile>
                    <Title>Wybierz studenta</Title>
                    <Select onChange={e => chooseStudent(e.target.value)} value={studentId}>
                        <option value='0'>Wybierz studenta</option>
                        {studentList.map((student: any) => <option value={student.id} key={student.id}>{student.login}</option>)}
                    </Select>
                </Tile>
                <Tile>
                    <Title>Wyniki dla wszystkich studentów</Title>
                    {isTestResultsLoading ? (
                        <Description>Trwa ładowanie danych</Description>
                    ) : (
                        testResults.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <td>Student</td>
                                        <td>Odpowiedzi</td>
                                        <td>Odpowiedzi poprawnych</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testResults.map((item: any, i) =>
                                        <tr key={i}>
                                            <td>{item.student}</td>
                                            <td>{item.correctQuestions + '/' + (item.notCorrectQuestions + item.correctQuestions)}</td>
                                            <td>{Math.round(item.correctQuestions / (item.notCorrectQuestions + item.correctQuestions) * 100) >= 50 ? (
                                                <Label active>{Math.round(item.correctQuestions / (item.notCorrectQuestions + item.correctQuestions) * 100)}%</Label>
                                            ) : (
                                                <Label inactive>{item.correctQuestions === 0 ? 0 : Math.round(item.correctQuestions / (item.notCorrectQuestions + item.correctQuestions) * 100)}%</Label>
                                            )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <Description>Brak danych</Description>
                        )
                    )}
                </Tile>
                <Tile>
                    <Title>Przesłane odpowiedzi</Title>
                    {loading ? (
                        <Description>Trwa ładowanie danych</Description>
                    ) : (
                        results.length > 0 ? (
                            results.map((result: any, i) => (
                                <div key={i} className='questionBox'>
                                    <div className='question'>{result.question.name}</div>
                                    {result.answers.map((answer: any, i: number) => (
                                        <Answer key={i} multiCheck={result.question.type} type={answer.checked === answer.correct ? 'correct' : 'incorrect'} checked={answer.checked}>{answer.name}</Answer>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <Description>Brak danych</Description>
                        )
                    )}
                </Tile>
            </Content>
        </Container>
    )
}
