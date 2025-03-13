import axios from 'axios';

const API_BASE_URL = "https://to-do-app-backend-production-9b2e.up.railway.app";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `${token}`;
    }
    return config;
});

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const refreshToken = () => api.post('/auth/refresh-token');

export const updateProfile = (data, userId) => {
    return api.put(`/users/updateUser/${userId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
export const createTodo = (data, userId) => api.post(`/todos/create/user/${userId}`, data);
export const getTodos = async (userId) => {
    try {
        const response = await api.get(`/todos/getTodos/${userId}`);
        console.log('API Response for todos:', response.data); // Log the exact response
        return Array.isArray(response.data) ? response.data : []; // Ensure an array is returned
    } catch (error) {
        console.error('Error fetching todos:', error);
        return []; // Return empty array on error
    }
};
export const getTodo = (todoId) => api.get(`/todos/getTodo/${todoId}`);
export const updateTodo = (todoId, data) => api.put(`/todos/update/${todoId}`, data);
export const deleteTodo = (todoId) => api.delete(`/todos/delete/${todoId}`);
export const createTask = (data) => api.post(`/tasks/create/${data.todoId}`, data);
export const getTasks = (todoId) => api.get(`/tasks/getTasks/${todoId}`);
export const updateTask = (taskId, data) => api.put(`/tasks/update/${taskId}`, data);
export const deleteTask = (taskId) => api.delete(`/tasks/delete/${taskId}`);