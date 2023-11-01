import SILogo from '/logo.png'
import { useState, useEffect } from "react"
import axios from '../services/axios';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Swal from 'sweetalert2'

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth, setProgress } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 1250,
        timerProgressBar: true
    })

    const [showPass, setShowPass] = useState(false)

    const handlePass = () => {
        setShowPass(!showPass)
    }

    const loginHandler = (ev) => {
        ev.preventDefault();
        setLoading(true)
        if (username.length > 0 && password.length > 0) {
            axios.get("/sanctum/csrf-cookie").then(() => {
                axios
                    .post("/api/login", {
                        username: username,
                        password: password,
                    })
                    .then((response) => {
                        //  localStorage.setItem('user', JSON.stringify(response.data))
                        setLoading(false)
                        setAuth(response.data)
                        Toast.fire({
                            icon: 'success',
                            title: 'Success Login'
                            })
                        navigate("/home")
                    })
                    .finally(function() {
                        setLoading(false)
                    })
                    .catch(function () {
                        setUsername("")
                        setPassword("")
                        Toast.fire({
                            icon: 'error',
                            title: 'Username or Password are not match !'
                          })
                    });
            });
        }
    };

    useEffect(() => {
        setProgress(100)
    }, []);

    return (
        <>
            <div className="form-login">
            <form onSubmit={loginHandler}>
                <div className="text-center">
                    <img className="mb-4" src={SILogo} alt="" height=   "36" width="282"></img>
                </div>
                <h1 className="h3 mb-3 fw-normal text-center">Bunker Report</h1>

                <div className="form-floating">
                    <input type="text" className="form-control" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="NIK" required />
                    <label htmlFor="floatingInput">NIK</label>
                </div>
                <div className="form-floating">
                    <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                    <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className='form-check text-end my-3 p-0'>
                    <Link to="/forgot_password">Forgot Password?</Link>
                </div>
                <button className="btn btn-primary w-100 py-2 my-1" type="submit">Login</button>
            </form>
            {loading?
                <div className="text-center mt-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                <div></div>
            }
            <p className="mt-5 mb-3 text-body-secondary text-center">2023 &copy; PT Surveyor Indonesia</p>
            </div>
        
        </>
    )
}