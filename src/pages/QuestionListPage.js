import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function QuestionListPage() {

    const [loading, setLoading] = useState(true);

    const [questionList, setQuestionList] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/question').then((res) => {
            setQuestionList(res.data.filter(question => question.test.id === parseInt(params.testId)));
            setLoading(false);
        })
    }, []);

    const remove = (questionId) => {
        setLoading(true);
        axios.delete('http://localhost:4000/question/' + questionId).then((res) => {
            axios.get('http://localhost:4000/question').then((res) => {
                setQuestionList(res.data.filter(question => question.test.id === parseInt(params.testId)));
                setLoading(false);
            })
        })
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId}><button>Powrót</button></Link>
            <Link to='add'><button>Dodaj pytanie</button></Link>
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Nazwa</td>
                        <td>Liczba odpowiedzi</td>
                        <td>Odpowiedzi poprawnych</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {questionList.map(question =>
                        <tr key={question.id}>
                            <td>{question.id}</td>
                            <td>{question.name}</td>
                            <td>{question.answers.length}</td>
                            <td>{question.answers.filter(answer => answer.correct).length}</td>
                            <td><Link to={'' + question.id}><button>Edytuj</button></Link></td>
                            <td><button onClick={() => remove(question.id)}>Usuń</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
