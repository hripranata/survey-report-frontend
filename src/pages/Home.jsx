import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import TopLoadingBar from "../components/TopLoadingBar";
import { useAuth } from "../context/Auth";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate()
    const { auth, setProgress } = useAuth();
    const [loadingCounter, setLoadingCounter] = useState({});
    const [bunkerCounter, setBunkerCounter] = useState({});
    const now = new Date()

    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : 'Bearer ' + auth.data.token
    }
    const API_URL = "http://localhost:8000";

    const handleCounter = async () => {
        await axios.get(`${API_URL}/api/loadings/count/${now.getMonth()+1}`, {
            headers: headers
        })
        .then((res) => {
            setLoadingCounter(res.data.data);
        })
        .catch((err) => {
            console.error(err);
        })
        await axios.get(`${API_URL}/api/bunkers/count/${now.getMonth()+1}`, {
            headers: headers
        })
        .then((res) => {
            setBunkerCounter(res.data.data);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    
    const [month, setMonth] = useState(now.getMonth()+1)
    const [year, setYear] = useState(now.getFullYear())
    
    const [orderList, setOrderList] = useState(
        {
            data: [],
            status: null
        }
    )
    const handleOrderList = async (month, year) => {
        setMonth(month)
        setYear(year)
        await axios.get(`${API_URL}/api/loadings/filter/${month}/${year}`, {
            headers: headers
        })
        .then((res) => {
            if (res.data.data.length > 0) {
                setOrderList((prev) => ({ 
                    ...prev,
                    data: res.data.data,
                    status: 1 
                }));
            } else {
                setOrderList((prev) => ({ 
                    ...prev,
                    data: [],
                    status: 0
                }));
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const [vesselList, setVesselList] = useState([])
    const handleVesselList = async (month, year) => {
        setMonth(month)
        setYear(year)
        await axios.get(`${API_URL}/api/bunkers/filter/${month}/${year}`, {
            headers: headers
        })
        .then((res) => {
            setVesselList(res.data.data);
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const handleViewBunkerReport = () => {
        return navigate('/report', {state: {report: 1}});
    }

    useEffect(() => {
        handleCounter()
        handleOrderList(month, year)
        handleVesselList(month, year)
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            <div className="container mt-5 pt-4">
                {/* <div className="row">
                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter primary">
                            <i className="fa fa-ship fa-3x"></i>
                            <span className="count-numbers">{loadingCounter.total_loading}</span>
                            <span className="count-name">Total Loadings</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter danger">
                            <i className="fa fa-anchor fa-3x"></i>
                            <span className="count-numbers">{bunkerCounter.total_bunker}</span>
                            <span className="count-name">Total Bunker</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter info">
                            <i className="fa fa-oil-can fa-3x"></i>
                            <span className="count-numbers">{loadingCounter.total_lo} L</span>
                            <span className="count-name">Total LO</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter success">
                            <i className="fa fa-gas-pump fa-3x"></i>
                            <span className="count-numbers">{bunkerCounter.total_ar} L</span>
                            <span className="count-name">Total AR</span>
                        </div>
                    </div>

                </div> */}

                <div className="mx-auto my-1 p-2" style={{width: "auto"}}>
                    
                    {/* <div className="card panel-card">
                    <div className="card-body text-dark" style={{backgroundColor: "#fafafa"}}> */}
                        <div className="row">
                        <div className="col-6 p-1">
                            <div className="card border-primary">
                            <div className="card-body primary pb-0">
                                <i className="fas fa-ship fa-3x pb-4"></i>
                                <div className="d-flex justify-content-between">
                                    <p className="mb-0 h5">{loadingCounter.total_loading}</p>
                                    <p className="mb-0 hour">Vessel</p>
                                </div>
                            </div>
                            <hr className='text-primary'/>
                            <div className="card-body pt-0">
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-bold mt-2 mb-1">Total Loading</h6>
                                    <Link to="/loadingsurvey">
                                        <button type='button' className="btn btn-outline-primary">Survey</button>
                                    </Link>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-6 p-1">
                            <div className="card border-primary">
                            <div className="card-body danger pb-0">
                                <i className="fas fa-anchor fa-3x pb-4"></i>
                                <div className="d-flex justify-content-between">
                                    <p className="mb-0 h5">{bunkerCounter.total_bunker}</p>
                                    <p className="mb-0 hour">KRI</p>
                                </div>
                            </div>
                            <hr className='text-primary' />
                            <div className="card-body pt-0">
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-bold mt-2 mb-1">Total Bunker</h6>
                                    <Link to="/bunkersurvey">
                                        <button type='button' className="btn btn-outline-primary">Survey</button>
                                    </Link>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-6 p-1">
                            <div className="card border-primary">
                            <div className="card-body success pb-0">
                                <i className="fas fa-oil-can fa-3x pb-4"></i>
                                <div className="d-flex justify-content-between">
                                <p className="mb-0 h5">{loadingCounter.total_lo}</p>
                                <p className="mb-0 hour">Liter</p>
                                </div>
                            </div>
                            <hr className='text-primary' />
                            <div className="card-body pt-0">
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-bold mt-2 mb-1">LO Volume</h6>
                                    <Link to="/report">
                                        <button type='button' className="btn btn-outline-primary">View Report</button>
                                    </Link>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-6 p-1">
                            <div className="card border-primary">
                            <div className="card-body info pb-0">
                                <i className="fas fa-gas-pump fa-3x pb-4"></i>
                                <div className="d-flex justify-content-between">
                                <p className="mb-0 h5">{bunkerCounter.total_ar}</p>
                                <p className="mb-0 hour">Liter</p>
                                </div>
                            </div>
                            <hr className='text-primary' />
                            <div className="card-body pt-0">
                                <div className="d-flex justify-content-between">
                                    <h6 className="font-weight-bold mt-2 mb-1">AR Volume</h6>
                                    <button type='button' className="btn btn-outline-primary" onClick={()=>handleViewBunkerReport()}>View Report</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                    {/* </div>
                    </div> */}
                    
                </div>


                <h2 className='mt-3'><strong>Vessel Order List</strong></h2>

                <div className="accordion mt-3" id="accordionExample">
                    { orderList?.status == 1 ?
                        orderList?.data.map((order, index) => (
                            
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header">
                                <button className={`accordion-button ${index == 0?'':'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded={index == 0?"true":"false"} aria-controls={`collapse${index}`}>
                                    {order.tongkang?.vessel_name} / {order.bbm} - {order.vol_lo} / {order.lo_date}
                                </button>
                                </h2>
                                <div id={`collapse${index}`} className={`accordion-collapse collapse ${index == 0?'show':''}`} data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                    <table className="table table-bordered mb-2 text-center">
                                    <thead>
                                        <tr>
                                            <th>LO</th>
                                            <th>Vessel</th>
                                            <th>Product</th>
                                            <th>QTY</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {order.lo_details?.map((lo, index) => (
                                        <tr key={index}>
                                            <td>{lo.lo_number}</td>
                                            <td>{vesselList.map(vsl => {
                                                if (vsl.id === lo.bunker_id) {
                                                    return vsl.kri?.vessel_name
                                                } 
                                            })}
                                            </td>
                                            <td>{lo.product}</td>
                                            <td>{lo.qty}</td>
                                            <td><i className="fa fa-check" style={{color: "#1E968C"}} hidden={lo.bunker_id !== null?'':'hidden'}></i></td>
                                        </tr>
                                    ))}
                                        <tr>
                                            <td colSpan="3" className="text-end">Total</td>
                                            <td colSpan="2" className="text-start">{order.vol_lo}</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                    {/* <div className="text-end">
                                        <button type="button" className="btn btn-primary" onClick={()=> handleSaveScrape(order)}>Select</button>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        ))
                        : orderList?.status == 0 ?
                            <div className="text-center">
                                {/* <p>Order List !</p> */}
                                <div className="alert alert-danger mb-0">
                                    Data Belum Tersedia !
                                </div>
                            </div>   
                        :
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                    }
                </div>
                
            </div>
        
        </>
    )
}