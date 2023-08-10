// import axios from "axios";

// export const apiWrapper = {
//     get: request('GET'),
//     post: request('POST'),
//     put: request('PUT'),
//     delete: request('DELETE')
// };

// function request(method) {
//     return (url, body) => {
//         if (body) {
//             body = JSON.stringify(body);
//         }

//         return axios({
//             method: method,
//             url: url,
//             data: body,
//             headers: authHeader(url),
//         }).then((res) => {
//             const data = res.data;
//             return data;
//         }).catch(function (error) {
//             console.error(error);
//         });
//     }
// }

// function authHeader(url) {
//     const token = JSON.parse(localStorage.getItem('user'));
//     const isLoggedIn = token;
//     const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);
//     if (isLoggedIn && isApiUrl) {
//         return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
//     } else {
//         return { 'Content-Type': 'application/json' };
//     }
// }