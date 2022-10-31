import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Question } from "../../models";
import { PAGES, usePage } from "./questions.provider";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

export default function QuestionDelete() {

    const [isLoading, setIsLoading] = useState(true);

    const page = usePage();

    const [question, setQuestion] = useState<Question>();

    useEffect(() => {
        axios.get(API + 'question/' + page.questionId).then((res) => {
            setQuestion(res.data);
            setIsLoading(false);
        })
    }, [page.questionId]);

    if (isLoading || !question) {
        return <div>Loading</div>
    }

    const deleteQuestion = () => {
        setIsLoading(true);
        axios.delete(API + 'question/' + page.questionId).then((res) => {
            page.setQuestionId()
            page.setPage(PAGES.LIST);
        });
    }

    return (
        <Container>
            <Title>Czy na pewno chcesz usunąć pytanie {question.name}?</Title>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button className='danger' onClick={() => deleteQuestion()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
