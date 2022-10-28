import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { PAGES, usePage } from "./tests.provider";
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

export default function TestDelete() {

    const [data, setData] = useState<Test>();
    const [isLoading, setIsLoading] = useState(true);

    const page = usePage();

    useEffect(() => {
        axios.get(API + 'test/' + page.testId).then((res) => {
            setData(res.data);
            setIsLoading(false);
        })
    }, [page.testId])

    const deleteTest = () => {
        setIsLoading(true);
        axios.delete(API + 'test/' + page.testId).then((res) => {
            page.setTestId()
            page.setPage(PAGES.LIST);
        })
    }

    if (!data || isLoading) {
        return <div>Loading</div>;
    }

    return (
        <Container>
            <Title>Czy na pewno chcesz usunąć test {data.name}?</Title>
            <Footer>
                <Button className='secondary' onClick={() => page.setPage(PAGES.DETAILS)}>Anuluj</Button>
                <Button className='danger' onClick={() => deleteTest()}>Usuń</Button>
            </Footer>
        </Container>
    )
}
