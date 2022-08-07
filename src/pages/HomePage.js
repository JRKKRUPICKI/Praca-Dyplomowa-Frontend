import { mdiAccountGroupOutline, mdiAccountOutline, mdiChartBoxOutline, mdiHelpCircleOutline, mdiNoteMultipleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components"
import Button from "../ui/button/button";

const Navigation = styled.div`
    background: #3f37c9;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: fit-content;
`;

const Header = styled.div`
    font-size: 20px;
    margin: 20px;
    color: #FFFFFF;
    letter-spacing: 3px;
`;

const NavigationItem = styled.a`
    display: block;
    padding: 20px;
    color: #FFFFFF;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    ${props => props.active && css`
        background: #FFFFFF;
        color: #000000;
    `}

    &:hover{
        background: #FFFFFF;
        color: #000000;

        & > svg > path{
            fill: #000000 !important;
        }
    }

    & > span{
        margin-left: 10px;
    }
`;

export default function HomePage() {



    return(
        <Navigation>
            <Header>Sprawdź Studenta .pl</Header>
            <NavigationItem><Icon path={mdiNoteMultipleOutline} size={1} color="white"/><span>Testy</span></NavigationItem>
            <NavigationItem><Icon path={mdiAccountGroupOutline} size={1} color="white"/><span>Studenci</span></NavigationItem>
            <NavigationItem active><Icon path={mdiHelpCircleOutline} size={1} color="black"/><span>Pytania</span></NavigationItem>
            <NavigationItem><Icon path={mdiChartBoxOutline} size={1} color="white"/><span>Statystyki</span></NavigationItem>
            <NavigationItem><Icon path={mdiAccountOutline} size={1} color="white"/><span>Profil</span></NavigationItem>
            <Button type='delete'>123</Button>
        </Navigation>
    )
}