import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Answer } from "../../models";
import { PAGES, usePage } from "./questions.provider";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

export default function AnswerDelete() {

    const [isLoading, setIsLoading] = useState(true);
    const page = usePage();
    const [answer, setAnswer] = useState<Answer>();

    useEffect(() => {
        axios.get(API + 'answer/' + page.answerId).then((res) => {
            setAnswer(res.data);
            setIsLoading(false);
        })
    }, [page.answerId])

    if (isLoading || !answer) {
        return <div>Loading</div>
    }

    const deleteAnswer = () => {
        setIsLoading(true);
        axios.delete(API + 'answer/' + page.answerId).then((res) => {
            page.setAnswerId()
            page.setPage(PAGES.DETAILS);
        })
    }

    return (
        <Container>
            <Title>Czy na pewno chcesz usunąć odpowiedź {answer.name}?</Title>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button className='danger' onClick={() => deleteAnswer()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
