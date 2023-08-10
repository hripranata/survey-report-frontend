import axios from "axios";
import { useAuth } from "../context/Auth";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Report() {
    const { auth } = useAuth();
    const [loadings, setLoadings] = useState([])
    const [loDetail, setLoDetail] = useState([])
    const [editReport, setEditReport] = useState(false)
    const [groupReport, setGroupReport] = useState(false)
    const now = new Date()

    const [month, setMonth] = useState(now.getMonth()+1)

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
        handleLoadingFilter(month, group)
    }

    const handleLoadingFilter = async (month, group) => {
        setMonth(month)
        await axios.get(`${API_URL}/api/loadings/filter/${month}`, {
            headers: headers
        })
        .then((res) => {
            if (group){
                setLoadings(res.data.data);
            } else {
                const myreport = res.data.data.filter((lo) => {
                    return lo.surveyor == auth.data.user.name
                })
                setLoadings(myreport);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleDeleteLoading = async (id) => {
        await axios.delete(`${API_URL}/api/loadings/${id}`, {
            headers: headers
        })
        .then(() => {
            handleLoadingFilter(month, groupReport)
            setEditReport(false)
        })
        .catch((err) => {
            console.error(err);
        })
    }

    useEffect(() => {
        handleLoadingFilter(month, groupReport)
    }, []);

    return (
        <>
            <div className="container shadow-sm p-3 mb-5 bg-body rounded" style={{backgroundColor: "white", height: "100vh"}}>
                <nav className="mt-5 pt-4">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active"  id="nav-loading-tab" data-bs-toggle="tab" data-bs-target="#nav-loading" type="button" role="tab" aria-controls="nav-loading" aria-selected="true">Loading Report</button>
                        <button className="nav-link" id="nav-bunker-tab" data-bs-toggle="tab" data-bs-target="#nav-bunker" type="button" role="tab" aria-controls="nav-bunker" aria-selected="false">Bunker Report</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent" >
                    <div className="tab-pane fade show active" id="nav-loading" role="tabpanel" aria-labelledby="nav-loading-tab" tabIndex="0">
                        <h4 className="text-center mt-3">{groupReport? 'All Loading Report' : 'My Loading Report' }</h4>
                        <div className="row mb-3 mt-3">
                            <div className="col text-start"><button className="btn btn-outline-primary btn-sm" type="button" onClick={()=>handleAllLoading(!groupReport)}>{groupReport? 'My Report' : 'All Report' }</button></div>
                            <div className="col">
                                <div className="btn-toolbar justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
                                    <div className="btn-group me-2" role="group" aria-label="Third group">
                                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleEditReport(!editReport)} disabled={groupReport? true : false}>{editReport? 'Cancel Edit' : 'Edit Report' }</button>
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Third group">
                                        <select className="form-select form-select-sm" style={{width: "auto"}} value={month} onChange={(e) => handleLoadingFilter(e.target.value, groupReport)} aria-label="monthlyfilter" name="monthlyfilter">
                                            <option value="8">Aug 2023</option>
                                            <option value="7">Jul 2023</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        <div className="mt-2 table-responsive">
                            <table className="table table-bordered table-striped text-center">
                                <thead className="table-primary">
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Nama Kapal Supply</th>
                                        <th scope="col">Jenis BBM</th>
                                        <th scope="col">Mulai Loading</th>
                                        <th scope="col">Selesai Loading</th>
                                        <th scope="col">LO Number</th>
                                        <th scope="col">LO Figure</th>
                                        <th scope="col">AL Figure</th>
                                        <th scope="col">Surveyor</th>
                                        <th colSpan="2" style={editReport? {} : {display: "none"} }>Action</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                loadings.length > 0
                                ?   loadings.map((loading, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{ loading.tongkang }</td>
                                        <td>{ loading.bbm }</td>
                                        <td>{ `${loading.start.split(' ')[1].substring(0,5)} / ${loading.start.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                        <td>{ `${loading.stop.split(' ')[1].substring(0,5)} / ${loading.stop.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                        <td><button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loDetailModal" onClick={() => handleLoDetail(loading)}>LO - {loading.lo_number.length}</button></td>
                                        <td>{ loading.vol_lo }</td>
                                        <td>{ loading.vol_al }</td>
                                        <td>{ loading.surveyor }</td>
                                        <td style={editReport? {} : {display: "none"} }>
                                            <Link to={`/loading/edit/${loading.id}`} className="btn btn-outline-warning btn-sm"><i className="fa fa-pen"></i></Link>
                                        </td>

                                        <td style={editReport? {} : {display: "none"} }><button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteLoading(loading.id)}><i className="fa fa-trash"></i></button></td>
                                    </tr>
                                    ))
                                :   <tr>
                                        <td colSpan="9" className="text-center">
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
                    </div>
                    <div className="tab-pane fade" id="nav-bunker" role="tabpanel" aria-labelledby="nav-bunker-tab" tabIndex="0">
                        <h3 className="mt-3 text-center">BUNKER REPORT</h3>
                        <div className="mt-3 table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Port</th>
                                    <th scope="col">Nama Kapal Supply</th>
                                    <th scope="col">Nama Kapal Penerima</th>
                                    <th scope="col">Jenis BBM</th>
                                    <th scope="col">Mulai Bunker</th>
                                    <th scope="col">Selesai Bunker</th>
                                    <th scope="col">LO Figure</th>
                                    <th scope="col">AR Figure</th>
                                    <th scope="col">Surveyor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>JICT 2</td>
                                        <td>SPOB KUJANG JAYA 1</td>
                                        <td>KRI BUNG TOMO 357</td>
                                        <td>HSD</td>
                                        <td>09:15 / 25.07.2023</td>
                                        <td>10:15 / 25.07.2023</td>
                                        <td>50000</td>
                                        <td>49995</td>
                                        <td>Hari Pranata</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal LO Detail */}
                <div className="modal fade" id="loDetailModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loDetailModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loDetailModalLabel">Loading Number Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>{loDetail.tongkang} / {loDetail.bbm} - {loDetail.vol_lo} / {loDetail.lo_date}</p>
                            <table className="table table-bordered mb-2 text-center">
                                <thead>
                                    <tr>
                                        <th>LO</th>
                                        <th>Product</th>
                                        <th>QTY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {loDetail.lo_number?.map((lo, index) => (
                                    <tr key={index}>
                                        <td>{lo.lo_number}</td>
                                        <td>{lo.product}</td>
                                        <td>{lo.qty}</td>
                                    </tr>
                                ))}
                                    <tr>
                                        <td colSpan="2">Total</td>
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

            </div>
        </>
    )
}