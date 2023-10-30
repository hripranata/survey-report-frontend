/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';

export default axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_BASE_URL
});