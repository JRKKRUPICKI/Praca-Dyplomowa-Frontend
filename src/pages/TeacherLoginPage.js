import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

export default function TeacherLoginPage() {

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.path || '/tests';

    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();

    const validate = () => {
        let valid = true;
        if(!emailField){
            setEmailError('Podaj adres e-mail');
            valid = false;
        }
        else if(emailField !== emailField.trim()){
            setEmailError('Podaj prawidłowy adres e-mail');
            valid = false;
        }
        else setEmailError('');
        if(!passwordField){
            setPasswordError('Podaj hasło');
            valid = false;
        }
        else if(passwordField !== passwordField.trim()){
            setPasswordError('Podaj prawidłowe hasło');
            valid = false;
        }
        else setPasswordError('');
        return valid;
    }

    const handleSubmit = () => {
        if(!validate()) return;
        axios.post('http://localhost:4000/teacher/login', {
            email: emailField,
            password: passwordField
        }).then((res) => {
            auth.login(res.data);
            navigate(redirectPath, {replace: true});
        }).catch((err) => {
            alert(err.response.data.message);
        })
    }

    return (
        <div>
            <form>
                <label>
                    Adres e-mail:
                    <input type='text' value={emailField} onChange={(e) => setEmailField(e.target.value)}/>
                    {emailError && <div>{emailError}</div>}
                </label>
                <label>
                    Hasło:
                    <input type='password' value={passwordField} onChange={(e) => setPasswordField(e.target.value)}/>
                    {passwordError && <div>{passwordError}</div>}
                </label>
                <button type='button' onClick={() => handleSubmit()}>Zaloguj</button>
            </form>
        </div>
    );
}
