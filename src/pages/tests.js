import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { TestsProvider } from "../providers/tests.provider";
import { useAuth } from "../auth/Auth";

const Container = styled.div`
    display: grid;
    grid-template-columns: 270px auto;
`;

const Navigation = styled.div`
    background: #1e1f24;
    min-height: 100vh;
    display: grid;
    grid-template-rows: 80px auto;
`;

const Logo = styled.div`
    font-size: 24px;
    text-align: center;
    font-weight: bold;
    letter-spacing: 2px;
    line-height: 80px;
`;

const Links = styled.div`
    & > div{
        display: grid;
        grid-template-columns: 30px auto;
        padding: 10px 20px;
        cursor: pointer;
        margin: 10px 14px;
        gap: 10px;
        border-radius: 8px;
        align-items: center;
        color: #e6effc;

        &.active{
            background: #307af3;
        }
    
        &:hover{
            background: #307af3;
        }
    
        & > i{
            color: #e6effc;
        }
    }
`;

const Content = styled.div`
    margin: 20px;

    table{
        width: 100%;
        border-collapse: collapse;
        color: #7d8093;
        white-space: nowrap;

        thead tr{
            font-weight: bold;
        }

        tr{
            border: none;
        }

        tbody tr:hover{
            background: #333541;
            color: #c9c9c9;
            
            td:first-child{
                border-top-left-radius: 16px;
                border-bottom-left-radius: 16px;
            }

            td:last-child{
                border-top-right-radius: 16px;
                border-bottom-right-radius: 16px;
            }
        }

        td{
            padding: 6px;
            text-align: center;

            &:nth-child(1){
                text-align: left;
            }

            & > *:not(:first-child){
                margin-left: 8px;
            }
        }
    }

    & > *:nth-child(2){
        margin-top: 16px;
    }
`;

const Header = styled.div`
    display: grid;
    grid-template-columns: 400px auto;
    align-items: center;
    justify-content: space-between;

    & > input{
        background: #1e1f24;
        border: none;
        border-radius: 10px;
        padding: 14px;
        font-size: 14px;
        color: #7d8093;
        height: 40px;

        &:focus{
            outline: none;
        }
    }
`;

const User = styled.div`
    display: grid;
    grid-template-columns: 40px auto;
    align-items: center;

    div:first-child{
        width: 40px;
        height: 40px;
        background: yellow;
        border-radius: 50%;
    }

    div:nth-child(2){
        margin-left: 16px;
    }
`;

export default function Tests(){

    const navigate = useNavigate();

    const auth = useAuth();

    return (
        <Container>
            <Navigation>
                <Logo>
                    Inżynierka
                </Logo>
                <Links>
                    <div onClick={() => navigate('/')}>
                        <i className='gg-album'></i>Dashboard
                    </div>
                    <div className="active" onClick={() => navigate('/tests')}>
                        <i className='gg-notes'></i>Testy
                    </div>
                    <div onClick={() => navigate('/students')}>
                        <i className='gg-user-list'></i>Studenci
                    </div>
                    <div onClick={() => navigate('/questions')}>
                        <i className='gg-edit-unmask'></i>Pytania
                    </div>
                    <div>
                        <i className='gg-list'></i>Wyniki
                    </div>
                    <div>
                        <i className='gg-calculator'></i>Statystyki
                    </div>
                    <div>
                        <i className='gg-camera'></i>Dziennik interakcji
                    </div>
                    <div>
                        <i className='gg-record'></i>W trakcie wypełniania
                    </div>
                    <div onClick={() => auth.logout()}>
                        <i className='gg-log-off'></i>Wyloguj się
                    </div>
                </Links>
            </Navigation>
            <Content>
                <Header>
                    <input type='text' placeholder="Wyszukiwanie..."/>
                    <User>
                        <div></div>
                        <div>teacher@gmail.com</div>
                    </User>
                </Header>
                <TestsProvider/>
            </Content>
        </Container>
    )
}
