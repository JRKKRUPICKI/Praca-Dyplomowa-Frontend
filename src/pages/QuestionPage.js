import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnswerAddForm from "../components/AnswerAddForm";
import AnswerForm from "../components/AnswerForm";

export default function QuestionPage() {

    const [loading, setLoading] = useState(true);

    const [question, setQuestion] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/question/' + params.questionId).then((res) => {
            setQuestion(res.data);
            setNameField(res.data.name);
            setLoading(false);
        });
        
    }, [params])

    const [nameField, setNameField] = useState('');

    const [nameError, setNameError] = useState('');

    const validate = () => {
        let valid = true;
        if(!nameField){
            setNameError('Brak pytania');
            valid = false;
        }
        else if(nameField !== nameField.trim()){
            setNameError('Nieprawidłowe pytanie');
            valid = false;
        }
        else if(nameField === question.name){
            setNameError('Pytanie jest takie samo');
            valid = false;
        }
        else setNameError('');
        return valid;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!validate()) return;
        alert(nameField);
        axios.patch('http://localhost:4000/question/' + question.id, {
            name: nameField
        }).then((res) => {
            alert('OK');
            getData();
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    const getData = () => {
        setLoading(true);
        axios.get('http://localhost:4000/question/' + params.questionId).then((res) => {
            setQuestion(res.data);
            setNameField(res.data.name);
            setLoading(false);
        });
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId + '/questions'}><button>Powrót</button></Link>
            <form>
                <label>
                    Pytanie:
                    <input type='text' value={nameField} onChange={(e) => setNameField(e.target.value)}/>
                    {nameError && <div>{nameError}</div>}
                </label>
                <button type='button' onClick={() => handleSubmit()}>Zapisz</button>
            </form>
            {question.answers.map(answer => <AnswerForm answerId={answer.id} onDelete={getData}/>)}
            <AnswerAddForm onAdd={getData}/>
        </div>
    );
}
