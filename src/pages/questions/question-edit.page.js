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

export default function QuestionEdit(){

    const [loading, setLoading] = useState(true);

    const page = usePage();

    const [question, setQuestion] = useState();

    useEffect(() => {
        axios.get('http://54.37.232.57/api/question/' + page.questionId).then((res) => {
            setQuestion(res.data);
            setQuestionField(res.data.name);
            setTypeField(res.data.type);
            setLoading(false);
        })
    }, [page.questionId])

    const [questionField, setQuestionField] = useState();
    const [questionError, setQuestionError] = useState();

    const [typeField, setTypeField] = useState();

    const validate = () => {
        let valid = true;
        if(!questionField){
            setQuestionError('Nieprawidłowa treść pytania');
            valid = false;
        }
        else if(questionField !== questionField.trim()){
            setQuestionError('Nieprawidłowa treść pytania');
            valid = false;
        }
        else setQuestionError();
        return valid;
    }

    const saveQuestion = () => {
        if(!validate()) return;
        setLoading(true);
        axios.patch('http://54.37.232.57/api/question/' + page.questionId, {
            name: questionField,
            type: typeField
        }).then((res) => {
            page.setPage(PAGES.DETAILS);
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Edycja pytania</Title>
            <Item>
                <div>Treść pytania:</div>
                <Input defaultValue={question.name} onChange={(e) => setQuestionField(e.target.value)}/>
                {questionError && <Error>{questionError}</Error>}
            </Item>
            <Item>
                <div>Pytanie wielokrotnego wyboru?</div>
                <Input type='checkbox' checked={typeField} onChange={(e) => setTypeField(e.target.checked)}/>
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button onClick={() => saveQuestion()}>Zapisz</Button>
            </Footer>
        </Container>
    )
}
