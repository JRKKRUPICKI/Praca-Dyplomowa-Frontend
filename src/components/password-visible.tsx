import { useState } from "react";
import styled, { css } from "styled-components"
import { Button } from "./button";

const VisibleButton = styled(Button)`
    background: #000000;
    margin-left: 8px;
`;

export default function PasswordVisible(props: any) {

    const [isVisible, setIsVisible] = useState(false);

    const toggleIsVisible = () => {
        setIsVisible(!isVisible);
    }

    if (!isVisible) return <>********<VisibleButton onClick={() => toggleIsVisible()}>Pokaż</VisibleButton></>
    return <>{props.children}<VisibleButton onClick={() => toggleIsVisible()}>Ukryj</VisibleButton></>
}
