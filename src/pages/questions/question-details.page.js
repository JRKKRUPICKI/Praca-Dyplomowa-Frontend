import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/questions.provider";
import { Title } from "../../ui/typography";
import { Footer } from "../../ui/footer";
import { Button } from "../../ui/button";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;

    &:not(:first-child){
        margin-top: 10px;
    }
`;

export default function QuestionDetails(){

    const [loading, setLoading] = useState(true);

    const page = usePage();

    const [question, setQuestion] = useState();

    useEffect(() => {
        axios.get('http://localhost:4000/question/' + page.questionId).then((res) => {
            setQuestion(res.data);
            setLoading(false);
        })
    }, [page.questionId])

    const deleteQuestion = () => {
        setLoading(true);
        axios.delete('http://localhost:4000/question/' + page.questionId).then((res) => {
            page.setQuestionId()
            page.setPage(PAGES.LIST);
        })
    }

    const loadQuestion = () => {
        setLoading(true);
        axios.get('http://localhost:4000/question/' + page.questionId).then((res) => {
            setQuestion(res.data);
            setLoading(false);
        })
    }

    const deleteAnswer = (answerId) => {
        setLoading(true);
        axios.delete('http://localhost:4000/answer/' + answerId).then((res) => {
            loadQuestion();
        })
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Szczegóły pytania</Title>
            <Item>
                <div>Treść pytania:</div>
                <div>{question.name}</div>
            </Item>
            <Item>
                <div>Typ pytania:</div>
                <div>{question.type ? 'wielokrotnego wyboru' : 'jednokrotnego wyboru'}</div>
            </Item>
            <br/>
            <Title>Odpowiedzi</Title>
            {question.answers.map(answer => (
                <Item key={answer.id}>
                    <div>{answer.name}</div>
                    <div>{answer.correct ? '+' : '-'}
                    <Button onClick={() => {page.setAnswerId(answer.id); page.setPage(PAGES.EDIT_ANSWER)}}>Edytuj odpowiedź</Button>
                    <Button className='danger' onClick={() => deleteAnswer(answer.id)}>Usuń odpowiedź</Button>
                    </div>
                </Item>
            ))}
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Wróc</Button>
                <Button onClick={() => page.setPage(PAGES.EDIT)}>Edytuj pytanie</Button>
                <Button className='success' onClick={() => page.setPage(PAGES.ADD_ANSWER)}>Dodaj odpowiedź</Button>
                <Button className='danger' onClick={() => deleteQuestion()}>Usuń pytanie</Button>
            </Footer>
        </Container>
    )
}
