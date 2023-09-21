import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import Swal from 'sweetalert2'
import TopLoadingBar from "../components/TopLoadingBar";

export default function Profile() {
    const { auth, setProgress } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        nik: '',
        email: '',
        phone: '',
        address: ''
    })
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

    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : 'Bearer ' + auth.data.token
    }
    const API_URL = "http://localhost:8000";

    const fetchUserById = async () => {
        await axios.get(`${API_URL}/api/users/${auth.data.user.id}`, {
            headers: headers
        })
        .then((res) => {
            const userById = res.data.data;
            setUser((prevFormData) => ({ 
                ...prevFormData,
                name: userById.name,
                nik: userById.nik,
                email: userById.email,
                phone: userById.phone,
                address: userById.address
            }));
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const hanldeSubmit = async (event) => {
        event.preventDefault();
    
        await axios.put(`${API_URL}/api/users/${auth.data.user.id}`, user, { headers: headers })
        .then(() => {
            Toast.fire({
                icon: 'success',
                title: 'Data successfully saved!'
              })
            navigate('/profile');
        })
        .catch((err) => {
            console.error(err);
            Toast.fire({
                icon: 'error',
                title: 'Error saving data!'
              })
        })
    }

    useEffect(() => {
        fetchUserById()
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            <div className="container">
                <div className="row mt-5 pt-4">
                    <div className="col-xl-4">
                        <div className="card">
                            <h5 className="card-header">Profile Picture</h5>
                            <div className="card-body">
                                <div className="text-center">
                                    <img src="http://bootdey.com/img/Content/avatar/avatar1.png" className="rounded mb-2" alt="..." width="150" height="150"></img>
                                    <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                                    <button className="btn btn-primary" type="button">Upload new image</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="card">
                            <h5 className="card-header">Account Details</h5>
                            <div className="card-body">
                                <form onSubmit={hanldeSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="inputName" className="form-label">Name</label>
                                        <input type="text" className="form-control" name="name" disabled value={user.name} onChange={handleChange}></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputEmail" className="form-label">NIK</label>
                                        <input type="text" className="form-control" name="nik" disabled value={user.nik} onChange={handleChange}></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputEmail" className="form-label">Email Address</label>
                                        <input type="text" className="form-control" name="email" value={user.email} onChange={handleChange}></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputPhone" className="form-label">Phone Number</label>
                                        <input type="text" className="form-control" name="phone" value={user.phone} onChange={handleChange}></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputAddress" className="form-label">Address</label>
                                        <textarea className="form-control" name="address" rows="3" value={user.address} onChange={handleChange}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Profile</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}