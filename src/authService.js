import axios from 'axios';
import { apiserver } from './config';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Текущий рефреш токен:', refreshToken);

    if (!refreshToken) {
        console.warn('Рефреш токен отсутствует.');
        return false;
    }

    try {
        const response = await axios.post(`${apiserver}/auth/token/refresh/`, { refresh: refreshToken });
        console.log('Обновленный токен:', response.data.access);
        localStorage.setItem('token', response.data.access);
        return response.data.access;
    } catch (error) {
        console.error('Ошибка при обновлении токена:', error.response ? error.response.data : error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return false;
    }
};

export const setupAxiosInterceptors = (navigate) => {
    axios.interceptors.request.use(
        async (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            
            const originalRequest = error.config;
        
            if ((error.response.status === 401) && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function(resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axios(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                return new Promise(function (resolve, reject) {
                    refreshAuthToken().then(token => {
                        if (token) {
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            processQueue(null, token);
                            resolve(axios(originalRequest));
                        } else {
                            navigate('/');
                            reject(error);
                        }
                    }).catch((err) => {
                        processQueue(err, null);
                        navigate('/');
                        reject(err);
                    }).finally(() => { 
                        isRefreshing = false;
                    });
                });
            }

            return Promise.reject(error);
        }
    );
};
