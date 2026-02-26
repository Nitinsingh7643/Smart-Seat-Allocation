import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add Authorization header with token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle logout on token expiration
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (data: any) => api.post('/auth/login', data),
    signup: (data: any) => api.post('/auth/signup', data),
};

export const seatService = {
    getAll: (date: string) => api.get(`/seats/all?date=${date}`),
};

export const bookingService = {
    reserve: (data: any) => api.post('/bookings/reserve', data),
    cancel: (id: string) => api.delete(`/bookings/${id}`),
    getMine: () => api.get('/bookings/mine'),
    getUtilization: (start: string, end: string) =>
        api.get(`/bookings/utilization?start=${start}&end=${end}`),
    simulate: (data: { date: string, batch: string, count: number, excludeUserId?: string }) =>
        api.post('/bookings/simulate', data),
};

export default api;
