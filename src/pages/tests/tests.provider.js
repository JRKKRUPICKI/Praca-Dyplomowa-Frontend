import { createContext, useContext, useState } from "react";
import TestAdd from "./test-add.page";
import TestDetails from "./test-details.page";
import TestEdit from "./test-edit.page";
import TestsList from "./test-list.page";

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
