import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function TestListPage() {

    const auth = useAuth();

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/test').then((res) => {
            setData(res.data.filter(t => t.teacher.id === auth.user.id));
            setLoading(false);
        })
    }, [])

    const getTestListItem = (test) => {
        return(
            <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.name}</td>
                <td>{test.questions.length}</td>
                <td>{test.students.length}</td>
                <td><Link to={'' + test.id}><button>Otwórz</button></Link></td>
                <td><Link to={'' + test.id + '/edit'}><button>Edytuj</button></Link></td>
                <td><button onClick={() => remove(test.id)}>Usuń</button></td>
            </tr>
        )
    }

    const remove = (testId) => {
        setLoading(true);
        axios.delete('http://localhost:4000/test/' + testId).then((res) => {
            getData();
        })
    }

    const getData = () => {
        setLoading(true);
        axios.get('http://localhost:4000/test').then((res) => {
            setData(res.data.filter(t => t.teacher.id === auth.user.id));
            setLoading(false);
        })
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to='add'><button>Dodaj test</button></Link>
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Nazwa</td>
                        <td>Liczba pytań</td>
                        <td>Liczba studentów</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {data.map(test => getTestListItem(test))}
                </tbody>
            </table>
        </div>
    );
}
