import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../auth/Auth";
import axios from "axios";
import { PAGES, usePage } from "./tests.provider";
import { Description, Title } from "../../components/typography";
import { Tile } from "../../components/tile";
import { Footer } from "../../components/footer";
import { Button } from "../../components/button";
import { API } from "../../App";
import { Label } from "../../components/label";

export default function TestsList() {
    const auth = useAuth();

    const [loading, setLoading] = useState(true);

    const [tests, setTests] = useState([]);

    useEffect(() => {
        axios.get(API + 'test/teacher/' + auth?.user?.id).then((res) => {
            setTests(res.data);
            setLoading(false);
        });
    }, [auth?.user?.id]);

    const page = usePage();

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
                    <Button onClick={() => window.open('/test/' + test.id)}>Otwórz test</Button>
                    <Button onClick={() => { page.setTestId(test.id); page.setPage(PAGES.DETAILS) }}>Szczegóły</Button>
                    <Button onClick={() => { page.setTestId(test.id); page.setPage(PAGES.EDIT) }}>Edytuj</Button>
                    <Button className="danger" onClick={() => { page.setTestId(test.id); page.setPage(PAGES.DELETE) }}>Usuń</Button>
                </td>
            </tr>
        )
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
