import styled from "styled-components";

export const Input = styled.input`
    background: #1e1f24;
    border: 1px solid #7d8093;
    border-radius: 10px;
    padding: 14px;
    font-size: 14px;
    color: #FFFFFF;
    height: 40px;

    &:focus{
        outline: none;
        border: 1px solid #307AF3;
    }
`;

export const InputLabel = styled.div`
    margin: 16px 0 8px 0;
`;
