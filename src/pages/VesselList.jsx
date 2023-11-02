import { useState, useEffect, useRef } from 'react'
import TopLoadingBar from "../components/TopLoadingBar";
import { useAuth } from "../context/Auth";
import axios from '../services/axios';
import Select from 'react-select'
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'

export default function VesselList() {
    const { auth, setAuth, setProgress } = useAuth();

    // toast notification
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

    const [loading, setLoading] = useState(false)

    // self click button
    const buttonRef = useRef(null);

    // api header
    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : 'Bearer ' + auth.data.token
    }
    const [vessels, setVessels] = useState([])
    const [edited, setEdited] = useState(false)
    const [editedId, setEditedId] = useState(0)

    // paging & search data
    const [search, setSearch] = useState("")


    const filteredData = vessels.filter((el) => {
        if (search === '') {
            return el;
        } else {
            return el.vessel_name.toLowerCase().includes(search)
        }
    })
    
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const itemsPerPage = 10
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPgs = Math.ceil(filteredData.length / itemsPerPage)
    const subset = filteredData.slice(startIndex, endIndex);
    
    const searchHandler = (e) => {
        let lowerCase = e.target.value?.toLowerCase();
        setSearch(lowerCase);
        setCurrentPage(0)
    };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    // Vessel List View
    const handleVesselList = async () => {
        setLoading(true)
        await axios.get(`/api/vessels`, {
            headers: headers
        })
        .then((res) => {
            setVessels(res.data.data);
            setTotalPages(Math.ceil(res.data.data.length / itemsPerPage));
            setLoading(false)
        })
        .catch((err) => {
            console.error(err);
            if (err.response.status === 401) {
                setAuth(null)
            }
        })
    }

    // Vessel Add
    const initialForm = {
        vessel_name: "",
        vessel_type: "",
    }
    const [formData, setFormData] = useState({
        vessel_name: "",
        vessel_type: "",
    })

    const clearForm = () => {
        setFormData(initialForm)
        if (edited) {
            setEdited(!edited)
        }
    }

    // invalid form check
    const [formValidation, setFormValidation] = useState(null)
    const validationCheck = () => {
        Object.keys(formData).map((x) => {
            if (formData[x] === '') {
                setFormValidation((prev) => ({ ...prev, [x]: false }))
            } else {
                setFormValidation((prev) => ({ ...prev, [x]: true }))
            }
        })
        if (Object.values(formData).includes('')){
            return false
        }
        return true
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleAddVessel = async (event) => {
        event.preventDefault();
        if(validationCheck()){
            await axios.post(`/api/vessels`, formData, {headers: headers })
            .then(() => {
                buttonRef.current.addEventListener('click', clearForm);
                buttonRef.current.click();
                handleVesselList()
                Toast.fire({
                    icon: 'success',
                    title: 'Success add data!'
                })
            })
            .catch((err) => {
                console.error(err);
                Toast.fire({
                    icon: 'error',
                    title: 'Error add data!'
                  })
            })
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Data is not valid!'
              })
        }
    }

    const VesselTypeOptions = [
        {value: "SPOB", label: "SPOB"},
        {value: "KRI", label: "KRI"},
    ]

    const handleChangeVesselType = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            vessel_type: selectedOption.value, 
        }));
    };

    const vessel_initial_option = () => {
        return VesselTypeOptions.filter((vsl) => vsl.value == formData.vessel_type)
    }

    // Vessel Edit
    const getVessel = async (id) => {
        await axios.get(`/api/vessels/${id}`, {headers: headers })
        .then((res) => {
            const vessel = res.data.data;
            setFormData((prevFormData) => ({ 
                ...prevFormData, 
                vessel_name: vessel.vessel_name,
                vessel_type: vessel.vessel_type,
            }));
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleUpdateVessel = async (event) => {
        event.preventDefault();
        await axios.put(`/api/vessels/${editedId}`, formData,{headers: headers })
        .then(() => {
            buttonRef.current.addEventListener('click', clearForm)
            buttonRef.current.click()
            handleVesselList()
            Toast.fire({
                icon: 'success',
                title: 'Success updating data!'
            })
        })
        .catch((err) => {
            console.error(err);
            Toast.fire({
                icon: 'error',
                title: 'Error update data!'
              })
        })
    }
    
    const handleEditButton = (id) => {
        setEdited(!edited)
        setEditedId(id)
        getVessel(id)
    }

    // Vessel Delete
    const handleDeleteVessel = async (id) => {
        await axios.delete(`/api/vessels/${id}`, {
            headers: headers
        })
        .then(() => {
            handleVesselList()
            Toast.fire({
                icon: 'success',
                title: 'Success delete data!'
              })
        })
        .catch((err) => {
            console.error(err);
            Toast.fire({
                icon: 'error',
                title: 'Error delete data!'
              })
        })
    }
    const handleDeleteButton = (id) => {
        Swal.fire({
            title: 'Do you want to delete the data?',
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
                handleDeleteVessel(id)
            }
          })
    }

    useEffect(() => {
        handleVesselList()
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            <div className="container">
                <div className="row mt-5 pt-4">
                    <div className="col-xl-12">
                        <div className="card">
                            <h5 className="card-header">Vessel List</h5>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col text-start">
                                        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#formModal">
                                            <i className="fa fa-plus"></i> Vessel
                                        </button>
                                    </div>
                                    <div className="col">
                                        <form className="text-end" role="search">
                                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={searchHandler} />
                                        </form>
                                    </div>
                                </div>

                                <div className="mt-2 table-responsive">
                                    <table className="table table-bordered table-striped text-center">
                                        <thead className="table-primary">
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">Vessel Name</th>
                                                <th scope="col">Vessel Type</th>
                                                <th colSpan="2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                        subset.length > 0
                                        ?   subset.map((vsl, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{currentPage > 0? currentPage * 10 + (index + 1) : index + 1}</th>
                                                    <td>{ vsl.vessel_name}</td>
                                                    <td>{ vsl.vessel_type}</td>
                                                    <td ><button type="button" className="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#formModal" onClick={()=>handleEditButton(vsl.id)}><i className="fa fa-pen" ></i></button></td>
                                                    <td ><button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteButton(vsl.id)}><i className="fa fa-trash"></i></button></td>
                                                </tr>
                                            ))
                                        : !loading?   
                                            <tr>
                                                <td colSpan="11" className="text-center">
                                                    <div className="alert alert-danger mb-0">
                                                        Data Belum Tersedia!
                                                    </div>
                                                </td>
                                            </tr>
                                        :
                                            <tr>
                                                <td colSpan="11" className="text-center">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                <ReactPaginate
                                    pageCount={search.length > 0? totalPgs : totalPages}
                                    onPageChange={handlePageChange}
                                    forcePage={currentPage}
                                    containerClassName=""
                                    className={"pagination justify-content-center"}
                                    pageClassName={"page-link"}
                                    previousLabel={<span aria-hidden="true">&laquo;</span>}
                                    nextLabel={<span aria-hidden="true">&raquo;</span>}
                                    previousLinkClassName={"page-link"}
                                    nextLinkClassName={"page-link"}
                                    breakLinkClassName={"page-link"}
                                    activeClassName={"active"}
                                />

                                <div className="modal fade" id="formModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="formModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="formModalLabel">{edited? 'Edit' : 'Add'} Vessel</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={buttonRef} onClick={()=>clearForm()}></button>
                                        </div>
                                        <div className="modal-body">
                                            <form className="row g-3" onSubmit={edited? handleUpdateVessel : handleAddVessel}>
                                                <div className="col-12 mb-3">
                                                    <label htmlFor="vessel_name" className="form-label">Vessel Name</label>
                                                    <input type="text" className={formValidation?.vessel_name == true || formValidation == null? `form-control` : `form-control is-invalid`} name="vessel_name" value={formData.vessel_name} onChange={handleChange} aria-describedby="validationVesselName" placeholder="Vessel"></input>
                                                    <div id="validationVesselName" className="invalid-feedback">
                                                        Please enter vessel name.
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <Select
                                                        placeholder= "Vessel Type"
                                                        name="vessel_type"
                                                        value={vessel_initial_option()}
                                                        options={VesselTypeOptions}
                                                        onChange={handleChangeVesselType}
                                                        className={formValidation?.vessel_type  == true || formValidation == null? `` : `is-invalid`}
                                                        aria-describedby="validationVesselType"
                                                    />
                                                    <div id="validationVesselType" className="invalid-feedback">
                                                        Please enter vessel type.
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary w-100 py-2 my-3" type="submit">Save</button>
                                            </form>
                                        </div>
                                        {/* <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary">Save changes</button>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}