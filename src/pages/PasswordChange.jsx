import { useState, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useAuth } from "../context/Auth";
import TopLoadingBar from "../components/TopLoadingBar";

export default function PassswordChange() {
    const { auth, setProgress } = useAuth();
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
    const [npassword, setNPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [showPass, setShowPass] = useState(false)
    const handlePass = () => {
        setShowPass(!showPass)
    }

    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : 'Bearer ' + auth.data.token
    }
    const API_URL = "http://localhost:8000";

    const handlePasswordChange = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure to change your password !',
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
                if (password.length > 0 && npassword.length > 0 && cpassword.length > 0 && cpassword === password && password === auth.data.user.password) {
                        axios
                            .post(API_URL + `/api/change_password/${auth.data.user.id}`, {
                                // password: password,
                                npassword: npassword,
                            }, { headers: headers })
                            .then(() => {
                                Toast.fire({
                                    icon: 'success',
                                    title: 'Success change password !'
                                    })
                                navigate("/home")
            
                            })
                            .catch(function () {
                                setPassword("")
                                setCPassword("")
                                Toast.fire({
                                    icon: 'error',
                                    title: 'Error to change password!'
                                  })
                            });
                }
            }
          })
    }

    useEffect(() => {
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            {/* <div className="form-login">
                <form>
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
            </div> */}
            <div className="container">
                <div className="row mt-5 pt-4">
                    <div className="col-xl-12">
                        <div className="card">
                            <h5 className="card-header">Change Password</h5>
                            <div className="card-body">
                                <form className='mt-3' onSubmit={handlePasswordChange}>
                                    <div className="form-floating mb-3">
                                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required></input>
                                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                                        <label htmlFor="floatingPassword">Old Password</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="npassword" value={npassword} onChange={(e) => setNPassword(e.target.value)} placeholder="New Password" required></input>
                                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                                        <label htmlFor="floatingPassword">New Password</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type={`${showPass? 'text' : 'password'}`} className="form-control" name="cpassword" value={cpassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Confirm New Password" required></input>
                                        <i onClick={()=>handlePass()} className={`${showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} p-viewer`} />
                                        <label htmlFor="floatingPassword">Confirm New Password</label>
                                    </div>
                                    <button className="btn btn-primary w-100 py-2 my-4" type="submit">Change Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}