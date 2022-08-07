import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/questions.provider";
import { Error, Title } from "../../ui/typography";
import { Footer } from "../../ui/footer";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: center;

    &:not(:first-child){
        margin-top: 10px;
    }
`;

export default function AnswerEdit(){

    const [loading, setLoading] = useState(true);

    const page = usePage();

    const [answer, setAnswer] = useState();

    useEffect(() => {
        axios.get('http://localhost:4000/answer/' + page.answerId).then((res) => {
            setAnswer(res.data);
            setAnswerField(res.data.name);
            setCorrectField(res.data.correct);
            setLoading(false);
        })
    }, [])

    const [answerField, setAnswerField] = useState();
    const [answerError, setAnswerError] = useState();

    const [correctField, setCorrectField] = useState();

    const validate = () => {
        let valid = true;
        if(!answerField){
            setAnswerError('Nieprawidłowa treść odpowiedzi');
            valid = false;
        }
        else if(answerField !== answerField.trim()){
            setAnswerError('Nieprawidłowa treść odpowiedzi');
            valid = false;
        }
        else setAnswerError();
        return valid;
    }

    const saveAnswer = () => {
        if(!validate()) return;
        setLoading(true);
        axios.patch('http://localhost:4000/answer/' + page.answerId, {
            name: answerField,
            correct: correctField
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Edycja odpowiedzi</Title>
            <Item>
                <div>Treść odpowiedzi:</div>
                <Input defaultValue={answer.name} onChange={(e) => setAnswerField(e.target.value)}/>
                {answerError && <Error>{answerError}</Error>}
            </Item>
            <Item>
                <div>Odpowiedź poprawna?</div>
                <Input type='checkbox' checked={correctField} onChange={(e) => setCorrectField(e.target.checked)}/>
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button onClick={() => saveAnswer()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
