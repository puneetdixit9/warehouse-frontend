import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

import { Link, useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function Dashboard() {
    const user = {
        username: "johndoe",
        firstName: "Puneet",
    };

    // const [data, setData] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        if (!user) {
            navigate("/login");
        }
        //   fetch('https://jsonplaceholder.typicode.com/todos/1')
        //     .then(response => response.json())
        //     .then(json => setData(json));
        // setData(data)
    }, []);

    function handleLogout() {
        setShowLogout(true);
    }

    function confirmLogout() {
        AuthService.logoutAccessToken();
        AuthService.logoutRefreshToken();
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                <h2>Welcome back, {user.firstName}!</h2>
                <div className="dashboard-nav">
                    <Link
                        to="/profile"
                        className="dashboard-nav-button dashboard-nav-profile"
                    >
                        Profile
                    </Link>
                    <Link
                        to="/manpower-planner/select-warehouse"
                        className="dashboard-nav-button dashboard-nav-manpowerplanner"
                    >
                        Manpower Planing
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="dashboard-nav-button"
                    >
                        Logout
                    </button>
                </div>
                {/* <div className="dashboard-content">
                    <p>You can plan warehouse manpowe </p>
                </div> */}
            </div>
            {showLogout && (
                <div className="dashboard-dialog">
                    <p>Are you sure you want to logout?</p>
                    <div className="dashboard-dialog-buttons">
                        <button onClick={() => setShowLogout(false)}>
                            Cancel
                        </button>

                        | |<button onClick={confirmLogout}>Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
