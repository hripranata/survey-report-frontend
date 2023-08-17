import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import LoadingReport from "../components/LoadingReport";
import BunkerReport from "../components/BunkerReport";
import TopLoadingBar from "../components/TopLoadingBar";
import { useAuth } from "../context/Auth";

export default function Report() {
    const [currentReport, setCurrentReport] = useState(0)
    const { state } = useLocation();

    const handleCurrentView = () => {
        if (state !== null) {
            setCurrentReport(state.report)
        } else {
            setCurrentReport(0)
        }
    }

    const { setProgress } = useAuth();
    useEffect(() => {
        handleCurrentView()
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            <div className="container shadow-sm p-3 bg-body rounded">
                <nav className="mt-5 pt-4">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className={`nav-link ${currentReport == 0? 'active' : ''}`}  id="nav-loading-tab" data-bs-toggle="tab" data-bs-target="#nav-loading" type="button" role="tab" aria-controls="nav-loading" aria-selected="true">Loading Report</button>
                        <button className={`nav-link ${currentReport == 1? 'active' : ''}`} id="nav-bunker-tab" data-bs-toggle="tab" data-bs-target="#nav-bunker" type="button" role="tab" aria-controls="nav-bunker" aria-selected="false">Bunker Report</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent" >
                    <div className={`tab-pane fade ${currentReport == 0? 'show active' : ''}`} id="nav-loading" role="tabpanel" aria-labelledby="nav-loading-tab" tabIndex="0">
                        <LoadingReport/>
                    </div>
                    <div className={`tab-pane fade ${currentReport == 1? 'show active' : ''}`} id="nav-bunker" role="tabpanel" aria-labelledby="nav-bunker-tab" tabIndex="0">
                        <BunkerReport/>
                    </div>
                </div>

            </div>
        </>
    )
}