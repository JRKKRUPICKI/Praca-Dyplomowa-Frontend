import { createContext, useContext, useState } from "react";
import TestAdd from "../pages/tests/test-add.page";
import TestDetails from "../pages/tests/test-details.page";
import TestEdit from "../pages/tests/test-edit.page";
import TestsList from "../pages/tests/test-list.page";

const TestsContext = createContext();

export const PAGES = {
    LIST: <TestsList />,
    DETAILS: <TestDetails />,
    EDIT: <TestEdit />,
    ADD: <TestAdd />
}

export const TestsProvider = () => {

    const [page, setPage] = useState(PAGES.LIST);
    const [testId, setTestId] = useState();

    return <TestsContext.Provider value={{ page, setPage, testId, setTestId }}>
        {page}
    </TestsContext.Provider>
}

export const usePage = () => useContext(TestsContext);
