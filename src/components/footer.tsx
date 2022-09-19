import styled from "styled-components";
import { Button } from "./button";

export const Footer = styled.div`
    margin-top: 16px;
    text-align: right;

    & > ${Button}:not(:first-child){
        margin-left: 8px;
    }
`;