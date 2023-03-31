import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    return (
        <div className="home-page">
            <h1>Warehouse Manpower Plannner</h1>
            <p>
                Warehouse Manpower Plannner is a tool to plan man-power of a
                warehouse accoring to user inputs
            </p>
            <div className="button-container">
                <Link to="/login">
                    <button>Login</button>
                </Link>
                <Link to="/signup">
                    <button>Sign Up</button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
