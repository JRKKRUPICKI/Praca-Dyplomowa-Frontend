import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function AnswerAddForm(props){

    const params = useParams();

    const [nameField, setNameField] = useState('');
    const [correctField, setCorrectField] = useState(false);

    const [nameError, setNameError] = useState('');
    const [correctError, setCorrectError] = useState('');

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
        else setNameError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        alert(nameField + ':' + correctField);
        axios.post('http://localhost:4000/answer', {
            name: nameField,
            correct: correctField,
            questionId: parseInt(params.questionId)
        }).then((res) => {
            alert('OK');
            props.onAdd();
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return (
        <div>
            Dodaj nową odpowiedź:
            <form onSubmit={null}>
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
            </form>
        </div>
    );
}
