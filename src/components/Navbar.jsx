import SILogo from '/logo.png'
import { NavLink } from 'react-router-dom';
export default function Navbar() {
    return (
        <>
            <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                    <img src={SILogo} alt="" height="36" width="282"></img>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
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
                                Hari Pranata
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li className="dropdown-item">
                                    <NavLink to="/profile" className="nav-link">Profile</NavLink>
                                </li>
                                <li className="dropdown-item">
                                    <NavLink to="/password" className="nav-link">Password Change</NavLink>
                                </li>
                                <li><hr className="dropdown-divider"></hr></li>
                                <li><a className="dropdown-item" href="#">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}