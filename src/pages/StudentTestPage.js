import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function StudentTestPage() {

    const [loading, setLoading] = useState(true);

    const [test, setTest] = useState([]);

    const params = useParams();

    useEffect(() => {
        let q;
        let a;
        Promise.all([
            axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
                setTest(res.data);
            }),
            axios.get('http://localhost:4000/question/test/' + params.testId).then((res) => {
                q = res.data;
            }),
            axios.get('http://localhost:4000/studentanswer/' + params.studentId).then((res) => {
                a = res.data;
            })
        ]).then(res => {
            checkAnswers(q, a);
            setLoading(false);
        })
    }, [params])

    // odpowiedz wybrana - podkreslenie
    // odpowiedz poprawna - pogrubienie
    // odpowiedz wybrana i poprawna - zielona
    // odpowiedz niewybrana i niepoprawna - zielona
    // odpowiedz wybrana i niepoprawna - czerwona
    // odpowiedz niewybrana i poprawna - czerwona

    const [checkedList, setCheckedList] = useState([]);

    const checkAnswers = (questions, answers) => {
        let checked = [];
        if(answers.length === 0) return;
        for(let i = 0; i < questions.length; i++){
            let newQuestion = {};
            newQuestion.id = questions[i].id;
            newQuestion.name = questions[i].name;
            newQuestion.correctAnswers = true;
            newQuestion.answers = [];
            for(let j = 0; j < questions[i].answers.length; j++){
                let newAnswer = {};
                newAnswer.id = questions[i].answers[j].id;
                newAnswer.name = questions[i].answers[j].name;
                newAnswer.select = answers.filter(an => an.answer.id === questions[i].answers[j].id).length > 0;
                newAnswer.correct = questions[i].answers[j].correct;
                if((newAnswer.select && !newAnswer.correct) || (!newAnswer.select && newAnswer.correct)) newQuestion.correctAnswers = false;
                newQuestion.answers.push(newAnswer);
            }
            checked.push(newQuestion);
        }
        setCheckedList(checked);
    }

    return loading ? <div>Loading</div> : (
        <div>
            <Link to={'/tests/' + params.testId + '/students'}><button>Powrót</button></Link>
            <br/>
            Test: {test.name}
            <br/>
            Student: {test.students.filter(s => s.id === parseInt(params.studentId))[0].login}
            <center>
            <br/>

            {checkedList.length === 0 ? 'Student nie przesłał odpowiedzi' : checkedList.filter(q => q.correctAnswers).length + '/' + checkedList.length}
            <br/><br/>
            {/*
            {answers.length > 0 ? (
                questions.map(q => <>
                    <div key={q.id}>{q.name}</div>
                    {q.answers.map(a => <>
                        <div key={a.id}>
                            {answers.filter(an => an.question.id === q.id && an.answer.id === a.id).length > 0 ? (a.correct ? <span style={{background:'lightgreen'}}><b><u>{a.name}</u></b></span> : <span style={{background:'red'}}><u>{a.name}</u></span>) : a.correct ? <span style={{background:'red'}}><b>{a.name}</b></span> : <span style={{background:'lightgreen'}}>{a.name}</span>}
                        </div>
                    </>)}
                </>)
            ) : (
                <>Student nie przesłał jeszcze odpowiedzi</>
            )}
            */}
            {checkedList.map(q => <div key={q.id}>
                <div>{q.name}</div>
                {q.answers.map(a => <div key={a.id}>
                    {a.select ? (a.correct ? <span style={{background:'lightgreen'}}><b><u>{a.name}</u></b></span> : <span style={{background:'red'}}><u>{a.name}</u></span>) : a.correct ? <span style={{background:'red'}}><b>{a.name}</b></span> : <span style={{background:'lightgreen'}}>{a.name}</span>}
                </div>)}
            </div>)}
            </center>
        </div>
    );
}
