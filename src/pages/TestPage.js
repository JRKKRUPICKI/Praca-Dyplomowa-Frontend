import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDatetime } from "../utils/TimeUtils";

export default function TestPage() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setData(res.data);
            setLoading(false);
        })
    }, [params])

    return loading ? <div>Loading</div> : (
        <div>
            <Link to='/tests'><button>Powrót</button></Link>
            <Link to={'/tests/' + params.testId + '/edit'}><button>Edytuj</button></Link>
            <table>
                <tbody>
                    <tr>
                        <td>ID</td><td>{data.id}</td>
                    </tr>
                    <tr>
                        <td>Nazwa</td><td>{data.name}</td>
                    </tr>
                    <tr>
                        <td>Liczba pytań</td><td>{data.questions.length}</td>
                    </tr>
                    <tr>
                        <td>Czas trwania</td><td>{data.time} min</td>
                    </tr>
                    <tr>
                        <td>Czas logowania</td><td>{formatDatetime(new Date(data.loginTimeStart)) + ' - ' + formatDatetime(new Date(data.loginTimeEnd))}</td>
                    </tr>
                </tbody>
            </table>
            <Link to={'questions'}><button>Pytania</button></Link>
            <Link to={'students'}><button>Studenci</button></Link>
        </div>
    );
}
