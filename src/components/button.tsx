import styled from "styled-components"

export const Button = styled.button`
    padding: 10px;
    border-radius: 8px;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    background: #307AF3;

    &.danger{
        background: #EF233C;
    }

    &.secondary{
        background: #8a817c;
    }

    &.success{
        background: #29bc88;
    }
`;
