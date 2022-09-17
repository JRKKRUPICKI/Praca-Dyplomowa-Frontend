import styled from "styled-components";

interface ChartProps {
    size: number,
    data: [number, number]
}

const Container = styled.div<ChartProps>`
    background: conic-gradient(#9ACD32 ${props => props.data[0] / (props.data[0] + props.data[1]) * 360 + 'deg'}, #655555 ${props => props.data[0] / (props.data[0] + props.data[1]) * 360 + 'deg'} 360deg);
    width: ${props => props.size + 'px'};
    height: ${props => props.size + 'px'};
    border-radius: 50%;
`;

export default function Chart(props: ChartProps) {
    return <Container size={props.size} data={props.data}></Container>
}