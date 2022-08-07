import { createContext, useContext, useState } from "react";
import StudentAdd from "../pages/students/student-add.page";
import StudentDetails from "../pages/students/student-details.page";
import StudentEdit from "../pages/students/student-edit.page";
import StudentsList from "../pages/students/students-list.page";

const StudentsContext = createContext();

export const PAGES = {
    LIST: <StudentsList/>,
    DETAILS: <StudentDetails/>,
    EDIT: <StudentEdit/>,
    ADD: <StudentAdd/>
}

export const StudentsProvider = () => {

    const [page, setPage] = useState(PAGES.LIST);
    const [testId, setTestId] = useState();
    const [studentId, setStudentId] = useState();

    return <StudentsContext.Provider value={{page, setPage, testId, setTestId, studentId, setStudentId}}>
        {page}
    </StudentsContext.Provider>
}

export const usePage = () => useContext(StudentsContext);
