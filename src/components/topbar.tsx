import styled from "styled-components";

const Container = styled.div`
    display: grid;
    grid-template-columns: 400px auto;
    align-items: center;
    justify-content: space-between;

    & > input{
        background: #1e1f24;
        border: none;
        border-radius: 10px;
        padding: 14px;
        font-size: 14px;
        color: #7d8093;
        height: 40px;

        &:focus{
            outline: none;
        }
    }
`;

const User = styled.div`
    cursor: pointer;
    margin-left: 16px;
`;

interface TopbarProps {
    userName: string
}

export const Topbar = (props: TopbarProps) => {
    return (
        <Container>
            <div></div>{/* <input type='text' placeholder="Wyszukiwanie..." /> */}
            <User>{props.userName}</User>
        </Container>
    )
}
