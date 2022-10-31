import styled from "styled-components";
import { useAuth } from "../auth/Auth";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Number, Title } from "../components/typography";
import { API } from "../App";
import { LINKS, Navigation } from "../components/navigation";
import { Test } from "../models";
import Chart from "../components/chart";
import { Topbar } from "../components/topbar";
import { Tile } from "../components/tile";
import { Select } from "../components/select";

const Container = styled.div`
    display: grid;
    grid-template-columns: 270px auto;
`;

const Content = styled.div`
    margin: 20px;

    & > *:nth-child(2){
        margin-top: 16px;
    }
`;

const Tiles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
    text-align: center;

    & > ${Tile}{
        background: #1E1F24;
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        display: inline-block;
    
        & > :nth-child(3){
            margin: auto;
        }
    }
`;

export default function Statistics() {

    const auth = useAuth();
    const [data, setData] = useState({
        questions: 0,
        answers: 0,
        students: 0,
        logs: 0,
        startedStudents: 0,
        endedStudents: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState<Test[]>([]);
    const [testId, setTestId] = useState('');

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setTests(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
            setIsLoading(false);
        });
    }, [auth?.user?.id]);

    const loadStatistics = (testId: string) => {
        if (!testId || testId === '0') return;
        setIsLoading(true);
        axios.get(API + 'statistics/' + testId).then((res) => {
            setData(res.data);
            setIsLoading(false);
        });
    }

    const chooseTest = (testId: string) => {
        setTestId(testId);
        setData({
            questions: 0,
            answers: 0,
            students: 0,
            logs: 0,
            startedStudents: 0,
            endedStudents: 0
        });
        loadStatistics(testId);
    }

    return (
        <Container>
            <Navigation activeLink={LINKS.STATISTICS} />
            <Content>
                <Topbar userName={auth?.user?.email ? auth?.user?.email : 'none'} />
                <Tile>
                    <Title>Wybierz test</Title>
                    <Select onChange={e => chooseTest(e.target.value)} value={testId}>
                        <option value='0'>Wybierz test</option>
                        {tests.map(test => <option value={test.id} key={test.id}>{test.name}</option>)}
                    </Select>
                </Tile>
                {isLoading ? (<></>) : (
                    testId !== '0' ? (
                        <Tiles>
                            <Tile>
                                <Title>Pytań w teście</Title>
                                <Number>{data.questions}</Number>
                            </Tile>
                            <Tile>
                                <Title>Odpowiedzi w pytaniach</Title>
                                <Number>{data.answers}</Number>
                            </Tile>
                            <Tile>
                                <Title>Studenci w teście</Title>
                                <Number>{data.students}</Number>
                            </Tile>
                            <Tile>
                                <Title>Wpisy w dzienniku interakcji</Title>
                                <Number>{data.logs}</Number>
                            </Tile>
                            <Tile>
                                <Title>Studenci z rozpoczętym testem</Title>
                                <Number>{data.startedStudents}</Number>
                            </Tile>
                            <Tile>
                                <Title>Studenci z zakończonym testem</Title>
                                <Number>{data.endedStudents}</Number>
                            </Tile>
                            <Tile>
                                <Title>Studentów z przesłanymi testami</Title>
                                <Number>{Math.round(data.endedStudents === 0 ? 0 : data.endedStudents / data.students * 100)}%</Number>
                                <Chart data={[data.endedStudents, data.endedStudents === 0 ? 1 : data.students - data.endedStudents]} size={100} />
                            </Tile>
                        </Tiles>
                    ) : (<></>)
                )}
            </Content>
        </Container>
    )
}
