import { useEffect } from 'react'
import TopLoadingBar from "../components/TopLoadingBar";
import { useAuth } from "../context/Auth";

export default function Home() {
    const { setProgress } = useAuth();
    useEffect(() => {
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
                            <span className="count-numbers">12</span>
                            <span className="count-name">Loadings</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter danger">
                            <i className="fa fa-anchor"></i>
                            <span className="count-numbers">599</span>
                            <span className="count-name">Bunker</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter info">
                            <i className="fa fa-oil-can"></i>
                            <span className="count-numbers">1.150.000 L</span>
                            <span className="count-name">Total LO</span>
                        </div>
                    </div>

                    <div className="col-md-3" style={{position: "relative"}}>
                        <div className="card-counter success">
                            <i className="fa fa-gas-pump"></i>
                            <span className="count-numbers">1.149.995 L</span>
                            <span className="count-name">Total AR</span>
                        </div>
                    </div>

                </div>
            </div>
        
        </>
    )
}