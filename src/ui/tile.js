import styled from "styled-components";

const Container = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
    width: fit-content;
`;

export default function Tile(props){
    return <Container>{props.children}</Container>
}