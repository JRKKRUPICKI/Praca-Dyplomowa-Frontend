import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { PAGES, usePage } from "../../providers/questions.provider";
import { Description, Title } from "../../ui/typography";
import { Tile } from "../../ui/tile";
import { Footer } from "../../ui/footer";
import { Button } from "../../ui/button";

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

export default function QuestionList(){
    const auth = useAuth();

    const [loading, setLoading] = useState(true);

    const [tests, setTests] = useState([]);

    useEffect(() => {
        axios.get('http://54.37.232.57/api/test').then((res) => {
            setTests(res.data.filter(t => t.teacher.id === auth.user.id));
            setLoading(false);
        });
        if(page.testId) loadQuestions();
    }, [auth.user.id])

    const page = usePage();

    const getQuestion = (question) => {
        return(
            <tr key={question.id}>
                <td>{question.name}</td>
                <td>{question.answers.length}</td>
                <td>{question.answers.filter(answer => answer.correct).length}</td>
                <td>
                    <Button onClick={() => {page.setQuestionId(question.id); page.setPage(PAGES.DETAILS)}}>Otwórz</Button>
                    <Button onClick={() => {page.setQuestionId(question.id); page.setPage(PAGES.EDIT)}}>Edytuj</Button>
                    <Button className="danger" onClick={() => removeQuestion(question.id)}>Usuń</Button>
                </td>
            </tr>
        )
    }

    const removeQuestion = (questionId) => {
        setLoading(true);
        axios.delete('http://54.37.232.57/api/question/' + questionId).then((res) => {
            loadQuestions()
        })
    }

    const [questions, setQuestions] = useState();

    const loadQuestions = () => {
        setLoading(true);
        axios.get('http://54.37.232.57/api/question').then((res) => {
            setQuestions(res.data.filter(question => question.test.id === parseInt(page.testId)));
            setLoading(false);
        })
    }

    return (
        <div>
            <Tile>
                <Title>Wybierz test</Title>
                <Select onChange={e => page.setTestId(e.target.value)} value={page.testId}>
                    <option value='0'>Wybierz test</option>
                    {tests.map(test => <option value={test.id} key={test.id}>{test.name}</option>)}
                </Select>
                <Button onClick={() => loadQuestions()}>Pokaż pytania</Button>
            </Tile>
            {questions && (
                loading ? <div>Loading</div> : (
                    <Tile>
                        <Title>Lista pytań</Title>
                        {questions.length === 0 ? <Description>Test nie posiada przypisanych pytań</Description> : (
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
                                    {questions.map(question => getQuestion(question))}
                                </tbody>
                            </table>
                        )}
                        <Footer>
                            <Button className='success' onClick={() => page.setPage(PAGES.ADD)}>Dodaj pytanie</Button>
                        </Footer>
                    </Tile>
                )
            )}
        </div>
    )
}
