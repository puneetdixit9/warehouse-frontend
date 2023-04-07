import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "../services/auth.service";

const Login = () => {
    const [email, emailupdate] = useState("");
    const [password, passwordupdate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const ProceedLogin = (e) => {
        e.preventDefault();
        if (validate()) {
            AuthService.login(email, password)
                .then((res) => {
                    localStorage.setItem("token", JSON.stringify(res));
                    const lastPath = localStorage.getItem("lastPath")
                    if (lastPath) {
                        localStorage.removeItem("lastPath")
                        navigate(lastPath)
                    } else {
                        navigate("/");
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    alert("Failed :" + err.message);
                });
        }
    };

    const validate = () => {
        let result = true;
        if (email === "" || email === null) {
            result = false;
            toast.warning("Please Enter email");
        }
        if (password === "" || password === null) {
            result = false;
            toast.warning("Please Enter Password");
        }
        return result;
    };
    return (
        <div className="row">
            <div
                className="offset-lg-3 col-lg-6"
                style={{ marginTop: "100px" }}
            >
                <form onSubmit={ProceedLogin} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>
                                    Email <span className="errmsg">*</span>
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) =>
                                        emailupdate(e.target.value)
                                    }
                                    className="form-control"
                                ></input>
                            </div>
                            <div className="form-group">
                                <label>
                                    Password <span className="errmsg">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        passwordupdate(e.target.value)
                                    }
                                    className="form-control"
                                ></input>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary mx-1">
                                Login
                            </button>{" "}
                            <Link className="btn btn-success mx-1" to={"/signup"}>
                                New User
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
