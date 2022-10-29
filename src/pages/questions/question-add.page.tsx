import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { PAGES, usePage } from "./questions.provider";

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

const Input = styled.input`
    background: #1e1f24;
    border: 1px solid #7d8093;
    border-radius: 10px;
    padding: 14px;
    font-size: 14px;
    color: #FFFFFF;
    height: 40px;

    &:focus{
        outline: none;
    }
`;

export default function QuestionAdd() {

    const [isLoading, setIsLoading] = useState(false);
    const page = usePage();
    const [questionField, setQuestionField] = useState('');
    const [questionError, setQuestionError] = useState('');

    const [error, setError] = useState('');

    const validate = () => {
        let valid = true;
        if (!questionField) {
            setQuestionError('Nieprawidłowa treść pytania');
            valid = false;
        }
        else if (questionField !== questionField.trim()) {
            setQuestionError('Nieprawidłowa treść pytania');
            valid = false;
        }
        else setQuestionError('');
        return valid;
    }

    const saveQuestion = () => {
        if (!validate()) return;
        setIsLoading(true);
        axios.post(API + 'question', {
            name: questionField,
            testId: parseInt(page.testId)
        }).then((res) => {
            page.setQuestionId(res.data.id);
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            if (err.response.data.message === 'Question already exists') setError('Pytanie o podanej treści już istnieje');
            else setError('Nie można dodać pytania');
        }).finally(() => setIsLoading(false))
    }

    return (
        <Container>
            <Title>Dodawanie pytania</Title>
            <Item>
                <div>Treść pytania:</div>
                <Input onChange={(e) => setQuestionField(e.target.value)} />
                {questionError && <Error>{questionError}</Error>}
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Anuluj</Button>
                {isLoading ? <Button>Zapisz</Button> : <Button onClick={() => saveQuestion()}>Zapisz</Button>}
                {error && <Error>{error}</Error>}
            </Footer>
        </Container>
    )
}
