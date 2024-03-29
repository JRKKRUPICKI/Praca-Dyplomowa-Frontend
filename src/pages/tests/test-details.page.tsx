import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "./tests.provider";
import { formatDatetime } from "../../utils/TimeUtils";
import { Title } from "../../components/typography";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Test } from "../../models";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
`;

const Item = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    padding: 8px;

    &:hover{
        background: #333541;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }
`;

export default function TestDetails() {

    const [data, setData] = useState<Test>();
    const [isLoading, setIsLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'test/' + page.testId).then((res) => {
            setData(res.data);
            setIsLoading(false);
        })
    }, [page.testId]);

    if (!data || isLoading) {
        return <div>Loading</div>;
    }

    const getStatus = () => {
        const now = new Date();
        const start = new Date(data.loginTimeStart);
        const end = new Date(data.loginTimeEnd);
        return now < start || now >= end ? 'nieaktywny' : 'aktywny';
    }

    return (
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
                <Button className='secondary' onClick={() => page.setPage(PAGES.LIST)}>Wróć</Button>
                <Button onClick={() => window.open('/test/' + page.testId)}>Otwórz test</Button>
                <Button onClick={() => page.setPage(PAGES.EDIT)}>Edytuj</Button>
                <Button className="danger" onClick={() => { page.setTestId(page.testId); page.setPage(PAGES.DELETE) }}>Usuń</Button>
            </Footer>
        </Container>
    )
}
