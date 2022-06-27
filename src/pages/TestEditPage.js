import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function TestEditPage() {

    const [loading, setLoading] = useState(true);

    const [test, setTest] = useState([]);

    const [nameField, setNameField] = useState('');
    const [nameError, setNameError] = useState();

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setTest(res.data);
            setNameField(res.data.name);
            setLoading(false);
        });
        
    }, [params])

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
        else if(nameField === test.name){
            setNameError('Nazwa testu jest taka sama');
            valid = false;
        }
        else setNameError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        axios.patch('http://localhost:4000/test/' + test.id, {
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
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setTest(res.data);
            setNameField(res.data.name);
            setLoading(false);
        });
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests'}><button>Powrót</button></Link>
            <form>
                <label>
                    Nazwa testu:
                    <input type='text' value={nameField} onChange={(e) => setNameField(e.target.value)}/>
                    {nameError && <div>{nameError}</div>}
                </label>
                <Link to={'/tests'}><button>Anuluj</button></Link>
                <button type='button' onClick={() => handleSubmit()}>Zapisz</button>
            </form>
        </div>
    );
}
