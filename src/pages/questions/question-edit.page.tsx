import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Error, Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { API } from "../../App";
import { Question } from "../../models";
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

export default function QuestionEdit() {

    const [loading, setLoading] = useState(true);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const page = usePage();
    const [question, setQuestion] = useState<Question>();

    useEffect(() => {
        axios.get(API + 'question/' + page.questionId).then((res) => {
            setQuestion(res.data);
            setQuestionField(res.data.name);
            setTypeField(res.data.type);
            setLoading(false);
        })
    }, [page.questionId]);


    const [questionField, setQuestionField] = useState('');
    const [questionError, setQuestionError] = useState('');
    const [typeField, setTypeField] = useState(false);

    const [error, setError] = useState('');

    if (loading || !question) {
        return <div>Loading</div>
    }

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
        setIsSaveLoading(true);
        axios.patch(API + 'question/' + page.questionId, {
            name: questionField,
            type: typeField
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            if (err.response.data.message === 'Question already exists') setError('Pytanie o podanej treści już istnieje');
            else setError('Nie można zapisać zmian');
        }).finally(() => setIsSaveLoading(false));
    }

    return (
        <Container>
            <Title>Edycja pytania</Title>
            <Item>
                <div>Treść pytania:</div>
                <Input defaultValue={question.name} onChange={(e) => setQuestionField(e.target.value)} />
                {questionError && <Error>{questionError}</Error>}
            </Item>
            <Item>
                <div>Pytanie wielokrotnego wyboru?</div>
                <Input type='checkbox' checked={typeField} onChange={(e) => setTypeField(e.target.checked)} />
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                {isSaveLoading ? <Button>Zapisz</Button> : <Button onClick={() => saveQuestion()}>Zapisz</Button>}
                {error && <Error>{error}</Error>}
            </Footer>
        </Container>
    )
}
