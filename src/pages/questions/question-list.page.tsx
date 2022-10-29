import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { Description, Title } from "../../components/typography";
import { Tile } from "../../components/tile";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { PAGES, usePage } from "./questions.provider";

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

export default function QuestionList() {

    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const page = usePage();

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setTests(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
            setIsLoading(false);
        });
        if (page.testId) loadQuestions();
    }, [auth?.user?.id, page.testId])

    const getQuestion = (question: any) => {
        return (
            <tr key={question.id}>
                <td>{question.name}</td>
                <td>{question.answers.length}</td>
                <td>{question.answers.filter((answer: any) => answer.correct).length}</td>
                <td>
                    <Button onClick={() => { page.setQuestionId(question.id); page.setPage(PAGES.DETAILS) }}>Szczegóły</Button>
                    <Button onClick={() => { page.setQuestionId(question.id); page.setPage(PAGES.EDIT) }}>Edytuj</Button>
                    <Button className='danger' onClick={() => { page.setQuestionId(question.id); page.setPage(PAGES.DELETE) }}>Usuń</Button>

                </td>
            </tr>
        )
    }

    const [questions, setQuestions] = useState([]);

    const loadQuestions = () => {
        if (!page.testId || page.testId < 1) return;
        setIsLoading(true);
        axios.get(API + 'question').then((res) => {
            setQuestions(res.data.filter((question: any) => question.test.id === parseInt(page.testId)));
            setIsLoading(false);
        })
    }

    return (
        <Container>
            <Tile>
                <Title>Wybierz test</Title>
                <Select onChange={e => page.setTestId(e.target.value)} value={page.testId}>
                    <option value='0'>Wybierz test</option>
                    {tests.map((test: any) => <option value={test.id} key={test.id}>{test.name}</option>)}
                </Select>
                <Button onClick={() => loadQuestions()}>Pokaż pytania</Button>
            </Tile>
            {questions && (
                isLoading ? <div>Loading</div> : (
                    <Tile>
                        <Title>Lista pytań</Title>
                        {page.testId < 1 ? <Description>Wybierz test, aby wyświetlić pytania</Description> : (
                            questions.length === 0 ? <Description>Test nie posiada przypisanych pytań</Description> : (
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Treść pytania</td>
                                            <td>Liczba odpowiedzi</td>
                                            <td>Liczba poprawnych odpowiedzi</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((question: any) => getQuestion(question))}
                                    </tbody>
                                </table>
                            )
                        )}
                        {page.testId > 0 &&
                            <Footer>
                                <Button className='success' onClick={() => page.setPage(PAGES.ADD)}>Dodaj pytanie</Button>
                            </Footer>
                        }
                    </Tile>
                )
            )}
        </Container>
    )
}
