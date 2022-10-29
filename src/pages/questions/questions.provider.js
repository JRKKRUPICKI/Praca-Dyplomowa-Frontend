import { createContext, useContext, useState } from "react";
import AnswerAdd from "./answer-add.page";
import AnswerEdit from "./answer-edit.page";
import QuestionAdd from "./question-add.page";
import QuestionDelete from "./question-delete.page";
import QuestionDetails from "./question-details.page";
import QuestionEdit from "./question-edit.page";
import QuestionList from "./question-list.page";

const QuestionsContext = createContext();

export const PAGES = {
    LIST: <QuestionList />,
    DETAILS: <QuestionDetails />,
    EDIT: <QuestionEdit />,
    ADD: <QuestionAdd />,
    DELETE: <QuestionDelete />,
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
