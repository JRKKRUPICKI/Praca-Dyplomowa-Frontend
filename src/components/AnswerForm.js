import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AnswerForm(props){

    const [loading, setLoading] = useState(true);

    const [answerData, setAnswerData] = useState([]);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/answer/' + props.answerId).then((res) => {
            setAnswerData(res.data);
            setNameField(res.data.name);
            setCorrectField(res.data.correct);
            setLoading(false);
        });
        
    }, [params])

    const [nameField, setNameField] = useState();
    const [correctField, setCorrectField] = useState();

    const [nameError, setNameError] = useState();
    const [correctError, setCorrectError] = useState();

    const validate = () => {
        let valid = true;
        if(!nameField){
            setNameError('Brak odpowiedzi');
            valid = false;
        }
        else if(nameField !== nameField.trim()){
            setNameError('Nieprawidłowa odpowiedź');
            valid = false;
        }
        else if(nameField === answerData.name){
            setNameError('Odpowiedź jest taka sama');
            valid = false;
        }
        else setNameError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        alert(nameField);
        axios.patch('http://localhost:4000/answer/' + answerData.id, {
            name: nameField,
            correct: correctField
        }).then((res) => {
            alert('OK');
            setLoading(true);
            axios.get('http://localhost:4000/answer/' + props.answerId).then((res) => {
                setAnswerData(res.data);
                setNameField(res.data.name);
                setCorrectField(res.data.correct);
                setLoading(false);
            });
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    const deletee = () => {
        axios.delete('http://localhost:4000/answer/' + answerData.id).then((res) => {
            alert('DELETED');
            props.onDelete();
        })
    }

    return loading ? <div>Loading</div> : (
        <div>
            <form>
                <label>
                    <input type='text' value={nameField} onChange={(e) => setNameField(e.target.value)}/>
                    {nameError && <div>{nameError}</div>}
                </label>
                <label>
                    Odpowiedź poprawna?
                    {correctField ?
                        <input type='checkbox' checked onChange={(e) => setCorrectField(!correctField)}/>
                        : <input type='checkbox' onChange={(e) => setCorrectField(!correctField)}/>
                    }
                    {correctError && <div>{correctError}</div>}
                </label>
                <button type='button' onClick={() => handleSubmit()}>Zapisz</button>
                <button type='button' onClick={() => deletee()}>Usuń</button>
            </form>
        </div>
    );
}
