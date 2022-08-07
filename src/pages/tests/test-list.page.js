import { useEffect } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { PAGES, usePage } from "../../providers/tests.provider";
import { Title } from "../../ui/typography";

const Tile = styled.div`
    background: #1E1F24;
    border-radius: 16px;
    padding: 20px;

    &:not(:first-child){
        margin-top: 16px;
    }
`;

const Button = styled.button`
    padding: 10px;
    border-radius: 8px;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    background: #000000;

    &.details{
        background: #307AF3;
    }

    &.delete{
        background: #EF233C;
    }

    &.show{
        margin-left: 16px;
        background: #307AF3;
    }

    &.add{
        background: #29bc88;
        margin-top: 16px;
    }
`;

const Description = styled.div`
    font-size: 14px;
    color: #7d8093;
`;

const Label = styled.div`
    ${props => props.active && css`color: #80b918;`}
    ${props => props.inactive && css`color: #ba181b;`}
`;

export default function TestsList(){
    const auth = useAuth();

    const [loading, setLoading] = useState(true);

    const [tests, setTests] = useState();

    useEffect(() => {
        axios.get('http://localhost:4000/test').then((res) => {
            setTests(res.data.filter(t => t.teacher.id === auth.user.id));
            setLoading(false);
        });
    }, [])

    const page = usePage();

    const getTest = (test) => {
        const now = new Date();
        const start = new Date(test.loginTimeStart);
        const end = new Date(test.loginTimeEnd);
        return(
            <tr key={test.id}>
                <td>{test.name}</td>
                <td>{test.questions.length}</td>
                <td>{test.students.length}</td>
                <td>{now < start || now >= end ? <Label inactive>nieaktywny</Label> : <Label>aktywny</Label>}</td>
                <td>
                    <Button className="details" onClick={() => {page.setTestId(test.id); page.setPage(PAGES.DETAILS)}}>Otwórz</Button>
                    <Button className="details" onClick={() => {page.setTestId(test.id); page.setPage(PAGES.EDIT)}}>Edytuj</Button>
                    <Button className="delete" onClick={() => removeTest(test.id)}>Usuń</Button>
                </td>
            </tr>
        )
    }

    const removeTest = (testId) => {
        setLoading(true);
        axios.delete('http://localhost:4000/test/' + testId).then((res) => {
            axios.get('http://localhost:4000/test').then((res) => {
                setTests(res.data.filter(t => t.teacher.id === auth.user.id));
                setLoading(false);
            });
        })
    }

    return (
        loading ? <div>Loading</div> : (
            <Tile>
                <Title>Stworzone testy</Title>
                {tests.length === 0 ? <Description>Brak stworzonych testów</Description> : (
                    <table>
                        <thead>
                            <tr>
                                <td>Nazwa</td>
                                <td>Pytania</td>
                                <td>Studenci</td>
                                <td>Status</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map(test => getTest(test))}
                        </tbody>
                    </table>
                )}
                <Button className='add' onClick={() => page.setPage(PAGES.ADD)}>Stworz nowy test</Button>
            </Tile>
        )
    )
}
