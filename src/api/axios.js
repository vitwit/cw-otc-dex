import axios from 'axios';

const axiosInstance = axios.create({
    timeout: 30000, // 30 seconds
    baseURL: "http://142.93.213.125:8000"
});

export default axiosInstance;
