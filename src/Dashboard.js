import React, { useState, useEffect } from "react";
import './Dashboard.css'
import MainService from "./services/main.services";
import AuthService from "./services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  let user = localStorage.getItem("user")
  user = JSON.parse(user)
  useEffect(() => {
    if (user) {
      MainService.getAddress().then(
        (response) => {
            setAddresses(response[1]);
          },
          (error) => {
            const _content =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
              setAddresses(_content);
          }
        );
    } else {
      navigate('/login')
    }
      }, []);

    const logout = () => {
      AuthService.logout().then(
        (response) => {
          if (response[0] === 200) {
            navigate('/login')
          } else {
            toast.error('Error in logout')
          }
        }
      )
      localStorage.removeItem("user")
    }

    const change_password = () => {
      navigate('/change_password')
    }

  return (  
    <div>
            <div className="offset-lg-3 col-lg-6">
                <form className="container">
                    <div className="card">
                        <div className="card-header">
                            <h1>Addresses</h1>
                        </div>
                        {addresses.length > 0 &&
                        <table>
                          <tr key={"header"}>
                            {Object.keys(addresses[0]).map((key) => (
                              <th>{key}</th>
                            ))}
                          </tr>
                          {addresses.map((item) => (
                            <tr key={item.id}>
                              {Object.values(item).map((val) => (
                                <td>{val}</td>
                              ))}
                            </tr>
                          ))}
                        </table>
                        }
                        <div className="card-footer">
                            {user && user.role === "user" &&
                            <Link to={'/add_address'} className="btn btn-danger">Add New Address</Link>
                            } |
                            <button onClick={change_password} className="btn btn-primary">Change Password</button> |
                            <button onClick={logout} className="btn btn-primary">Logout</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
)  
}
export default Dashboard;