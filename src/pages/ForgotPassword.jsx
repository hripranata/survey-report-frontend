import SILogo from '/logo.png'
import { useState, useEffect } from "react"
import axios from '../services/axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useAuth } from "../context/Auth";
import TopLoadingBar from "../components/TopLoadingBar";

export default function ForgotPasssword() {
    const [loading, setLoading] = useState(false)
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
    const [email, setEmail] = useState("");

    const forgotHandler = (ev) => {
        ev.preventDefault();
        setLoading(true)
        if (email.length > 0) {
            axios.get("/sanctum/csrf-cookie").then(() => {
                axios
                    .post("/api/forgot_password", {
                        email: email,
                    })
                    .then(() => {
                        Swal.fire({
                            title: 'Success request reset link, please check your email !',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Ok',
                            denyButtonText: 'No',
                            allowOutsideClick: false,
                            customClass: {
                              actions: 'my-actions',
                              cancelButton: 'order-1 right-gap',
                              confirmButton: 'order-2',
                              denyButton: 'order-3',
                            }
                          }).then((result) => {
                            if (result.isConfirmed) {
                                navigate("/")
                            }
                          })

                    })
                    .finally(function() {
                        setLoading(false)
                    })
                    .catch(function () {
                        setEmail("")
                        Toast.fire({
                            icon: 'error',
                            title: 'Email are not found!'
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
            <TopLoadingBar/>
            <div className="form-login">
                <form onSubmit={forgotHandler}>
                    <div className="text-center">
                        <img className="mb-5" src={SILogo} alt="" height=   "36" width="282"></img>
                    </div>
                    <h1 className="h3 mb-4 fw-normal text-center">Forgot Password</h1>

                    <div className="form-floating">
                        <input type="email" className="form-control" name="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label htmlFor="floatingInput">Email</label>
                    </div>
                    <button className="btn btn-primary w-100 py-2 my-3" type="submit">Request Reset Link</button>
                </form>
                { loading?
                    <div className="text-center">
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
    );
}