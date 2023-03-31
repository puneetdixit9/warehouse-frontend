import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "./services/auth.service";


const Home = () => {

    const navigate=useNavigate();

    const login = () => {
        navigate('/login')
      }

    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                <form onSubmit={login} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>Sample Project</h2>
                        </div>

                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Login</button> |
                            <Link className="btn btn-success" to={'/register'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;