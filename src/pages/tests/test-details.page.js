import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "../../providers/tests.provider";
import { formatDatetime } from "../../utils/TimeUtils";
import { Title } from "../../ui/typography";
import { Footer } from "../../ui/footer";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

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

export default function TestDetails(){

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + page.testId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [page.testId])

    const deleteTest = () => {
        setLoading(true);
        axios.delete('http://localhost:4000/test/' + page.testId).then((res) => {
            page.setTestId()
            page.setPage(PAGES.LIST);
        })
    }

    const navigate = useNavigate();

    const getStatus = () => {
        const now = new Date();
        const start = new Date(data.loginTimeStart);
        const end = new Date(data.loginTimeEnd);
        return now < start || now >= end ? 'nieaktywny' : 'aktywny';
    }

    return loading ? <div>Loading</div> : (
        <Container>
            <Title>Informacje o teście</Title>
            <Item>
                <div>Nazwa:</div>
                <div>{data.name}</div>
            </Item>
            <Item>
                <div>Czas trwania w minutach:</div>
                <div>{data.time}</div>
            </Item>
            <Item>
                <div>Czas logowania:</div>
                <div>{formatDatetime(new Date(data.loginTimeStart)) + ' - ' + formatDatetime(new Date(data.loginTimeEnd))}</div>
            </Item>
            <Item>
                <div>Status:</div>
                <div>{getStatus()}</div>
            </Item>
            <Item>
                <div>Pytania:</div>
                <div>{data.questions.length}</div>
            </Item>
            <Item>
                <div>Studenci:</div>
                <div>{data.students.length}</div>
            </Item>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Wróc</Button>
                <Button onClick={() => navigate('/' + page.testId)}>Link</Button>
                <Button onClick={() => page.setPage(PAGES.EDIT)}>Edytuj</Button>
                <Button className='danger' onClick={() => deleteTest()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
