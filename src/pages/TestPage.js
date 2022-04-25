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
                </tbody>
            </table>
            <Link to={'questions'}><button>Pytania</button></Link>
            <Link to={'students'}><button>Studenci</button></Link>
        </div>
    );
}
