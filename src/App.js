import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TestListPage from './pages/TestListPage';
import TestPage from './pages/TestPage';
import QuestionListPage from './pages/QuestionListPage';
import StudentListPage from './pages/StudentListPage';
import StudentPage from './pages/StudentPage';
import StudentAddPage from './pages/StudentAddPage';

function App() {

  useEffect(() => {
    console.log('MOUNT');
    return () => console.log('UNMOUNT');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TestListPage/>}/>
        <Route path='tests' element={<TestListPage/>}/>
        <Route path='tests/:testId' element={<TestPage/>}/>
        <Route path='tests/:testId/questions' element={<QuestionListPage/>}/>
        <Route path='tests/:testId/questions/:questionId' element={<TestListPage/>}/>
        <Route path='tests/:testId/students' element={<StudentListPage/>}/>
        <Route path='tests/:testId/students/:studentId' element={<StudentPage/>}/>
        <Route path='tests/:testId/students/add' element={<StudentAddPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
