import styled, { css } from "styled-components"

const Style = css``;

const Default = styled.div`
    ${Style}
    color: #000000;
`;

const Red = styled.div`
    ${Style}
    color: #ba181b;
`;

const Green = styled.div`
    ${Style}
    color: #80b918;
`;

export default function Label(props){
    if(props.type === 'RED') return <Red>{props.children}</Red>
    if(props.type === 'GREEN') return <Green>{props.children}</Green>
    return <Default>{props.children}</Default>
}
