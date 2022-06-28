import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TestListPage from './pages/TestListPage';
import TestPage from './pages/TestPage';
import QuestionListPage from './pages/QuestionListPage';
import StudentListPage from './pages/StudentListPage';
import StudentPage from './pages/StudentPage';
import StudentAddPage from './pages/StudentAddPage';
import QuestionPage from './pages/QuestionPage';
import QuestionAddPage from './pages/QuestionAddPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import { AuthProvider } from './auth/Auth';
import RequireAuth from './auth/RequireAuth';
import TestAddPage from './pages/TestAddPage';
import TestEditPage from './pages/TestEditPage';
import StudentLoginPage from './pages/StudentLoginPage';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TeacherLoginPage/>}/>
          <Route path=':testId' element={<StudentLoginPage/>}/>
          <Route path='tests' element={<RequireAuth><TestListPage/></RequireAuth>}/>
          <Route path='tests/add' element={<RequireAuth><TestAddPage/></RequireAuth>}/>
          <Route path='tests/:testId' element={<RequireAuth><TestPage/></RequireAuth>}/>
          <Route path='tests/:testId/edit' element={<RequireAuth><TestEditPage/></RequireAuth>}/>
          <Route path='tests/:testId/questions' element={<RequireAuth><QuestionListPage/></RequireAuth>}/>
          <Route path='tests/:testId/questions/:questionId' element={<RequireAuth><QuestionPage/></RequireAuth>}/>
          <Route path='tests/:testId/questions/add' element={<RequireAuth><QuestionAddPage/></RequireAuth>}/>
          <Route path='tests/:testId/students' element={<RequireAuth><StudentListPage/></RequireAuth>}/>
          <Route path='tests/:testId/students/:studentId' element={<RequireAuth><StudentPage/></RequireAuth>}/>
          <Route path='tests/:testId/students/add' element={<RequireAuth><StudentAddPage/></RequireAuth>}/>
          <Route path='*' element={<>404</>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
