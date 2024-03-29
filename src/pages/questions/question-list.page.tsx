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
import { Select } from "../../components/select";

const Container = styled.div`
    ${Tile}:not(:first-child){
        margin-top: 16px;
    }

    & td:nth-child(1){
        width: 100%;
    }
`;

export default function QuestionList() {

    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState([]);
    const page = usePage();

    useEffect(() => {
        axios.get(API + 'test/teacher/' + auth?.user?.id).then((res) => {
            setTests(res.data);
            setIsLoading(false);
        });
        loadQuestions(page.testId);
    }, [auth?.user?.id]);

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

    const loadQuestions = (testId: string) => {
        if (!testId || testId === '0') return;
        setIsLoading(true);
        axios.get(API + 'question').then((res) => {
            setQuestions(res.data.filter((question: any) => question.test.id === parseInt(testId)));
            setIsLoading(false);
        });
    }

    const chooseTest = (testId: string) => {
        page.setTestId(testId);
        setQuestions([]);
        loadQuestions(testId);
    }

    return (
        <Container>
            <Tile>
                <Title>Wybierz test</Title>
                <Select onChange={e => chooseTest(e.target.value)} value={page.testId}>
                    <option value='0'>Wybierz test</option>
                    {tests.map((test: any) => <option value={test.id} key={test.id}>{test.name}</option>)}
                </Select>
            </Tile>
            <Tile>
                <Title>Lista pytań</Title>
                {!page.testId || page.testId === '0' ? (
                    <Description>Wybierz test, aby wyświetlić pytania</Description>
                ) : (<>
                    {questions.length === 0 ? (
                        <Description>Test nie posiada przypisanych pytań</Description>
                    ) : (
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
                    )}
                    <Footer>
                        <Button className='success' onClick={() => page.setPage(PAGES.ADD)}>Dodaj pytanie</Button>
                    </Footer>
                </>)}
            </Tile>
        </Container>
    )
}
