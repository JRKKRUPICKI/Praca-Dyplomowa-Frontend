import styled, { css } from "styled-components"

const Style = css`
    padding: 10px;
    border-radius: 8px;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    background: #000000;
`;

const Default = styled.button`
    ${Style}
`;

const Delete = styled.button`
    ${Style}
    background: #EF233C;
`;

const Details = styled.button`
    ${Style}
    background: #307AF3;
`;

export default function Button(props){
    if(props.type === 'DELETE') return <Delete>{props.children}</Delete>
    if(props.type === 'DETAILS') return <Details>{props.children}</Details>
    return <Default>{props.children}</Default>
}
