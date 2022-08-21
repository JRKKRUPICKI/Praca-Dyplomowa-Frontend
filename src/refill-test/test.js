import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";

export default function Test({ user, setUser }){

    const [data, setData] = useState();
    const [questionData, setQuestionData] = useState();
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(() => {
        axios.get('http://localhost:4000/test/' + params.testId).then((res) => {
            setData(res.data);
            axios.get('http://localhost:4000/question/test/' + params.testId).then((res) => {
                setQuestionData(res.data);
                setLoading(false);
            });
        })
    }, [params.testId])

    function MyTimer({ expiryTimestamp }) {
        const {
            seconds,
            minutes,
            hours,
            //days,
            //isRunning,
            //start,
            //pause,
            //resume,
            //restart,
        } = useTimer({ expiryTimestamp, onExpire: () => {
            alert('Koniec czasu, odpowiedzi zostały automatycznie przesłane');
            setUser();
        }});

        return (
            <div style={{textAlign: 'center'}} className='timer'>
                <div className='header'>Czas na przesłanie odpowiedzi</div>
                <div className='time'>
                    <span>{hours < 10 ? '0' + hours : hours}</span>:<span>{minutes < 10 ? '0' + minutes : minutes}</span>:<span>{seconds < 10 ? '0' + seconds : seconds}</span>
                </div>
            </div>
        );
    }

    const testTime = () => {
        const time = new Date();
        time.setMinutes(time.getMinutes() + data.time);
        return time;
    }

    const loadQuestions = () => {
        let list = [];
        questionData.forEach(q => {
            let b = [];
            b.id = q.id;
            b.name = q.name;
            b.type = q.type;
            b.answers = [];
            q.answers.forEach(a => {
                let c = [];
                c.id = a.id;
                c.name = a.name;
                b.answers.push(c);
            });
            list.push(b);
        });
        return list;
    }

    let studentAnswer = [];

    const setAnswer = (questionId, answerId) => {
        axios.post('http://localhost:4000/logs', {
            studentId: user.id,
            testId: parseInt(params.testId),
            questionId: questionId,
            answerId: answerId,
            datetime: Date.now(),
            actionType: 0
        }).catch((err) => {
            alert('Problem z zapisem logów');
        })
        for(let i = 0; i < studentAnswer.length; i++){
            if(studentAnswer[i].questionId === questionId){
                studentAnswer[i].answerId = answerId;
                return;
            }
        }
        const newAnswer = {
            questionId: questionId,
            answerId: answerId
        }
        studentAnswer.push(newAnswer);
    }

    const toggleAnswer = (questionId, answerId) => {
        if(studentAnswer.filter(sa => sa.questionId === questionId && sa.answerId === answerId).length > 0){
            const newStudentAnswer = [];
            for(let i = 0; i < studentAnswer.length; i++){
                if(studentAnswer[i].questionId === questionId && studentAnswer[i].answerId === answerId){
                    continue;
                }
                newStudentAnswer.push(studentAnswer[i]);
            }
            studentAnswer = newStudentAnswer;
            axios.post('http://localhost:4000/logs', {
                studentId: user.id,
                testId: parseInt(params.testId),
                questionId: questionId,
                answerId: answerId,
                datetime: Date.now(),
                actionType: 2
            }).catch((err) => {
                alert('Problem z zapisem logów');
            })
            return;
        }
        const newAnswer = {
            questionId: questionId,
            answerId: answerId
        }
        studentAnswer.push(newAnswer);
        axios.post('http://localhost:4000/logs', {
            studentId: user.id,
            testId: parseInt(params.testId),
            questionId: questionId,
            answerId: answerId,
            datetime: Date.now(),
            actionType: 1
        }).catch((err) => {
            alert('Problem z zapisem logów');
        })
    }

    const saveAnswers = (e) => {
        e.preventDefault();
        const studentId = user.id;
        const testId = data.id;
        studentAnswer.forEach(a => {
            axios.post('http://localhost:4000/studentanswer', {
                studentId: studentId,
                testId: testId,
                questionId: a.questionId,
                answerId: a.answerId
            }).then((res) => {
                alert('Odpowiedzi zapisane');
            }).catch((err) => {
                alert('Problem z zapisem odpowiedzi');
            })
        });
        setUser();
    }

    return loading ? <div>Loading</div> : (
        <div>
            <MyTimer expiryTimestamp={testTime}/>
            {loadQuestions().map(q => <div key={q.id} className='questionBox'>
                <div className='question'>{q.name}</div>
                {!q.type ? (
                    q.answers.map(a => <div key={a.id} className='answer'>
                        <input type='radio' id={a.id} name={q.id} value={a.id} onClick={() => setAnswer(q.id, a.id)}/>
                        {a.name}
                    </div>)
                ) : (
                    q.answers.map(a => <div key={a.id} className='answer'>
                        <input type='checkbox' id={a.id} name={a.id} value={a.id} onClick={() => toggleAnswer(q.id, a.id)}/>
                        {a.name}
                    </div>)
                )}
            </div>)}
            <button onClick={(e) => saveAnswers(e)} className='save'>Zapisz odpowiedzi</button>
        </div>
    );
}