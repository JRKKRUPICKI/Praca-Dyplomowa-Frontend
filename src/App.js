import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import QuestionListPage from './pages/QuestionListPage';
import QuestionPage from './pages/QuestionPage';
import QuestionAddPage from './pages/QuestionAddPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import { AuthProvider } from './auth/Auth';
import RequireAuth from './auth/RequireAuth';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentTestPage from './pages/StudentTestPage';
import LogsPage from './pages/LogsPage';
import Tests from './pages/tests';
import Students from './pages/students';

function App() {
  return (
    <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<TeacherLoginPage/>}/>
              <Route path=':testId' element={<StudentLoginPage/>}/>
              {/* <Route path='tests' element={<RequireAuth><HomePage/></RequireAuth>}/> */}
              <Route path='tests' element={<RequireAuth><Tests/></RequireAuth>}/>
              <Route path='students' element={<RequireAuth><Students/></RequireAuth>}/>
              <Route path='tests/:testId/questions' element={<RequireAuth><QuestionListPage/></RequireAuth>}/>
              <Route path='tests/:testId/questions/:questionId' element={<RequireAuth><QuestionPage/></RequireAuth>}/>
              <Route path='tests/:testId/questions/add' element={<RequireAuth><QuestionAddPage/></RequireAuth>}/>
              <Route path='tests/:testId/students/:studentId/test' element={<RequireAuth><StudentTestPage/></RequireAuth>}/>
              <Route path='tests/:testId/students/:studentId/logs' element={<RequireAuth><LogsPage/></RequireAuth>}/>
              <Route path='*' element={<>404</>}/>
            </Routes>
          </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
