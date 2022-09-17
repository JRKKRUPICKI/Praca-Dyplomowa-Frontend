import { useEffect } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { PAGES, usePage } from "../../providers/tests.provider";
import { Title } from "../../components/typography";
import { Tile } from "../../components/tile";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { useNavigate } from "react-router-dom";
import { API } from "../../App";
import { Label } from "../../components/label";

const Description = styled.div`
    font-size: 14px;
    color: #7d8093;
`;

export default function TestsList() {
    const auth = useAuth();

    const [loading, setLoading] = useState(true);

    const [tests, setTests] = useState([]);

    useEffect(() => {
        axios.get(API + 'test').then((res) => {
            setTests(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
            setLoading(false);
        });
    }, [auth?.user?.id])

    const page = usePage();

    const navigate = useNavigate();

    const getTest = (test: any) => {
        const now = new Date();
        const start = new Date(test.loginTimeStart);
        const end = new Date(test.loginTimeEnd);
        return (
            <tr key={test.id}>
                <td>{test.name}</td>
                <td>{test.questions.length}</td>
                <td>{test.students.length}</td>
                <td>{now < start || now >= end ? <Label inactive>nieaktywny</Label> : <Label active>aktywny</Label>}</td>
                <td>
                    <Button onClick={() => navigate('/' + test.id)}>Link</Button>
                    <Button onClick={() => { page.setTestId(test.id); page.setPage(PAGES.DETAILS) }}>Otwórz</Button>
                    <Button onClick={() => { page.setTestId(test.id); page.setPage(PAGES.EDIT) }}>Edytuj</Button>
                    <Button className="danger" onClick={() => removeTest(test.id)}>Usuń</Button>
                </td>
            </tr>
        )
    }

    const removeTest = (testId: any) => {
        setLoading(true);
        axios.delete(API + 'test/' + testId).then((res) => {
            axios.get(API + 'test').then((res) => {
                setTests(res.data.filter((t: any) => t.teacher.id === auth?.user?.id));
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
                <Footer>
                    <Button className='success' onClick={() => page.setPage(PAGES.ADD)}>Stworz nowy test</Button>
                </Footer>
            </Tile>
        )
    )
}
