import SILogo from '/logo.png'
import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const loginHandler = (ev) => {
        ev.preventDefault();
        const API_URL = "http://localhost:8000";
        if (email.length > 0 && password.length > 0) {
            axios.get(API_URL + "/sanctum/csrf-cookie").then(() => {
                axios
                    .post(API_URL + "/api/login", {
                        email: email,
                        password: password,
                    })
                    .then((response) => {
                         localStorage.setItem('user', JSON.stringify(response.data))
                         setAuth(response.data)
                         navigate("/home")
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            });
        }
    };
    return (
        <>
            <div className="form-login">
            <form onSubmit={loginHandler}>
                <img className="mb-4" src={SILogo} alt="" height="36" width="282"></img>
                <h1 className="h3 mb-3 fw-normal">Please Login</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" name="email" onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"></input>
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                {/* <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"></input>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Remember me
                    </label>
                </div> */}
                <button className="btn btn-primary w-100 py-2 my-3" type="submit">Sign in</button>
                <p className="mt-5 mb-3 text-body-secondary">&copy; 2017-2023</p>
            </form>
            </div>
        
        </>
    )
}