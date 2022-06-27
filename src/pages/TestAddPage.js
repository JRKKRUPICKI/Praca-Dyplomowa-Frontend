import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function TestAddPage() {

    const auth = useAuth();
    const navigate = useNavigate();

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState();

    const validate = () => {
        let valid = true;
        if(!nameField){
            setNameError('Brak nazwy testu');
            valid = false;
        }
        else if(nameField !== nameField.trim()){
            setNameError('Nieprawidłowa nazwa testu');
            valid = false;
        }
        else setNameError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        axios.post('http://localhost:4000/test', {
            name: nameField,
            teacherId: auth.user.id
        }).then((res) => {
            setNameField('');
            navigate('/tests');
        }).catch((err) => {
            alert(err.response.data.message)
        })
    }

    return (
        <div>
            <Link to={'/tests'}><button>Powrót</button></Link>
            <form>
                <label>
                    Nazwa testu:
                    <input type='text' value={nameField} onChange={(e) => setNameField(e.target.value)}/>
                    {nameError && <div>{nameError}</div>}
                </label>
                <button type='button' onClick={() => handleSubmit()}>Dodaj</button>
            </form>
        </div>
    );
}
