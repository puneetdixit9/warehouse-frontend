import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { useEffect } from "react";

function HomePage() {
    const user = localStorage.getItem("user")
    return (
        <div className="home-page">
            <h1>Warehouse Manpower Plannner</h1>
            <p>
                Warehouse Manpower Plannner is a tool to plan man-power of a
                warehouse accoring to user inputs
            </p>
            {user ? 
            <p>
                You can calculate the manpower by clicking on Manpower Calculator on the navigation bar
            </p> : null
            }
            
        </div>
    );
}

export default HomePage;
