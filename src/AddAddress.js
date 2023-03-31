import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainService from "./services/main.services";

const AddAddress = () => {

    const [country, countrychange] = useState("");
    const [house_no_and_street, house_no_and_streetchange] = useState("");
    const [landmark, landmarkchange] = useState("");
    const [pin_code, pin_codechange] = useState("");
    const [type, typechange] = useState("");

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
        if (country === null || country === '') {
            isproceed = false;
            errormessage += ' country';
        }
        if (house_no_and_street === null || house_no_and_street === '') {
            isproceed = false;
            errormessage += ' house_no_and_street';
        }
        if (landmark === null || landmark === '') {
            isproceed = false;
            errormessage += ' landmark';
        }
        if (pin_code === null || pin_code === '') {
            isproceed = false;
            errormessage += ' pin_code';
        }
        if (type === null || type === '') {
            isproceed = false;
            errormessage += ' type';
        }

        if(!isproceed){
            toast.warning(errormessage)
        }
        return isproceed;
    }


    const handlesubmit = (e) => {
            e.preventDefault();
            if (IsValidate()) {
                const address = { country, house_no_and_street, landmark, pin_code, type}
                MainService.addAddress(address
            ).then((res) => {
                if(res[0] === 201){
                    toast.success('Address added successfully.')
                    navigate('/dashboard');
                } else {
                    let error = Object.keys(res[1])
                    toast.error('Error in '+ error.join(" "))       
                }
                
            }).catch((err) => {
                toast.error('Failed :' + err.message);
            });
        }
    }
    return (
        <div>
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handlesubmit}>
                    <div className="card">
                        <div className="card-header">
                            <h1>Add address</h1>
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>H.no & Street <span className="errmsg">*</span></label>
                                        <input value={house_no_and_street} onChange={e => house_no_and_streetchange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Landmark <span className="errmsg">*</span></label>
                                        <input value={landmark} onChange={e => landmarkchange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Pin Code <span className="errmsg">*</span></label>
                                        <input value={pin_code} onChange={e => pin_codechange(e.target.value)} type="number" className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Address Type <span className="errmsg">*</span></label>
                                        <select value={type} onChange={e => typechange(e.target.value)} className="form-control">
                                            <option value="home">Home</option>
                                            <option value="work">Work</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Country <span className="errmsg">*</span></label>
                                        <input value={country} onChange={e => countrychange(e.target.value)} className="form-control"></input>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Add</button> |
                            <Link to={'/dashboard'} className="btn btn-danger">Close</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddAddress;