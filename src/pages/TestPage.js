import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

    const toHTMLinputDatetime = (datetime) => {
        let dt = new Date(datetime);
        return dt.getFullYear() + '-' + (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + dt.getDate() + 'T' + dt.getHours() + ':' + dt.getMinutes();
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to='/tests'><button>Powrót</button></Link>
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
                        <td>Czas logowania</td><td>{toHTMLinputDatetime(new Date(data.loginTimeStart)) + ' - ' + toHTMLinputDatetime(new Date(data.loginTimeEnd))}</td>
                    </tr>
                </tbody>
            </table>
            <Link to={'questions'}><button>Pytania</button></Link>
            <Link to={'students'}><button>Studenci</button></Link>
        </div>
    );
}
