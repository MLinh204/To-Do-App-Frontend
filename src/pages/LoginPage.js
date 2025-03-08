import Login from '../components/Auth/Login';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from'react-router-dom';
import { useEffect } from 'react';


function LoginPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user) navigate('/home');
    }, [user, navigate]);
    return (
        <div>
            <h1>Login Page</h1>
            <Login />
        </div>
    );
}

export default LoginPage;
