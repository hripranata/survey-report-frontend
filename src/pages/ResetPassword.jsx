import SILogo from '/logo.png'
import { useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useAuth } from "../context/Auth";

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
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [showPass, setShowPass] = useState(false)
    const handlePass = () => {
        setShowPass(!showPass)
    }
    const API_URL = "http://localhost:8000";

    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (password.length > 0 && cpassword.length > 0 && cpassword === password) {
            axios.get(API_URL + "/sanctum/csrf-cookie").then(() => {
                axios
                    .post(API_URL + "/api/reset_password", {
                        password: password,
                    })
                    .then(() => {
                        Toast.fire({
                            icon: 'success',
                            title: 'Success reset password!'
                            })
                        navigate("/")
    
                    })
                    .catch(function () {
                        setPassword("")
                        setCPassword("")
                        Toast.fire({
                            icon: 'error',
                            title: 'Error to reset password!'
                          })
                    });
            });
        }
    }

    useEffect(() => {
        setProgress(100)
    }, []);
    return (
        <>
            <div className="form-login">
                <form onSubmit={handlePasswordReset}>
                    <div className="text-center">
                        <img className="mb-5" src={SILogo} alt="" height=   "36" width="282"></img>
                    </div>
                    <h1 className="h3 mb-4 fw-normal text-center">Reset Your Password</h1>

                    <div className="form-floating">
                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                        <label htmlFor="floatingPassword">New Password</label>
                    </div>
                    <div className="form-floating">
                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="cpassword" value={cpassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Confirm New Password" required></input>
                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                        <label htmlFor="floatingPassword">Confirm New Password</label>
                    </div>
                    <button className="btn btn-primary w-100 py-2 my-3" type="submit">Reset Password</button>
                </form>
                <p className="mt-5 mb-3 text-body-secondary text-center">2023 &copy; PT Surveyor Indonesia</p>
            </div>
        </>
    )
}