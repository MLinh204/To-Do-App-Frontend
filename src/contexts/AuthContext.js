import { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, updateProfile as apiUpdateProfile } from '../utils/api';
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const getUserFromLocalStorage = () => {
        try {
            // const decodedToken = jwtDecode(token);
            // console.log('Decoded token contents:', decodedToken);
            // return {
            //     id: decodedToken.id,
            //     username: decodedToken.username,
            //     email: decodedToken.email,
            //     password: decodedToken.password,
            //     profilePicture: `http://localhost:3000${decodedToken.profilePicture}`,
            // };
            const user = JSON.parse(localStorage.getItem('user'));
            const newUser = {
                ...user,
                profilePicture: 'http://localhost:3000' + user.profile_picture,
            }
            return newUser;

        } catch (error) {
            console.error('Error while loading user', error);
            return null;
        }
    }
    useEffect(() => {
        const initializeAuth = async () => {
            const userData = getUserFromLocalStorage();
            if (userData) {
                setUser(userData);
                console.log('Restored user:', userData);
            } else {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);

            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const response = await apiLogin({ email, password });
        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        let userData = user;
        userData.profilePicture = 'http://localhost:3000' + user.profile_picture;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }
    const register = async (email, password, username) => {
        const response = await apiRegister({ email, password, username });
        return response.data;
    }
    const logout = async () => {
        await apiLogout();
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    const updateProfile = async (data) => {
        if (!user) throw new Error('User not logged in');
        // const entries = Object.fromEntries(data.entries());
        // console.log('Update Profile Data (with email/username):', entries);
        const response = await apiUpdateProfile(data, user.id);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    };
    const refreshUser = () => {
        const userData = getUserFromLocalStorage();
        if (userData) {
            setUser(userData);
            console.log('User refreshed:', userData);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}


