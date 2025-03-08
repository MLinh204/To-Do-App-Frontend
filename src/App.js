import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './components/Todo/TodoList';
import ProfilePage from './pages/ProfilePage';
import NavigationBar from './components/Navigation';
import TaskListPage from './pages/TaskListPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <div style={{padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/todo" element={<ProtectedRoute><TodoListPage /></ProtectedRoute>} />
          <Route path="/tasks/:todoId" element={<ProtectedRoute><TaskListPage /></ProtectedRoute>} />
          <Route path="/profile/view" element={<ProtectedRoute><ProfilePage mode="view" /></ProtectedRoute>} />
          <Route path="/profile/update" element={<ProtectedRoute><ProfilePage mode="update" /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default App;
