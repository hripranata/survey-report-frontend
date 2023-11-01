/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
import axios from 'axios';

export default axios.create({
    withCredentials: true,
    baseURL: !process.env.NODE_ENV || process.env.NODE_ENV === "development"? 'http://localhost:8000' : 'https://survey-report-api.onrender.com'
});