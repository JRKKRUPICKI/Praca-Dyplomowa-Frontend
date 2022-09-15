import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/questions.provider";
import { Error, Title } from "../../ui/typography";
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

export default function AnswerAdd(){

    const [loading, setLoading] = useState(false);

    const page = usePage();

    const [answerField, setAnswerField] = useState();
    const [answerError, setAnswerError] = useState();

    const [correctField, setCorrectField] = useState(false);

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
        axios.post('http://54.37.232.57/api/answer', {
            name: answerField,
            correct: correctField,
            questionId: page.questionId
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            alert(err.response.data.message)
        }).finally(
            setLoading(false)
        )
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Dodawanie odpowiedzi</Title>
            <Item>
                <div>Treść odpowiedzi:</div>
                <Input onChange={(e) => setAnswerField(e.target.value)}/>
                {answerError && <Error>{answerError}</Error>}
            </Item>
            <Item>
                <div>Odpowiedź poprawna?</div>
                <Input type='checkbox' onChange={(e) => setCorrectField(e.target.checked)}/>
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button onClick={() => saveAnswer()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
