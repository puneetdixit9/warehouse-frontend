import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { useEffect, useState } from "react";
import AuthService from '../services/auth.service'


function HomePage() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
    useEffect(() => {
        if (!user) {
            AuthService.get_profile({}).then((response) => {
                if (response.status === 200) {
                    setUser(response.data)
                    localStorage.setItem("user", JSON.stringify(response.data))                
                } else {
                    console.error("Error in fetching profile")
                }
            }).catch((error) => console.error(error));
        }    
    }, []);

    return (
        <div className="home-page">
            {user ? <h1>Hi {user.first_name ? user.first_name : user.username}! </h1> : <h1>Warehouse Manpower Plannner</h1>}
            <p>
                Warehouse Manpower Plannner is a tool to plan man-power of a
                warehouse according to productivity of employees (New and Experienced)
                and Forecasted Demands
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
