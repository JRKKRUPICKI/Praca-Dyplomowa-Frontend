import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TestListPage() {

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/test').then((res) => {
            setData(res.data);
        })
    }, [])

    const getTestListItem = (test) => {
        return(
            <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.name}</td>
                <td>{test.questions.length}</td>
                <td>{test.students.length}</td>
                <td><Link to={'' + test.id}><button>Edytuj</button></Link></td>
                <td><button>Usuń</button></td>
            </tr>
        )
    }

    return (
        <div>
            <button>Dodaj test</button>
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
