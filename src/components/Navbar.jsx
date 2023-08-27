import SILogo from '/logo.png'
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useCallback } from "react";

import { useAuth } from "../context/Auth";
import { Link } from 'react-router-dom';

export default function Navbar() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    
    const logout = useCallback(
      (e) => {
        e.preventDefault();
        setAuth(null);
        localStorage.clear();
        navigate("/login");
      },
      [navigate, setAuth]
    );
    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg shadow-sm bg-body">
                <div className="container-fluid">
                    <Link to="/home" className="navbar-brand">
                        <img src={SILogo} alt="" height="36" width="282"></img>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={() => handleNavCollapse()}>
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isNavCollapsed? 'hide':'show'}`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" onClick={() => handleNavCollapse()}>
                        <li className="nav-item">
                            <NavLink to="/home" className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/loadingsurvey" className="nav-link">Loading Survey</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/bunkersurvey" className="nav-link">Bunker Survey</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/report" className="nav-link">Survey Report</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {auth?.data?.user?.name}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" onClick={() => handleNavCollapse()}>
                                <li className="dropdown-item">
                                    <NavLink to="/profile" className="nav-link"><i className="fa fa-user"></i> Profile</NavLink>
                                </li>
                                <li className="dropdown-item">
                                    <NavLink to="/password" className="nav-link"><i className="fa fa-key"></i> Password Change</NavLink>
                                </li>
                                <li className="dropdown-item" hidden={`${auth?.data?.user?.role !== 'admin'? 'hidden' : ''}`}>
                                    <NavLink to="/setting" className="nav-link"><i className="fa fa-tools"></i> Settings</NavLink>
                                </li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><button className="dropdown-item" onClickCapture={logout}><i className="fa fa-power-off"></i> Logout</button></li>
                            </ul>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}