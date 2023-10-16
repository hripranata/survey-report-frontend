import SILogo from '/logo.png'
import { useState, useEffect } from "react"
import axios from '../services/axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import { useAuth } from "../context/Auth";
import TopLoadingBar from "../components/TopLoadingBar";

export default function ResetPasssword() {
    const { setProgress } = useAuth();
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

    const { token } = useParams();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [showPass, setShowPass] = useState(false)
    const handlePass = () => {
        setShowPass(!showPass)
    }

    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (password.length > 0 && password_confirmation.length > 0 && password_confirmation === password) {
            axios.get("/sanctum/csrf-cookie").then(() => {
                axios
                    .post("/api/reset_password", {
                        token: token,
                        email: email,
                        password: password,
                        password_confirmation: password_confirmation
                    })
                    .then(() => {
                        Toast.fire({
                            icon: 'success',
                            title: 'Success reset password!'
                            })
                        navigate("/")
    
                    })
                    .catch(function () {
                        setEmail("")
                        setPassword("")
                        setPasswordConfirmation("")
                        Toast.fire({
                            icon: 'error',
                            title: 'Error to reset password!'
                          })
                    });
            });
        }
    }

    const [valid, setValid] = useState(true)
    console.log(valid);

    const tokenValidation = () => {
        axios.get("/sanctum/csrf-cookie").then(() => {
            axios
                .post("/api/validate_token", {
                    token: token,
                })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.success == true) {
                        setValid(true)
                    } else {
                        setValid(false)
                    }
                })
                .catch(() => {
                    setValid(false)
                });
            });
    }

    useEffect(() => {
        tokenValidation()
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            {valid? 
            <div className="form-login">
                <form onSubmit={handlePasswordReset}>
                    <div className="text-center">
                        <img className="mb-5" src={SILogo} alt="" height=   "36" width="282"></img>
                    </div>
                    <h1 className="h3 mb-4 fw-normal text-center">Reset Your Password</h1>

                    <div className="form-floating">
                        <input type="email" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required></input>
                        <label htmlFor="floatingEmail">Email</label>
                    </div>
                    <div className="form-floating">
                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                        <label htmlFor="floatingPassword">New Password</label>
                    </div>
                    <div className="form-floating">
                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="password_confirmation" value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirm New Password" required></input>
                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                        <label htmlFor="floatingPassword">Confirm New Password</label>
                    </div>
                    <button className="btn btn-primary w-100 py-2 my-3" type="submit">Reset Password</button>
                </form>
                <p className="mt-5 mb-3 text-body-secondary text-center">2023 &copy; PT Surveyor Indonesia</p>
            </div>
            :
            <div className="container mt-5">
                <div className="text-center">
                    <div className="alert alert-danger mb-0">
                        Sorry link was expired !
                    </div>
                </div>   
            </div>
            }
        </>
    )
}