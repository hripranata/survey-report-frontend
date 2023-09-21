import { useState, useEffect } from 'react'
import TopLoadingBar from "../components/TopLoadingBar";
import { useAuth } from "../context/Auth";
import axios from "axios";

export default function Home() {
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
    
    const [orderList, setOrderList] = useState([])
    const handleOrderList = async (month, year) => {
        setMonth(month)
        setYear(year)
        await axios.get(`${API_URL}/api/loadings/filter/${month}/${year}`, {
            headers: headers
        })
        .then((res) => {
            setOrderList(res.data.data);
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
                <div className="row">
                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter primary">
                            <i className="fa fa-ship"></i>
                            <span className="count-numbers">{loadingCounter.total_loading}</span>
                            <span className="count-name">Total Loadings</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter danger">
                            <i className="fa fa-anchor"></i>
                            <span className="count-numbers">{bunkerCounter.total_bunker}</span>
                            <span className="count-name">Total Bunker</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter info">
                            <i className="fa fa-oil-can"></i>
                            <span className="count-numbers">{loadingCounter.total_lo} L</span>
                            <span className="count-name">Total LO</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter success">
                            <i className="fa fa-gas-pump"></i>
                            <span className="count-numbers">{bunkerCounter.total_ar} L</span>
                            <span className="count-name">Total AR</span>
                        </div>
                    </div>

                </div>

                <div className="accordion mt-3" id="accordionExample">
                    { orderList.length > 0 ?
                        orderList?.map((order, index) => (
                            
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
                        :   <div className="text-center">
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