export interface Test {
    id: number,
    name: string,
    time: number,
    loginTimeStart: number,
    loginTimeEnd: number,
    questions: [],
    students: []
}

export interface StudentAnswer {
    questionId: number,
    answerId: number
}

export interface Question {
    id: number,
    name: string,
    type: boolean,
    answers: Answer[]
}

export interface QuestionNoCorrect {
    id: number,
    name: string,
    type: boolean,
    answers: AnswerNoCorrect[]
}

export interface Answer {
    id: number,
    name: string,
    correct: boolean
}

export interface AnswerNoCorrect {
    id: number,
    name: string
}

export interface Student {
    id: number,
    login: string,
    password: string,
    active: boolean,
    status: number
}
