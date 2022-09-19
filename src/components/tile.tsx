import styled from "styled-components";

export const Tile = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;

    &:not(:first-child){
        margin-top: 16px;
    }
`;
