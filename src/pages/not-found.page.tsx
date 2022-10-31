import styled from "styled-components";
import { Title } from "../components/typography";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const Image = styled.img`
    width: 170px;
    margin-bottom: 16px;
`;

export default function NotFoundPage() {
    return <Container>
        <Image src="/not-found.png" />
        <Title>Page not found</Title>
    </Container>
}
