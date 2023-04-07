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
            <p>Use this tool to estimate manpower requirements and generate manpower deployment plan basis forecasted demand, hiring budget and other details.</p>
        </div>
    );
}

export default HomePage;
