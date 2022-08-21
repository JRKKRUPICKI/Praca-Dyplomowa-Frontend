import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/Auth';
import RequireAuth from './auth/RequireAuth';
import StudentTestPage from './pages/StudentTestPage';
import LogsPage from './pages/LogsPage';
import Tests from './pages/tests';
import Students from './pages/students';
import TeacherLoginPage from './pages/teacher-login.page';
import Questions from './pages/questions';
import Main from './refill-test/main';
import Results from './pages/results';

function App() {
  return (
    <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<TeacherLoginPage/>}/>
              <Route path=':testId' element={<Main/>}/>
              <Route path='tests' element={<RequireAuth><Tests/></RequireAuth>}/>
              <Route path='students' element={<RequireAuth><Students/></RequireAuth>}/>
              <Route path='questions' element={<RequireAuth><Questions/></RequireAuth>}/>
              <Route path='results' element={<RequireAuth><Results/></RequireAuth>}/>
              <Route path='tests/:testId/students/:studentId/test' element={<RequireAuth><StudentTestPage/></RequireAuth>}/>
              <Route path='tests/:testId/students/:studentId/logs' element={<RequireAuth><LogsPage/></RequireAuth>}/>
              <Route path='*' element={<>404</>}/>
            </Routes>
          </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
