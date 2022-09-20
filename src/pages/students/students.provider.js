import { createContext, useContext, useState } from "react";
import StudentAdd from "./student-add.page";
import StudentDetails from "./student-details.page";
import StudentEdit from "./student-edit.page";
import StudentsList from "./students-list.page";

const StudentsContext = createContext();

export const PAGES = {
    LIST: <StudentsList />,
    DETAILS: <StudentDetails />,
    EDIT: <StudentEdit />,
    ADD: <StudentAdd />
}

export const StudentsProvider = () => {

    const [page, setPage] = useState(PAGES.LIST);
    const [testId, setTestId] = useState();
    const [studentId, setStudentId] = useState();

    return <StudentsContext.Provider value={{ page, setPage, testId, setTestId, studentId, setStudentId }}>
        {page}
    </StudentsContext.Provider>
}

export const usePage = () => useContext(StudentsContext);
