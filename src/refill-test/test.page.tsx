import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import styled from "styled-components";
import { API } from "../App";
import { AnswerNoCorrect, QuestionNoCorrect, StudentAnswer, Test } from "../models";

const Container = styled.div`
    margin: 16px;
`;

export default function TestPage({ user, setUser }: any) {

    const [data, setData] = useState<Test>();
    const [loading, setLoading] = useState(true);

    const params = useParams();

    const testId = params.testId;

    useEffect(() => {
        axios.get(API + 'question/test/' + testId).then((res) => {
            setData(res.data);
            setLoading(false);
        });
    }, [testId])

    if (!testId) {
        return <div>'ERROR'</div>
    }

    if (loading || !data) {
        return <div>Loading</div>
    }

    function MyTimer({ expiryTimestamp }: any) {
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
        } = useTimer({
            expiryTimestamp, onExpire: () => {
                alert('Koniec czasu, odpowiedzi zostały automatycznie przesłane');
                setUser();
            }
        });

        return (
            <div style={{ textAlign: 'center' }} className='timer'>
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

    let studentAnswer: StudentAnswer[] = [];

    const setAnswer = (questionId: number, answerId: number) => {
        axios.post(API + 'logs', {
            studentId: user.id,
            testId: parseInt(testId),
            questionId: questionId,
            answerId: answerId,
            datetime: Date.now(),
            actionType: 0
        }).catch((err) => {
            alert('Problem z zapisem logów');
        })
        for (let i = 0; i < studentAnswer.length; i++) {
            if (studentAnswer[i].questionId === questionId) {
                studentAnswer[i].answerId = answerId;
                return;
            }
        }
        const newAnswer = {
            testId: parseInt(testId),
            questionId: questionId,
            answerId: answerId,
            studentId: user.id
        }
        studentAnswer.push(newAnswer);
        unselectBadQuestion(questionId);
    }

    const toggleAnswer = (questionId: number, answerId: number) => {
        if (studentAnswer.filter(sa => sa.questionId === questionId && sa.answerId === answerId).length > 0) {
            const newStudentAnswer = [];
            for (let i = 0; i < studentAnswer.length; i++) {
                if (studentAnswer[i].questionId === questionId && studentAnswer[i].answerId === answerId) {
                    continue;
                }
                newStudentAnswer.push(studentAnswer[i]);
            }
            studentAnswer = newStudentAnswer;
            axios.post(API + 'logs', {
                studentId: user.id,
                testId: parseInt(testId),
                questionId: questionId,
                answerId: answerId,
                datetime: Date.now(),
                actionType: 2
            }).catch((err) => {
                alert('Problem z zapisem logów');
            })
            studentAnswer.filter(answer => answer.questionId === questionId).length === 0 && selectBadQuestion(questionId);
            return;
        }
        const newAnswer = {
            testId: parseInt(testId),
            questionId: questionId,
            answerId: answerId,
            studentId: user.id
        }
        studentAnswer.push(newAnswer);
        axios.post(API + 'logs', {
            studentId: user.id,
            testId: parseInt(testId),
            questionId: questionId,
            answerId: answerId,
            datetime: Date.now(),
            actionType: 1
        }).catch((err) => {
            alert('Problem z zapisem logów');
        })
        unselectBadQuestion(questionId);
    }

    const saveAnswers = (e: any) => {
        e.preventDefault();
        if (!areAnswersSelected()) return;
        axios.post(API + 'studentanswer/all', { answers: studentAnswer }).then((res) => {
            alert('Odpowiedzi zapisane');
        }).catch((err) => {
            alert('Problem z zapisem odpowiedzi');
        })
        setUser();
    }

    const areAnswersSelected = () => {
        const questionsToCheck = [...data.questions];
        studentAnswer.forEach(answer => {
            const questionIndex = questionsToCheck.findIndex((question: any) => question.id === answer.questionId);
            if (questionIndex >= 0) questionsToCheck.splice(questionIndex, 1);
        });
        data.questions.forEach((question: any) => {
            let element = document.getElementById(question.id);
            if (element) element.style.border = 'none';
        })
        questionsToCheck.forEach((question: any) => {
            let element = document.getElementById(question.id);
            if (element) element.style.border = '1px solid #FF0000';
        })
        return questionsToCheck.length === 0;
    }

    const selectBadQuestion = (questionId: any) => {
        let element = document.getElementById(questionId);
        if (element) element.style.border = '1px solid #FF0000';
    }

    const unselectBadQuestion = (questionId: any) => {
        let element = document.getElementById(questionId);
        if (element) element.style.border = 'none';
    }

    return (
        <Container>
            <MyTimer expiryTimestamp={testTime} />
            {data.questions.map((q: QuestionNoCorrect) => <div key={q.id} className='questionBox' id={q.id + ''}>
                <div className='question'>{q.name}</div>
                {!q.type ? (
                    q.answers.map((a: AnswerNoCorrect) => (
                        <label key={a.id} className='answer'>
                            <input type='radio' id={'a-' + a.id} name={'q-' + q.id} value={a.id} onClick={() => setAnswer(q.id, a.id)} />
                            <div>{a.name}</div>
                        </label>
                    ))
                ) : (
                    q.answers.map(a => (
                        <label key={a.id} className='answer'>
                            <input type='checkbox' id={'a-' + a.id} name={'a-' + a.id} value={a.id} onClick={() => toggleAnswer(q.id, a.id)} />
                            <div>{a.name}</div>
                        </label>
                    ))
                )}
            </div>)}
            <button onClick={(e) => saveAnswers(e)} className='save'>Zapisz odpowiedzi</button>
        </Container>
    );
}
