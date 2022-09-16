import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAuth } from "../auth/Auth";

const Container = styled.div`
    background: #1e1f24;
    min-height: 100vh;
    display: grid;
    grid-template-rows: 80px auto;
`;

const Link = styled.div`
    display: grid;
    grid-template-columns: 30px auto;
    padding: 10px 20px;
    cursor: pointer;
    margin: 10px 14px;
    gap: 10px;
    border-radius: 8px;
    align-items: center;
    color: #e6effc;

    ${props => props.activeLink && css`
        background: #307af3;
    `}

    &:hover{
        background: #307af3;
    }

    & > i{
        color: #e6effc;
    }
`;

const Logo = styled.div`
    font-size: 24px;
    text-align: center;
    font-weight: bold;
    letter-spacing: 2px;
    line-height: 80px;
`;

export const LINKS = {
    DASHBOARD: 'DASHBOARD',
    TESTS: 'TESTS',
    STUDENTS: 'STUDENTS',
    QUESTIONS: 'QUESTIONS',
    RESULTS: 'RESULTS',
    STATISTICS: 'STATISTICS',
};

export const Navigation = (props) => {

    const navigate = useNavigate();

    const auth = useAuth();

    return (
        <Container>
            <Logo>
                Inżynierka
            </Logo>
            <div>
                <Link onClick={() => navigate('/dashboard')} activeLink={props.activeLink === LINKS.DASHBOARD}>
                    <i className='gg-album'></i>Dashboard
                </Link>
                <Link onClick={() => navigate('/tests')} activeLink={props.activeLink === LINKS.TESTS}>
                    <i className='gg-notes'></i>Testy
                </Link>
                <Link onClick={() => navigate('/students')} activeLink={props.activeLink === LINKS.STUDENTS}>
                    <i className='gg-user-list'></i>Studenci
                </Link>
                <Link onClick={() => navigate('/questions')} activeLink={props.activeLink === LINKS.QUESTIONS}>
                    <i className='gg-edit-unmask'></i>Pytania
                </Link>
                <Link onClick={() => navigate('/results')} activeLink={props.activeLink === LINKS.RESULTS}>
                    <i className='gg-list'></i>Wyniki
                </Link>
                <Link onClick={() => navigate('/statistics')} activeLink={props.activeLink === LINKS.STATISTICS}>
                    <i className='gg-calculator'></i>Statystyki
                </Link>
                <Link>
                    <i className='gg-camera'></i>Dziennik interakcji
                </Link>
                <Link>
                    <i className='gg-record'></i>W trakcie wypełniania
                </Link>
                <Link onClick={() => auth.logout()}>
                    <i className='gg-log-off'></i>Wyloguj się
                </Link>
            </div>
        </Container>
    )
}