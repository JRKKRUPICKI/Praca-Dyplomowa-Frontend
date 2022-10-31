import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { PAGES, usePage } from "./questions.provider";
import { Input } from "../../components/input";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;

    ${Footer} > ${Error}{
        text-align: center;
        margin-top: 8px;
    }
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: center;

    &:not(:first-child){
        margin-top: 10px;
    }
`;

export default function AnswerAdd() {

    const [isLoading, setIsLoading] = useState(false);

    const page = usePage();

    const [answerField, setAnswerField] = useState('');
    const [answerError, setAnswerError] = useState('');
    const [correctField, setCorrectField] = useState(false);

    const [error, setError] = useState('');

    const validate = () => {
        let valid = true;
        if (!answerField) {
            setAnswerError('Podaj treść odpowiedzi');
            valid = false;
        }
        else if (answerField !== answerField.trim()) {
            setAnswerError('Podaj prawidłową treść odpowiedzi');
            valid = false;
        }
        else setAnswerError('');
        return valid;
    }

    const saveAnswer = () => {
        if (!validate()) return;
        setIsLoading(true);
        axios.post(API + 'answer', {
            name: answerField,
            correct: correctField,
            questionId: page.questionId
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            if (err.response.data.message === 'Answer already exists') setError('Odpowiedź o podanej treści już istnieje');
            else setError('Nie można dodać odpowiedzi');
        }).finally(() => setIsLoading(false));
    }

    return (
        <Container>
            <Title>Dodawanie odpowiedzi</Title>
            <Item>
                <div>Treść odpowiedzi:</div>
                <Input onChange={(e) => setAnswerField(e.target.value)} />
                {answerError && <Error>{answerError}</Error>}
            </Item>
            <Item>
                <div>Odpowiedź poprawna?</div>
                <Input type='checkbox' onChange={(e) => setCorrectField(e.target.checked)} />
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                {isLoading ? <Button>Zapisz</Button> : <Button onClick={() => saveAnswer()}>Zapisz</Button>}
                {error && <Error>{error}</Error>}
            </Footer>
        </Container>
    )
}
