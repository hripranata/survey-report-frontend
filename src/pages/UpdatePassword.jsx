import { useState, useEffect } from "react"
import axios from '../services/axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useAuth } from "../context/Auth";
import TopLoadingBar from "../components/TopLoadingBar";

export default function UpdatePasssword() {
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

    const handlePasswordChange = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure to change your password !',
            showDenyButton: true,
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
                if (password.length > 0 && npassword.length > 0 && cpassword.length > 0 && cpassword === npassword) {
                    axios
                        .post(`/api/users/update_password`, {
                            nik: auth.data.user.nik,
                            password: password,
                            npassword: npassword,
                        }, { headers: headers })
                        .then(() => {
                            Toast.fire({
                                icon: 'success',
                                title: 'Success change password !'
                                })
                            navigate("/home")
        
                        })
                        .catch((err) => {
                            console.log(err);

                            setPassword("")
                            setNPassword("")
                            setCPassword("")
                            Toast.fire({
                                icon: 'error',
                                title: 'Error to change password!'
                                })
                        });
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Confirmation password not match!'
                        })
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