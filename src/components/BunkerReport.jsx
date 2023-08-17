import axios from "axios";
import { useAuth } from "../context/Auth";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function BunkerReport() {
    const { auth } = useAuth();
    const [bunkers, setBunkers] = useState([])
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

    const handleAllBunker = (group) => {
        setGroupReport(group)
        setEditReport(false)
        handleBunkerFilter(month, group)
    }

    const handleBunkerFilter = async (month, group) => {
        setMonth(month)
        await axios.get(`${API_URL}/api/bunkers/filter/${month}`, {
            headers: headers
        })
        .then((res) => {
            if (group){
                setBunkers(res.data.data);
            } else {
                const myreport = res.data.data.filter((lo) => {
                    return lo.surveyor == auth.data.user.name
                })
                setBunkers(myreport);
            }
        })
        .catch((err) => {
            console.error(err);
        })
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

    useEffect(() => {
        handleBunkerFilter(month, groupReport)
    }, []);
    return(
        <>
            {/* <div className="tab-pane fade" id="nav-bunker" role="tabpanel" aria-labelledby="nav-bunker-tab" tabIndex="0"> */}
                <h4 className="mt-3 text-center">Bunker Report</h4>
                <div className="row mb-3 mt-3">
                    <div className="col text-start">
                        <button className={`btn btn-outline-primary btn-sm me-2 ${groupReport?'':'active'}`} type="button" onClick={groupReport? ()=>handleAllBunker(!groupReport) : ()=>{}}>My Report</button>
                        <button className={`btn btn-outline-primary btn-sm ${groupReport?'active':''}`} type="button" onClick={groupReport? ()=>{} : ()=>handleAllBunker(!groupReport)}>All Report</button>
                    </div>
                    <div className="col">
                        <div className="btn-toolbar justify-content-end" role="toolbar" aria-label="Toolbar with button groups">
                            <div className="btn-group me-2" role="group" aria-label="Third group">
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => handleEditReport(!editReport)} disabled={groupReport? true : false}>{editReport? 'Cancel Edit' : 'Edit Report' }</button>
                            </div>
                            <div className="btn-group" role="group" aria-label="Third group">
                                <select className="form-select form-select-sm" style={{width: "auto"}} value={month} onChange={(e) => handleBunkerFilter(e.target.value, groupReport)} aria-label="monthlyfilter" name="monthlyfilter">
                                    <option value="8">Aug 2023</option>
                                    <option value="7">Jul 2023</option>
                                </select>
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
                                <th colSpan="2" style={editReport? {} : {display: "none"} }>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            bunkers.length > 0
                            ?   bunkers.map((bunker, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{ bunker.bunker_location}</td>
                                    <td>{ bunker.tongkang.vessel_name}</td>
                                    <td>{ bunker.kri.vessel_name}</td>
                                    <td>{ bunker.bbm }</td>
                                    <td>{ `${bunker.start.split(' ')[1].substring(0,5)} / ${bunker.start.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                    <td>{ `${bunker.stop.split(' ')[1].substring(0,5)} / ${bunker.stop.split(' ')[0].split("-").reverse().join("-")}` }</td>
                                    <td><button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loDetailBunkerModal" onClick={() => handleLoDetail(bunker)}>LO - {bunker.lo_details.length}</button></td>
                                    <td>{ bunker.vol_lo }</td>
                                    <td>{ bunker.vol_ar }</td>
                                    <td>{ bunker.surveyor }</td>
                                    <td style={editReport? {} : {display: "none"} }>
                                        <Link to={`/bunker/edit/${bunker.id}`} className="btn btn-outline-warning btn-sm"><i className="fa fa-pen"></i></Link>
                                    </td>

                                    <td style={editReport? {} : {display: "none"} }><button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteBunker(bunker.id)}><i className="fa fa-trash"></i></button></td>
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
        </>
    );
}