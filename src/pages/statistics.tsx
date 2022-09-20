import styled from "styled-components";
import { useAuth } from "../auth/Auth";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Number, Title } from "../components/typography";
import { API } from "../App";
import { Button } from "../components/button";
import { LINKS, Navigation } from "../components/navigation";
import { Test } from "../models";
import Chart from "../components/chart";
import { Topbar } from "../components/topbar";
import { Tile } from "../components/tile";

const Container = styled.div`
    display: grid;
    grid-template-columns: 270px auto;
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
            padding: 8px 16px;
            text-align: center;

            &:nth-child(1){
                text-align: left;
            }

            & > *:not(:first-child){
                margin-left: 8px;
            }
        }
    }

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

    const [loading, setLoading] = useState(true);

    const [tests, setTests] = useState<Test[]>([]);

    const [test, setTest] = useState('');

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setTests(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
            setLoading(false);
        });
    }, [auth?.user?.id])

    const loadStatistics = () => {
        if (!test) return;
        setLoading(true);
        axios.get(API + 'statistics/' + test).then((res) => {
            setData(res.data);
            setLoading(false);
        });
    }

    return (
        <Container>
            <Navigation activeLink={LINKS.STATISTICS} />
            <Content>
                <Topbar userName={auth?.user?.email ? auth?.user?.email : 'none'} />
                <Tile>
                    <Title>Wybierz test</Title>
                    <Select onChange={e => setTest(e.target.value)} value={test}>
                        <option value='0'>Wybierz test</option>
                        {tests.map(test => <option value={test.id} key={test.id}>{test.name}</option>)}
                    </Select>
                    <Button onClick={() => loadStatistics()}>Pokaż statystyki</Button>
                </Tile>
                {data && (
                    loading ? <div>Loading</div> : (
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
                                <Number>{data.endedStudents === 0 ? 0 : data.endedStudents / (data.students + data.endedStudents) * 100}%</Number>
                                <Chart data={[data.endedStudents, data.endedStudents === 0 ? 1 : data.students]} size={100} />
                            </Tile>
                        </Tiles>
                    )
                )}
            </Content>
        </Container>
    )
}
