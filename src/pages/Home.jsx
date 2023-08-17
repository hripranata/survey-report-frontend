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

    const handleLoadingCounter = async () => {
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

    useEffect(() => {
        handleLoadingCounter()
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
                            <span className="count-numbers">{loadingCounter.total_loading} {loadingCounter.total_loading}</span>
                            <span className="count-name">Loadings</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter danger">
                            <i className="fa fa-anchor"></i>
                            <span className="count-numbers">{bunkerCounter.total_bunker}</span>
                            <span className="count-name">Bunker</span>
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
            </div>
        
        </>
    )
}