import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDatetime } from "../utils/TimeUtils";

export default function LogsPage() {

    const [loading, setLoading] = useState(true);

    const [logs, setLogs] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://54.37.232.57/api/logs/' + params.studentId).then((res) => {
            setLogs(res.data);
        }).then(res => {
            setLoading(false);
        })
    }, [params])

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId + '/students'}><button>Powrót</button></Link>
            <br/>
            Test: {logs[0].test.name}
            <br/>
            Student: {logs[0].student.login}
            <center>
            <br/>
            <table>
                <thead>
                    <tr>
                        <td>Data Czas</td>
                        <td>Typ akcji</td>
                        <td>Odpowiedź</td>
                        <td>Pytanie</td>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(l => <tr key={l.id}>
                        <td>{formatDatetime(new Date(l.datetime), true, true)}</td>
                        <td>{l.actionType === 0 ? 'Wybranie odpowiedzi' : (l.actionType === 1 ? 'Zaznaczenie odpowiedzi' : (l.actionType === 2 ? 'Odznaczenie odpowiedzi' : '-'))}</td>
                        <td>{l.answer.name}</td>
                        <td>{l.question.name}</td>
                    </tr>)}
                </tbody>
            </table>
            </center>
        </div>
    );
}
