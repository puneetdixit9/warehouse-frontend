import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const ChangePassword = () => {

    const [old_password, old_passwordchange] = useState("");
    const [new_password, new_passwordchange] = useState("");
    const [confirm_new_password, confirm_new_passwordchange] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        if (!user){
            navigate('/login');
        }
    }, []);
    

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';
        if (old_password === null || old_password === '') {
            isproceed = false;
            errormessage += ' old_password';
        }
        if (new_password === null || new_password === '') {
            isproceed = false;
            errormessage += ' new_password';
        }
        if (confirm_new_password === null || confirm_new_password === '') {
            isproceed = false;
            errormessage += ' confirm_new_password';
        }
        if (new_password !== confirm_new_password) {
            isproceed = false;
            errormessage += ' New password and Confirm new password are not matching';
        }

        if(!isproceed){
            alert(errormessage)
        }
        return isproceed;
    }


    const handlesubmit = (e) => {
            e.preventDefault();
            if (IsValidate()) {
                let body = {
                    old_password,
                    new_password
                }
                AuthService.changePassword({body: JSON.stringify(body)}
            ).then((response) => {
                if (response.status === 200) {
                    alert('Password changed successfully')
                    navigate('/profile');
                } else {
                    alert(JSON.stringify(response.data));
                }
            }).catch((err) => {
                alert('Failed :' + err.message);
            });
        }
    }
    return (
        <div>
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Change Password</h1>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Old Password <span className="errmsg">*</span></label>
                                        <input value={old_password} onChange={e => old_passwordchange(e.target.value)} type="password" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>New Password <span className="errmsg">*</span></label>
                                        <input value={new_password} onChange={e => new_passwordchange(e.target.value)} type="password" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Confirm New Password <span className="errmsg">*</span></label>
                                        <input value={confirm_new_password} onChange={e => confirm_new_passwordchange(e.target.value)} type="password" className="form-control"></input>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary btn-lg mx-1">Change Password</button>
                            <Link to={'/profile'} className="btn btn-danger btn-lg mx-1">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;