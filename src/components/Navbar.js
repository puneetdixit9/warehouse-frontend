import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from "../services/auth.service";
import { Modal, Button } from "react-bootstrap";


function Navbar() {
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        setShowLogout(true);
    }

    const confirmLogout = () => {
        AuthService.logoutAccessToken();
        AuthService.logoutRefreshToken();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowLogout(false);
        navigate("/login");
    }
    
  return (
    <div style={{position: 'sticky', top: 0, zIndex: 9999}}>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" width="100%" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          { token ? 
          <li className="nav-item">
            <Link className="nav-link" to="/profile">Profile</Link>
          </li>
          : null}
          { !token && window.location.pathname !== "/login"? 
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
          : null}
          { !token && window.location.pathname !== "/signup"? 
          <li className="nav-item">
            <Link className="nav-link" to="/signup">Signup</Link>
          </li>
          : null}
          { token && window.location.pathname !== "/login" && window.location.pathname !== "/signup"? 
          <li className="nav-item">
            <Link className="nav-link" to="/manpower-planner/select-warehouse">Manpower Planner</Link>
          </li>
          : null}
        </ul>
      </div>
      {token && window.location.pathname !== "/login" && window.location.pathname !== "/signup"? 
      <button className="nav-item mr-3 nav-link p-3" onClick={handleLogout} style={{
        width: "90px",
        fontSize: "15px",
        alignItems: "center",
        borderRadius: "15px",
        backgroundColor: "red",
        color: "#FFFFFF",
    }}>Logout</button>
    : null}
    </nav>
    <Modal show={showLogout} onHide={() => setShowLogout(false)} style={{zIndex: 10000}}>
                <Modal.Header closeButton>
                    <Modal.Title>Conformation!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                Are you sure you want to logout??
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogout(false)}>
                        No
                    </Button>
                    <Button variant="primary" onClick={confirmLogout}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
  );
}

export default Navbar;
