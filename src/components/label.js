import styled, { css } from "styled-components"

export const Label = styled.div`
    ${props => props.active && css`color: #80b918;`}
    ${props => props.inactive && css`color: #ba181b;`}
`;
