import axios from "axios";
import { useAuth } from "../context/Auth";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import copy from "copy-to-clipboard";

export default function LoadingReport() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState([])
    const [loDetail, setLoDetail] = useState([])
    const [editReport, setEditReport] = useState(false)
    const [groupReport, setGroupReport] = useState(false)
    const now = new Date()

    const [firstDate, setFirstDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
    const [currentDate, setCurrentDate] = useState(new Date());
    const dateFormat = (date) => {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        if (day < 10) {
            day = `0${day}`;
        }
        
        if (month < 10) {
            month = `0${month+1}`;
        }
        
        return `${year}-${month}-${day}`;
    }

    const [month, setMonth] = useState(now.getMonth()+1)
    const [year, setYear] = useState(now.getFullYear())

    const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
                ];

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

    const handleLoDetail = (lo) => {
        setLoDetail(lo)
    }

    const handleEditReport = (e) => {
        setEditReport(e)
    }

    const handleAllLoading = (group) => {
        setGroupReport(group)
        setEditReport(false)
        handleLoadingFilter(firstDate, currentDate, group)
    }

    const handleLoadingFilter = async (firstDate, currentDate, group) => {
        setFirstDate(firstDate)
        setCurrentDate(currentDate)
        setMonth(firstDate.getMonth()+1)
        setYear(currentDate.getFullYear())
        
        if (group){
            await axios.get(`${API_URL}/api/loadings/filterbydate/${dateFormat(firstDate)}/${dateFormat(currentDate)}`, {
                headers: headers
            })
            .then((res) => {
                setLoadings(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
        } else {
            await axios.get(`${API_URL}/api/loadings/filterbyuser/${auth.data.user.id}/${dateFormat(firstDate)}/${dateFormat(currentDate)}`, {
                headers: headers
            })
            .then((res) => {
                console.log(res.data);
                setLoadings(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }

    const handleDeleteLoading = async (id) => {
        await axios.delete(`${API_URL}/api/loadings/${id}`, {
            headers: headers
        })
        .then(() => {
            handleLoadingFilter(firstDate, currentDate, groupReport)
            setEditReport(false)
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleExport = async () => {
        await axios.get(`${API_URL}/api/exports/loadings/${month}/${year}`, {
            headers: headers,
            responseType: 'blob', 
        })
        .then((res) => {
            // create file link in browser's memory
            const href = URL.createObjectURL(res.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `Loadings_${monthNames[month-1]}_${year}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleEditButton = (id) => {
        Swal.fire({
            title: 'Do you want to edit the data?',
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
                navigate(`/loading/edit/${id}`);
            }
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
                handleDeleteLoading(id)
                Toast.fire({
                    icon: 'success',
                    title: 'Success updating data!'
                  })
            }
          })
    }
    const handleExportButton = () => {
        Swal.fire({
            title: `Export report data ${monthNames[month-1]}-${year} ?`,
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
                handleExport()
                Toast.fire({
                    icon: 'success',
                    title: 'Success export data!'
                  })
            }
          })
    }

    useEffect(() => {
        handleLoadingFilter(firstDate, currentDate, groupReport)
    }, []);

    const handleCopy = (loading) => {
        const copyText = `
        *Tanggal LO*            : ${loading.lo_date}
        *Nama tongkang*         : ${loading.tongkang.vessel_name}
        *Jenis BBM*             : ${loading.bbm}
        *Mulai loading*         : ${loading.start.split(' ')[1].substring(0,5).replace(':','.')} / ${loading.start.split(' ')[0].split("-").reverse().join("-")}
        *Selesai Loading*       : ${loading.stop.split(' ')[1].substring(0,5).replace(':','.')} / ${loading.stop.split(' ')[0].split("-").reverse().join("-")}
        *No LO*                             
        ${
            loading.lo_details?.map((lo) => {
                return `${lo.lo_number} : ${lo.qty}` 
        })
        }
        
        *Volume LO*             : ${loading.vol_lo}
        *AL/ Volume Tongkang*   : ${loading.vol_al}
        *Petugas Survey*        : ${loading.surveyor}
        `
        console.log(copyText);
        let isCopy = copy(copyText);

        if (isCopy){
            Toast.fire({
                icon: 'success',
                title: 'Copied to Clipboard'
              })
        }
    }

    return (
        <>
            {/* <div className="tab-pane fade show active" id="nav-loading" role="tabpanel" aria-labelledby="nav-loading-tab" tabIndex="0"> */}
                <h4 className="text-center mt-3">Loading Report</h4>
                <div className="row mb-3 mt-3">
                    <div className="col text-center">
                        <DatePicker 
                            selected={firstDate}
                            dateFormat="dd/MM/yyyy" 
                            onChange={(date) => {
                                setFirstDate(date)
                                handleLoadingFilter(date, currentDate, groupReport)
                            }}
                            className="form-select form-select-sm"
                        />
                    </div>
                    <div className="col">
                        <DatePicker 
                            selected={currentDate}
                            dateFormat="dd/MM/yyyy" 
                            onChange={(date) => {
                                setCurrentDate(date)
                                handleLoadingFilter(firstDate, date, groupReport)
                            }} 
                            className="form-select form-select-sm" 
                        />
                    </div>
                </div>
                <div className="row mb-3 mt-3">
                    <div className="col text-start">
                        <button className={`btn btn-outline-primary btn-sm me-2 ${groupReport?'':'active'}`} type="button" onClick={groupReport? ()=>handleAllLoading(!groupReport) : ()=>{}}>My Report</button>
                        <button className={`btn btn-outline-primary btn-sm ${groupReport?'active':''}`} type="button" onClick={groupReport? ()=>{} : ()=>handleAllLoading(!groupReport)}>All Report</button>
                    </div>
                    <div className="col">
                        <div className="btn-toolbar justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
                            <div className="btn-group me-2" role="group" aria-label="First group">
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleEditReport(!editReport)} disabled={groupReport? true : false}>{editReport? 'Cancel' : 'Edit' }</button>
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleExportButton()} disabled={groupReport && loadings.length > 0 ? false : true}>Export</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-2 table-responsive">
                    <table className="table table-bordered table-striped text-center">
                        <thead className="table-primary">
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">LO Date</th>
                                <th scope="col">Nama Kapal Supply</th>
                                <th scope="col">Jenis BBM</th>
                                <th scope="col">Mulai Loading</th>
                                <th scope="col">Selesai Loading</th>
                                <th scope="col">LO Number</th>
                                <th scope="col">LO Figure</th>
                                <th scope="col">AL Figure</th>
                                <th scope="col">Surveyor</th>
                                <th scope="col">Copy</th>
                                <th colSpan="2" style={editReport? {} : {display: "none"} }>Action</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                        {
                        loadings.length > 0
                        ?   loadings.map((loading, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{ loading.lo_date.split("-").reverse().join("-")}</td>
                                    <td>{ loading.tongkang.vessel_name}</td>
                                    <td>{ loading.bbm }</td>
                                    <td>{ `${loading.start.split(' ')[1].substring(0,5).replace(':','.')} / ${loading.start.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                    <td>{ `${loading.stop.split(' ')[1].substring(0,5).replace(':','.')} / ${loading.stop.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                    <td><button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loDetailLoadingModal" onClick={() => handleLoDetail(loading)}>LO - {loading.lo_details.length}</button></td>
                                    <td>{ loading.vol_lo }</td>
                                    <td>{ loading.vol_al }</td>
                                    <td>{ loading.surveyor }</td>
                                    <td>
                                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>handleCopy(loading)}><i className="fa fa-copy"></i></button>
                                    </td>
                                    <td style={editReport? {} : {display: "none"} }>
                                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={()=>handleEditButton(loading.id)}><i className="fa fa-pen"></i></button>
                                    </td>
                                    <td style={editReport? {} : {display: "none"} }><button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteButton(loading.id)}><i className="fa fa-trash"></i></button></td>
                                </tr>
                            ))
                        :   <tr>
                                <td colSpan="11" className="text-center">
                                    <div className="alert alert-danger mb-0">
                                        Data Belum Tersedia!
                                    </div>
                                </td>
                            </tr>
                        }
                        </tbody>
                    </table>
                </div>

                <nav aria-label="Page navigation example" className="mt-2 mb-2" >
                    <ul className="pagination justify-content-center">
                        <li className="page-item disabled">
                        <a className="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                        </li>
                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                        </li>
                    </ul>
                </nav>
            {/* </div> */}

            {/* Modal LO Detail */}
            <div className="modal fade" id="loDetailLoadingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loDetailLoadingModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loDetailLoadingModalLabel">Loading Number Detail</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{loDetail.tongkang?.vessel_name} / {loDetail.bbm} - {loDetail.vol_lo} / {loDetail.lo_date}</p>
                        <table className="table table-bordered mb-2 text-center">
                            <thead>
                                <tr>
                                    <th>LO</th>
                                    <th>Status</th>
                                    <th>Product</th>
                                    <th>QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                            {loDetail.lo_details?.map((lo, index) => (
                                <tr key={index}>
                                    <td>{lo.lo_number}</td>
                                    <td><i className="fa fa-check" style={{color: "#1E968C"}} hidden={lo.bunker_id !== null?'':'hidden'}></i></td>
                                    <td>{lo.product}</td>
                                    <td>{lo.qty}</td>
                                </tr>
                            ))}
                                <tr>
                                    <td colSpan="3" className="text-end">Total</td>
                                    <td>{loDetail.vol_lo}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}