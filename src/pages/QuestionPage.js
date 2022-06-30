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
            setTypeField(res.data.type);
            setLoading(false);
        });
        
    }, [params])

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState('');

    const [typeField, setTypeField] = useState(false);

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
        //else if(nameField === question.name){
            //setNameError('Pytanie jest takie samo');
            //valid = false;
        //}
        else setNameError('');
        return valid;
    }

    const handleSubmit = (e) => {
        if(!validate()) return;
        axios.patch('http://localhost:4000/question/' + question.id, {
            name: nameField,
            type: typeField
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
                <label htmlFor='type'>Pytanie wielokrotnego wyboru?</label>
                {typeField ? (
                    <input type='checkbox' id='type' name='type' checked onChange={(e) => setTypeField(e.target.checked)}/>
                ) : (
                    <input type='checkbox' id='type' name='type' onChange={(e) => setTypeField(e.target.checked)}/>
                )}
                <button type='button' onClick={() => handleSubmit()}>Zapisz</button>
            </form>
            {question.answers.map(answer => <AnswerForm answerId={answer.id} onDelete={getData} key={answer.id}/>)}
            <AnswerAddForm onAdd={getData}/>
        </div>
    );
}
