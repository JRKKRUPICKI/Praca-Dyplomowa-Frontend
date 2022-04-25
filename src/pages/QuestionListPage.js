import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function QuestionListPage() {

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setData(res.data.questions);
            setLoading(false);
        })
    }, [])

    const getQuestionListItem = (question) => {
        return(
            <tr key={question.id}>
                <td>{question.id}</td>
                <td>{question.name}</td>
                <td><Link to={'' + question.id}><button>Edytuj</button></Link></td>
                <td><button>Usuń</button></td>
            </tr>
        )
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId}><button>Powrót</button></Link>
            <button>Dodaj pytanie</button>
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Nazwa</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {data.map(question => getQuestionListItem(question))}
                </tbody>
            </table>
        </div>
    );
}
