import { createContext, useContext, useState } from "react";
import AnswerAdd from "../pages/questions/answer-add.page";
import AnswerEdit from "../pages/questions/answer-edit.page";
import QuestionAdd from "../pages/questions/question-add.page";
import QuestionDetails from "../pages/questions/question-details.page";
import QuestionEdit from "../pages/questions/question-edit.page";
import QuestionList from "../pages/questions/question-list.page";

const QuestionsContext = createContext();

export const PAGES = {
    LIST: <QuestionList />,
    DETAILS: <QuestionDetails />,
    EDIT: <QuestionEdit />,
    ADD: <QuestionAdd />,
    EDIT_ANSWER: <AnswerEdit />,
    ADD_ANSWER: <AnswerAdd />
}

export const QuestionsProvider = () => {

    const [page, setPage] = useState(PAGES.LIST);
    const [testId, setTestId] = useState();
    const [questionId, setQuestionId] = useState();
    const [answerId, setAnswerId] = useState();

    return <QuestionsContext.Provider value={{
        page,
        setPage,
        testId,
        setTestId,
        questionId,
        setQuestionId,
        answerId,
        setAnswerId
    }}>
        {page}
    </QuestionsContext.Provider>
}

export const usePage = () => useContext(QuestionsContext);
