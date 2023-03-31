import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Requirement = () => {
    let requirements = JSON.parse(localStorage.getItem('requirementData'))
    
    const [num_current_employees, setCurrentEmployee] = useState("");
    const [day_working_hours, setWorkingHours] = useState("");
    const [cost_per_employee_per_month, setCostPerEmployee] = useState("");
    const [total_hiring_budget, setTotalHiringBudget] = useState("");
    const [percentage_absent_expected, setAbsentExpected] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (requirements) {
            setCurrentEmployee(requirements["num_current_employees"])
            setAbsentExpected(requirements["percentage_absent_expected"])
            setCostPerEmployee(requirements["cost_per_employee_per_month"])
            setTotalHiringBudget(requirements["total_hiring_budget"])
            setWorkingHours(requirements["day_working_hours"])
        }
    }, []);

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = "Please enter the value in ";
        if (num_current_employees === null || num_current_employees === "") {
            isproceed = false;
            errormessage += " num_current_employees";
        }
        if (day_working_hours === null || day_working_hours === "") {
            isproceed = false;
            errormessage += " day_working_hours";
        }
        if (
            cost_per_employee_per_month === null ||
            cost_per_employee_per_month === ""
        ) {
            isproceed = false;
            errormessage += " cost_per_employee_per_month";
        }
        if (total_hiring_budget === null || total_hiring_budget === "") {
            isproceed = false;
            errormessage += " total_hiring_budget";
        }
        if (
            percentage_absent_expected === null ||
            percentage_absent_expected === ""
        ) {
            isproceed = false;
            errormessage += " percentage_absent_expected";
        }

        if (!isproceed) {
            toast.warning(errormessage);
        }
        return isproceed;
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        if (IsValidate()) {
            let warehouse = localStorage.getItem("warehouse");
            warehouse = JSON.parse(warehouse);
            let warehouse_id = warehouse["id"];
            let plan_from_date = warehouse["startDate"];
            let plan_to_date = warehouse["endDate"];
            let requirementData = {
                total_hiring_budget,
                num_current_employees,
                percentage_absent_expected,
                day_working_hours,
                cost_per_employee_per_month,
                warehouse_id,
                plan_from_date,
                plan_to_date,
            };
            localStorage.setItem("requirementData", JSON.stringify(requirementData))
            navigate("/manpower-planner/result")
        }
    };
    const handleCancelClick = () => {
        localStorage.removeItem("warehouse")
        localStorage.removeItem("requirementData")
        navigate('/dashboard')
      };

    const handleReset = (e) => {
        e.preventDefault();
        setCurrentEmployee("")
        setAbsentExpected("")
        setCostPerEmployee("")
        setTotalHiringBudget("")
        setWorkingHours("")
    }
    return (
        <div className="row">
            <div
                className="offset-lg-3 col-lg-6"
                style={{ marginTop: "100px" }}
            >
                <form onSubmit={handlesubmit} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>Enter Requiremnets</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>
                                    Enter % of absentees Expected{" "}
                                    <span className="errmsg">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={percentage_absent_expected}
                                    onChange={(e) =>
                                        setAbsentExpected(e.target.value)
                                    }
                                    className="form-control"
                                    min="0"
                                    max="100"
                                ></input>
                            </div>
                            <div className="form-group">
                                <label>
                                    Number of Current Employee{" "}
                                    <span className="errmsg">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={num_current_employees}
                                    onChange={(e) =>
                                        setCurrentEmployee(e.target.value)
                                    }
                                    className="form-control"
                                ></input>
                            </div>

                            <div className="form-group">
                                <label>
                                    Total Hiring Budget{" "}
                                    <span className="errmsg">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={total_hiring_budget}
                                    onChange={(e) =>
                                        setTotalHiringBudget(e.target.value)
                                    }
                                    className="form-control"
                                ></input>
                            </div>
                            <div className="form-group">
                                <label>
                                    Cost Per Employee{" "}
                                    <span className="errmsg">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={cost_per_employee_per_month}
                                    onChange={(e) =>
                                        setCostPerEmployee(e.target.value)
                                    }
                                    className="form-control"
                                ></input>
                            </div>
                            <div className="form-group">
                                <label>
                                    Working Hours{" "}
                                    <span className="errmsg">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={day_working_hours}
                                    onChange={(e) =>
                                        setWorkingHours(e.target.value)
                                    }
                                    className="form-control"
                                    min="0"
                                    max="24"
                                ></input>
                            </div>
                        </div>
                        <div className="card-footer">
                        <Link className="btn btn-primary btn-lg mx-1" to={"/manpower-planner/expected-demands"} >Prev</Link>
                        <button type="submit" className="btn btn-primary btn-lg mx-1" style={{
                                  backgroundColor: "green",
                              }}>Calculate</button>
                        <button className="btn btn-primary btn-lg mx-1" onClick={handleReset} style={{
                                  backgroundColor: "lightgreen",
                              }}>Reset</button>
                        <button className="btn btn-primary btn-lg position-absolute bottom-0 end-0 m-2" onClick={handleCancelClick} style={{
                                  backgroundColor: "red",
                              }}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Requirement;
