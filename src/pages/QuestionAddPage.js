import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function QuestionAddPage() {

    const params = useParams();

    const [nameField, setNameField] = useState('');

    const [nameError, setNameError] = useState();

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
        else setNameError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        axios.post('http://localhost:4000/question', {
            name: nameField,
            testId: parseInt(params.testId)
        }).then((res) => {
            alert('OK');
            setNameField('');
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return (
        <div>
            <Link to={'/tests/' + params.testId + '/questions'}><button>Powrót</button></Link>
            <form>
                <label>
                    Pytanie:
                    <input type='text' value={nameField} onChange={(e) => setNameField(e.target.value)}/>
                    {nameError && <div>{nameError}</div>}
                </label>
                <button type='button' onClick={() => handleSubmit()}>Dodaj</button>
            </form>
        </div>
    );
}
