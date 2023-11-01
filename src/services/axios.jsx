/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';

export default axios.create({
    withCredentials: true,
    // baseURL: 'https://survey-report-api.onrender.com'
    baseURL: 'http://localhost:8000'
});