import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/Auth';
import RequireAuth from './auth/RequireAuth';
import LogsPage from './pages/LogsPage';
import Tests from './pages/tests';
import Students from './pages/students';
import TeacherLoginPage from './pages/teacher-login.page';
import Questions from './pages/questions';
import Results from './pages/results';
import Dashboard from './pages/dashboard';
import NotFoundPage from './pages/not-found.page';
import Statistics from './pages/statistics';
import Main from './refill-test/main';

export const API = 'http://localhost:4000/';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TeacherLoginPage />} />
          <Route path=':testId' element={<Main />} />
          <Route path='dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='tests' element={<RequireAuth><Tests /></RequireAuth>} />
          <Route path='students' element={<RequireAuth><Students /></RequireAuth>} />
          <Route path='questions' element={<RequireAuth><Questions /></RequireAuth>} />
          <Route path='results' element={<RequireAuth><Results /></RequireAuth>} />
          <Route path='statistics' element={<RequireAuth><Statistics /></RequireAuth>} />
          <Route path='tests/:testId/students/:studentId/logs' element={<RequireAuth><LogsPage /></RequireAuth>} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
