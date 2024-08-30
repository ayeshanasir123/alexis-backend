
import axios, { AxiosInstance } from 'axios';

// Create an instance of axios with a predefined base URL
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://api-c02-s01.westbahr.net/rest/alexis',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to set the Authorization header
export const setAuthorizationHeader = (access_token: string | null): void => {
    if (access_token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

export default axiosInstance;
