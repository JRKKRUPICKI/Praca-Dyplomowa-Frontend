import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDatetime } from "../utils/TimeUtils";

export default function StudentListPage() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setData(res.data.students);
            setLoading(false);
        })
    }, [params])

    const deletee = (studentId) => {
        axios.delete('http://localhost:4000/student/' + studentId).then((res) => {
            alert('OK');
            setLoading(true);
            axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
                setData(res.data.students);
                setLoading(false);
            })
        })
    }

    const getStudentListItem = (student) => {
        return(
            <tr key={student.id}>
                <td>{student.login}</td>
                <td>{student.password}</td>
                <td>{student.active ? 'aktywne' : 'nieaktywne'}</td>
                <td>{student.status === 0 ? 'nieprzesłane' : 'przesłane (' + formatDatetime(student.status) + ')'}</td>
                <td><Link to={'' + student.id}><button>Edytuj</button></Link></td>
                <td><button onClick={() => deletee(student.id)}>Usuń</button></td>
            </tr>
        )
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId}><button>Powrót</button></Link>
            <Link to='add'><button>Dodaj studenta</button></Link>
            <table>
                <thead>
                    <tr>
                        <td>Login</td>
                        <td>Hasło</td>
                        <td>Konto</td>
                        <td>Odpowiedzi</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {data.map(student => getStudentListItem(student))}
                </tbody>
            </table>
        </div>
    );
}
