import axios from "axios";
import { useAuth } from "../context/Auth";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import copy from "copy-to-clipboard";
import ReactPaginate from 'react-paginate';

export default function BunkerReport() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [bunkers, setBunkers] = useState([])
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

    // pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const itemsPerPage = 10
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const subset = bunkers.slice(startIndex, endIndex);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

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

    const handleAllBunker = (group) => {
        setGroupReport(group)
        setEditReport(false)
        handleBunkerFilter(firstDate, currentDate, group)
    }

    const handleBunkerFilter = async (firstDate, currentDate, group) => {
        setFirstDate(firstDate)
        setCurrentDate(currentDate)
        setMonth(firstDate.getMonth()+1)
        setYear(currentDate.getFullYear())
        if (group){
            await axios.get(`${API_URL}/api/bunkers/filterbydate/${dateFormat(firstDate)}/${dateFormat(currentDate)}`, {
                headers: headers
            })
            .then((res) => {
                setBunkers(res.data.data);
                setTotalPages(Math.ceil(res.data.data.length / itemsPerPage));
            })
            .catch((err) => {
                console.error(err);
            })
        } else {
            await axios.get(`${API_URL}/api/bunkers/filterbyuser/${auth.data.user.id}/${dateFormat(firstDate)}/${dateFormat(currentDate)}`, {
                headers: headers
            })
            .then((res) => {
                setBunkers(res.data.data);
                setTotalPages(Math.ceil(res.data.data.length / itemsPerPage));
            })
            .catch((err) => {
                console.error(err);
            })
        }
    }

    const handleDeleteBunker = async (id) => {
        await axios.delete(`${API_URL}/api/bunkers/${id}`, {
            headers: headers
        })
        .then(() => {
            handleBunkerFilter(month, groupReport)
            setEditReport(false)
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleExport = async () => {
        await axios.get(`${API_URL}/api/exports/bunkers/${month}/${year}`, {
            headers: headers,
            responseType: 'blob', 
        })
        .then((res) => {
            // create file link in browser's memory
            const href = URL.createObjectURL(res.data);

            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', `Bunkers_${monthNames[month-1]}_${year}.xlsx`); //or any other extension
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
                navigate(`/bunker/edit/${id}`);
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
                handleDeleteBunker(id)
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
        handleBunkerFilter(firstDate, currentDate, groupReport)
    }, []);

    const handleCopy = (bunker, index) => {
        const copyText = `
        _Bunker ${index + 1}_
        *Nama tongkang*         : ${bunker.tongkang.vessel_name}
        *Nama KRI*              : ${bunker.kri.vessel_name}
        *Lokasi Bunker*         : ${bunker.bunker_location}
        *Mulai bunker*          : ${bunker.start.split(' ')[1].substring(0,5).replace(':','.')} / ${bunker.start.split(' ')[0].split("-").reverse().join("-")}
        *Selesai bunker*        : ${bunker.stop.split(' ')[1].substring(0,5).replace(':','.')} / ${bunker.stop.split(' ')[0].split("-").reverse().join("-")}
        *No LO*                             
        ${
            bunker.lo_details?.map((lo) => {
                return `${lo.lo_number} : ${lo.qty}` 
        })
        }
        
        *Volume LO*             : ${bunker.vol_lo}
        *Volume KRI/AR*         : ${bunker.vol_ar}
        *Petugas Survey*        : ${bunker.surveyor}
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
    return(
        <>
            {/* <div className="tab-pane fade" id="nav-bunker" role="tabpanel" aria-labelledby="nav-bunker-tab" tabIndex="0"> */}
                <h4 className="mt-3 text-center">Bunker Report</h4>
                <div className="row mb-3 mt-3">
                    <div className="col text-center">
                        <DatePicker 
                            selected={firstDate}
                            dateFormat="dd/MM/yyyy" 
                            onChange={(date) => {
                                setFirstDate(date)
                                handleBunkerFilter(date, currentDate, groupReport)
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
                                handleBunkerFilter(firstDate, date, groupReport)
                            }} 
                            className="form-select form-select-sm" 
                        />
                    </div>
                </div>
                <div className="row mb-3 mt-3">
                    <div className="col text-start">
                        <button className={`btn btn-outline-primary btn-sm me-2 ${groupReport?'':'active'}`} type="button" onClick={groupReport? ()=>handleAllBunker(!groupReport) : ()=>{}}>My Report</button>
                        <button className={`btn btn-outline-primary btn-sm ${groupReport?'active':''}`} type="button" onClick={groupReport? ()=>{} : ()=>handleAllBunker(!groupReport)}>All Report</button>
                    </div>
                    <div className="col">
                        <div className="btn-toolbar justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
                            <div className="btn-group me-2" role="group" aria-label="Third group">
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleEditReport(!editReport)} disabled={groupReport || bunkers.length == 0? true : false}>{editReport? 'Cancel' : 'Edit' }</button>
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleExportButton()} disabled={groupReport && bunkers.length > 0 ? false : true}>Export</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 table-responsive">
                    <table className="table table-bordered table-striped text-center">
                        <thead className="table-primary">
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Port</th>
                                <th scope="col">Nama Kapal Supply</th>
                                <th scope="col">Nama Kapal Penerima</th>
                                <th scope="col">Jenis BBM</th>
                                <th scope="col">Mulai Bunker</th>
                                <th scope="col">Selesai Bunker</th>
                                <th scope="col">LO Number</th>
                                <th scope="col">LO Figure</th>
                                <th scope="col">AR Figure</th>
                                <th scope="col">Surveyor</th>
                                <th scope="col">Copy</th>
                                <th colSpan="2" style={editReport? {} : {display: "none"} }>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            subset.length > 0
                            ?   subset.map((bunker, index) => (
                                <tr key={index}>
                                    <th scope="row">{currentPage > 0? currentPage * 10 + (index + 1) : index + 1}</th>
                                    <td>{ bunker.bunker_location}</td>
                                    <td>{ bunker.tongkang.vessel_name}</td>
                                    <td>{ bunker.kri.vessel_name}</td>
                                    <td>{ bunker.bbm }</td>
                                    <td>{ `${bunker.start.split(' ')[1].substring(0,5).replace(':','.')} / ${bunker.start.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                    <td>{ `${bunker.stop.split(' ')[1].substring(0,5).replace(':','.')} / ${bunker.stop.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                    <td><button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loDetailBunkerModal" onClick={() => handleLoDetail(bunker)}>LO - {bunker.lo_details.length}</button></td>
                                    <td>{ bunker.vol_lo }</td>
                                    <td>{ bunker.vol_ar }</td>
                                    <td>{ bunker.surveyor }</td>
                                    <td>
                                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>handleCopy(bunker, index)}><i className="fa fa-copy"></i></button>
                                    </td>
                                    <td style={editReport? {} : {display: "none"} }>
                                        <button type="button" className="btn btn-outline-warning btn-sm" onClick={()=>handleEditButton(bunker.id)}><i className="fa fa-pen"></i></button>
                                    </td>

                                    <td style={editReport? {} : {display: "none"} }><button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteButton(bunker.id)}><i className="fa fa-trash"></i></button></td>
                                </tr>
                                ))
                            :   <tr>
                                    <td colSpan="12" className="text-center">
                                        <div className="alert alert-danger mb-0">
                                            Data Belum Tersedia!
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    pageCount={totalPages}
                    onPageChange={handlePageChange}
                    forcePage={currentPage}
                    containerClassName=""
                    className={"pagination justify-content-center"}
                    pageClassName={"page-link"}
                    previousLabel={<span aria-hidden="true">&laquo;</span>}
                    nextLabel={<span aria-hidden="true">&raquo;</span>}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            {/* </div> */}

            {/* Modal LO Detail */}
            <div className="modal fade" id="loDetailBunkerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loDetailBunkerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loDetailBunkerModalLabel">Loading Number Detail</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>{loDetail.tongkang?.vessel_name} - {loDetail.kri?.vessel_name} / {loDetail.bbm} - {loDetail.vol_lo}</p>
                        <table className="table table-bordered mb-2 text-center">
                            <thead>
                                <tr>
                                    <th>LO</th>
                                    <th>Product</th>
                                    <th>QTY</th>
                                </tr>
                            </thead>
                            <tbody>
                            {loDetail.lo_details?.map((lo, index) => (
                                <tr key={index}>
                                    <td>{lo.lo_number}</td>
                                    <td>{lo.product}</td>
                                    <td>{lo.qty}</td>
                                </tr>
                            ))}
                                <tr>
                                    <td colSpan="2" className="text-end">Total</td>
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
    );
}