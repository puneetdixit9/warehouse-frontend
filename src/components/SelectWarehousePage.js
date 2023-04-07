import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseService from '../services/warehouse.service'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/SelectWarehouse.css";

const SelectWarehouse = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedWarehouse, setSelectedWarehouse] = useState("");

    useEffect(() => {
        let token = localStorage.getItem("token");
        let warehouse = localStorage.getItem("warehouse");
        warehouse = JSON.parse(warehouse);
        if (warehouse) {
            setStartDate(new Date(warehouse["startDate"]));
            setEndDate(new Date(warehouse["endDate"]));
            setSelectedWarehouse(warehouse["id"]);
        }
        token = JSON.parse(token);
        if (!token) {
            navigate("/login");
        }
        WarehouseService.getWarehouses({}).then((response) => {
            if (response.status === 200) {
                setWarehouses(response.data)
            } else {
                console.error("Error in fetching warehouse")
            }
        }).catch((error) => console.error(error));

    }, []);

    const handleWarehouseChange = (e) => {
        setSelectedWarehouse(e.target.value);
    };

    const handleNextClick = () => {
        if (!selectedWarehouse) {
            console.log("warehouse not selected");
        } else if (startDate > endDate) {
            alert("End date cannot greater the start date");
            return;
        } else {
            const warehouse = {
                id: selectedWarehouse,
                startDate: startDate.toISOString().slice(0, 10),
                endDate: endDate.toISOString().slice(0, 10),
            };
            localStorage.setItem("warehouse", JSON.stringify(warehouse));
            navigate("/manpower-planner/productivity");
        }
    };

    const handleCancelClick = () => {
        localStorage.removeItem("warehouse");
        navigate("/");
    };

    return (
        <div>
            <div
                className="offset-lg-3 col-lg-6"
                style={{ marginTop: "100px" }}
            >
                <form onSubmit={handleNextClick} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>Select warehouse and planning horizon</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>
                                    Warehouse <span className="errmsg">*</span>
                                </label>
                                <select
                                    id="warehouse-select"
                                    className="form-control"
                                    onChange={handleWarehouseChange}
                                    value={selectedWarehouse}
                                    required
                                >
                                    {" "}
                                    <option value="">Select a warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option
                                            key={warehouse.id}
                                            value={warehouse.id}
                                        >
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="start-date-picker">
                                    Start Date: <span className="errmsg">*</span>
                                </label>
                                <br />
                                <DatePicker
                                    id="start-date-picker"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="start-date-picker">
                                    End Date: <span className="errmsg">*</span>
                                </label>
                                <br />
                                <DatePicker
                                    id="end-date-picker"
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={new Date()}
                                />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleNextClick}
                                style={{
                                    backgroundColor: "green",
                                }}
                            >
                                Next
                            </button>
                            <button
                                className="btn btn-primary btn-lg position-absolute bottom-0 end-0 m-2"
                                style={{
                                    backgroundColor: "red",
                                }}
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SelectWarehouse;
