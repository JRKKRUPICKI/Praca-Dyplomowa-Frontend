import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/Auth";
import { Number, Title } from "../ui/typography";

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
            padding: 8px 16px;
            text-align: center;

            &:nth-child(1), &:nth-child(2){
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

const Tiles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
`;

const Tile = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    display: inline-block;
`;

export default function Dashboard(){

    const auth = useAuth();

    const [data, setData] = useState({tests: 0, students: 0, questions: 0});

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        let tests = 0;
        let students = 0;
        let questions = 0;
        axios.get('http://localhost:4000/test').then((res) => {
            const data = res.data.filter(t => t.teacher.id === auth.user.id);
            tests = data.length;
            data.map(test => {
                students += test.students.length;
                questions += test.questions.length;
            });
            setData({tests: tests, students: students, questions: questions})
        });
    }, [auth.user.id])

    return (
        <Container>
            <Navigation>
                <Logo>
                    Inżynierka
                </Logo>
                <Links>
                    <div className="active" onClick={() => navigate('/dashboard')}>
                        <i className='gg-album'></i>Dashboard
                    </div>
                    <div onClick={() => navigate('/tests')}>
                        <i className='gg-notes'></i>Testy
                    </div>
                    <div onClick={() => navigate('/students')}>
                        <i className='gg-user-list'></i>Studenci
                    </div>
                    <div onClick={() => navigate('/questions')}>
                        <i className='gg-edit-unmask'></i>Pytania
                    </div>
                    <div onClick={() => navigate('/results')}>
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
                    <User onClick={() => auth.logout()}>
                        <div></div>
                        <div>teacher@gmail.com</div>
                    </User>
                </Header>
                <Tiles>
                    <Tile>
                        <Title>Testy</Title>
                        <Number>{data.tests}</Number>
                    </Tile>
                    <Tile>
                        <Title>Studenci</Title>
                        <Number>{data.students}</Number>
                    </Tile>
                    <Tile>
                        <Title>Pytania</Title>
                        <Number>{data.questions}</Number>
                    </Tile>
                </Tiles>
            </Content>
        </Container>
    )
}
