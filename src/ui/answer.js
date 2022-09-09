import styled, { css } from "styled-components"

const Style = css`
    background: #1e1f24;
    border-radius: 14px;
    padding: 8px;
    font-size: 14px;
    color: #FFFFFF;
    margin-bottom: 10px;

    &:last-child{
        margin-bottom: 0;
    }

    display: grid;
    grid-template-columns: 26px 1fr;
`;

const Default = styled.div`
    ${Style}
    border: 1px solid #000000;
`;

const Red = styled.div`
    ${Style}
    border: 1px solid #ba181b;
`;

const Green = styled.div`
    ${Style}
    border: 1px solid #80b918;
`;

const CheckBox = styled.div`
    width: 16px;
    height: 16px;
    display: inline-block;
    background: white;
    border-radius: 15%;

    ${props => props.checked && css`
        background: #307af3;
    `}

    ${props => !props.multiCheck && css`
        border-radius: 50%;
    `}
`;

export default function Answer(props){
    if(props.type === 'correct') return <Green><CheckBox checked={props.checked} multiCheck={props.multiCheck}/>{props.children}</Green>
    if(props.type === 'incorrect') return <Red><CheckBox checked={props.checked} multiCheck={props.multiCheck}/>{props.children}</Red>
    return <Default>{props.children}</Default>
}
