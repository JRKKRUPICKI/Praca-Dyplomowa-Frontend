import styled, { css } from "styled-components"

interface LabelProps {
    active?: boolean,
    inactive?: boolean
}

export const Label = styled.div<LabelProps>`
    ${props => props.active && css`color: #80b918;`}
    ${props => props.inactive && css`color: #ba181b;`}
`;
