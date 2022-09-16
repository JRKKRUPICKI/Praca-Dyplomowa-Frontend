import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { API } from "../App";
import { useAuth } from "../auth/Auth";
import { LINKS, Navigation } from "../components/navigation";
import Answer from "../components/answer";
import { Button } from "../components/button";
import { Tile } from "../components/tile";
import { Title } from "../components/typography";

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

            &:nth-child(1), &:nth-child(2){
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

const Header = styled.div`
    display: grid;
    grid-template-columns: 400px auto;
    align-items: center;
    justify-content: space-between;

    & > input{
        background: #1e1f24;
        border: none;
        border-radius: 10px;
        padding: 14px;
        font-size: 14px;
        color: #7d8093;
        height: 40px;

        &:focus{
            outline: none;
        }
    }
`;

const User = styled.div`
    display: grid;
    grid-template-columns: 40px auto;
    align-items: center;

    div:first-child{
        width: 40px;
        height: 40px;
        background: yellow;
        border-radius: 50%;
    }

    div:nth-child(2){
        margin-left: 16px;
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

export default function Results(){
    const auth = useAuth();

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setData(res.data.filter(t => t.teacher.id === auth.user.id));
            setLoading(false);
        });
    }, [auth.user.id])

    const [testId, setTestId] = useState();
    const [studentId, setStudentId] = useState();

    const [students, setStudents] = useState();

    const loadStudents = () => {
        setLoading(true);
        axios.get(API + 'test/' + testId).then((res) => {
            setStudents(res.data.students);
            setQuestionData(res.data.questions);
            setLoading(false);
        })
    }

    const [results, setResults] = useState();

    const loadResults = () => {
        setLoading(true);
        axios.get(API + 'studentanswer/' + studentId).then((res) => {
            setResults(res.data);
            axios.get(API + 'question/test/' + testId).then((res) => {
                setQuestionData(res.data);
                setLoading(false);
            })
        })
    }

    const [questionData, setQuestionData] = useState();

    const isCorrectAnswer = (answer) => {
        const result = results.find(result => result.answer.id === answer.id);
        return (result && answer.correct) || (!result && !answer.correct);

    }

    const loadMarkedAnswers = () => {
        return questionData.map(question => (
            <div key={question.id} className='questionBox'>
                <div className='question'>{question.name}</div>
                {question.answers.map(a => (
                    <Answer key={a.id} multiCheck={question.type} type={isCorrectAnswer(a) ? 'correct' : 'incorrect'} checked={results.find(result => result.answer.id === a.id)}>{a.name}</Answer>
                ))}
            </div>
        ))
    }

    return (
        <Container>
            <Navigation activeLink={LINKS.RESULTS}/>
            <Content>
                <Header>
                    <input type='text' placeholder="Wyszukiwanie..."/>
                    <User>
                        <div></div>
                        <div>teacher@gmail.com</div>
                    </User>
                </Header>
                <Tile>
                    <Title>Wybierz test</Title>
                    <Select onChange={e => {setTestId(e.target.value);setStudentId()}} value={testId}>
                        <option value='0'>Wybierz test</option>
                        {data.map(test => <option value={test.id} key={test.id}>{test.name}</option>)}
                    </Select>
                    <Button onClick={() => loadStudents()}>Pokaż studentów</Button>
                </Tile>
                {students && (
                    <Tile>
                        <Title>Wybierz studenta</Title>
                        <Select onChange={e => setStudentId(e.target.value)} value={studentId}>
                            <option value='0'>Wybierz studenta</option>
                            {students.map(student => <option value={student.id} key={student.id}>{student.login}</option>)}
                        </Select>
                        <Button onClick={() => loadResults()}>Pokaż wyniki</Button>
                    </Tile>  
                )}
                {results && (
                    loading ? <div>Loading</div> : (
                        <Tile>
                            <Title>Zapisane odpowiedzi</Title>
                            {loadMarkedAnswers()}
                        </Tile>
                    )
                )}
            </Content>
        </Container>
    )
}
