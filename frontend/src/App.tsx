import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Subjects from './pages/learn/Subjects';
import SubjectDetail from './pages/learn/SubjectDetail';
import LessonView from './pages/learn/LessonView';
import QuizPage from './pages/learn/QuizPage';
import AssignmentPage from './pages/learn/AssignmentPage';
import LiveClasses from './pages/live/LiveClasses';
import LiveClassRoom from './pages/live/LiveClassRoom';
import Recordings from './pages/live/Recordings';
import Forum from './pages/Forum';
import ForumTopic from './pages/ForumTopic';
import SubscriptionPage from './pages/SubscriptionPage';
import Profile from './pages/profile/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Authenticated */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={
          user?.role === 'TEACHER' ? <TeacherDashboard /> :
          user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? <AdminDashboard /> :
          <StudentDashboard />
        } />

        {/* Learning */}
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/:id" element={<SubjectDetail />} />
        <Route path="/lessons/:id" element={<LessonView />} />
        <Route path="/quizzes/:id" element={<QuizPage />} />
        <Route path="/assignments/:id" element={<AssignmentPage />} />

        {/* Live */}
        <Route path="/live" element={<LiveClasses />} />
        <Route path="/live/:id" element={<LiveClassRoom />} />
        <Route path="/recordings" element={<Recordings />} />

        {/* Social */}
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ForumTopic />} />

        {/* Payments */}
        <Route path="/subscriptions" element={<SubscriptionPage />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
