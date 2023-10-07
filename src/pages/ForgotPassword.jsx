import SILogo from '/logo.png'
import { useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useAuth } from "../context/Auth";

export default function ForgotPasssword() {
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
        alert(email)
        const API_URL = "http://localhost:8000";
        if (email.length > 0) {
            axios.get(API_URL + "/sanctum/csrf-cookie").then(() => {
                axios
                    .post(API_URL + "/api/forgot_password", {
                        email: email,
                    })
                    .then(() => {
                        Swal.fire({
                            title: 'Success request reset link, please check your email !',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Yes',
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
                                Toast.fire({
                                    icon: 'success',
                                    title: 'Success request reset link !'
                                    })
                                navigate("/")
                            }
                          })

                    })
                    .catch(function () {
                        // setUsername("")
                        // setPassword("")
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
                <p className="mt-5 mb-3 text-body-secondary text-center">2023 &copy; PT Surveyor Indonesia</p>
            </div>
        </>
    );
}