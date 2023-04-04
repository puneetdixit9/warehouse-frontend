import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WarehouseService from '../services/warehouse.service';
import { Modal, Button } from "react-bootstrap";

function Productivity() {
    const [data, setData] = useState([]);
    const fileInputRef = useRef(null);
    const [fileSelected, setFileSelected] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const warehouse = JSON.parse(localStorage.getItem("warehouse"));
    const [fileUploading, setFileUploading] = useState(false);
    const [updatedProductivity, setUpdatedProductivity] = useState([]);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 25);
        if (!user) {
            navigate("/login");
        }
        if (!warehouse) {
            navigate("/manpower-planner/select-warehouse");
        }
        getProductivityData();
    }, []);

    const handleCancelClick = () => {
        localStorage.removeItem("warehouse");
        navigate("/");
    };

    const getProductivityData = () => {
        WarehouseService.getProductivityData({remainingPath: warehouse["id"]}).then((response) => {
            if (response.status === 200) {
                setData(response.data)
            } else {
                console.error("Error in fetching warehouse")
            }
        }).catch((error) => console.error(error));
    }
    const handleProductivityChange = (id, fieldName, value) => {
        const newData = [...data];
        value = parseInt(value);
        const indexInOriginalData = newData.findIndex((obj) => obj.id === id);
        newData[indexInOriginalData][fieldName] = value;
        setData(newData);

        const index = updatedProductivity.findIndex((obj) => obj.id === id);
        if (index !== -1) {
            updatedProductivity[index][fieldName] = value;
        } else {
            const newUpdatedProductivity = {
                id: id,
                [fieldName]: value,
            };
            updatedProductivity.push(newUpdatedProductivity);
        }
    };

    const handleSaveClick = () => {
        WarehouseService.updateProductivityData({body: JSON.stringify({productivity: updatedProductivity})}).then((response) => {
            if (response.status === 200) {
                setUpdatedProductivity([]);
            } else if (response.status === 400) {
                alert("Invalid Values")
            } else {
                console.error("Error in updating warehouse")
            }
        }).catch((error) => console.error(error));
    };

    const handleFileSelected = () => {
        setFileSelected(true);
    };

    const handleNextButtonClick = () => {
        if (updatedProductivity.length > 0) {
            setShowDialog(true);
        } else {
            navigate("/manpower-planner/expected-demands");
        }
    };

    const handleUploadFile = (event) => {
        event.preventDefault();
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);
        setFileUploading(true);
        WarehouseService.uploadProductivityFile({ remainingPath: warehouse["id"], body: formData}).then((response) => {
            if (response.status === 201) {
                alert("File uploaded successfully");
                getProductivityData();
            } else {
                alert("Error in File : " + response.data.error);
            }
            setFileUploading(false);
            setFileSelected(false);
            fileInputRef.current.value = "";
        }).catch((error) => {
            console.error("Error uploading file:", error);
            setFileUploading(false);
            setFileSelected(false);
            fileInputRef.current.value = "";
        });
    };

    const handleClose = () => setShowDialog(false);

    const handleYesClick = () => {
        setShowDialog(false);
        navigate("/manpower-planner/expected-demands");
    };

    return (
        <div className="container mt-5" style={{ position: "relative" }}>
            <h4>
                Benchmark productivity for selected warehouse and categories has
                been auto-filled. Type in values or upload new benchmark
                productivity file, if necessary.
            </h4>
            <div style={{ height: "300px", overflowX: "auto" }}>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th
                                style={{
                                    width: "50px",
                                    position: "sticky",
                                    zIndex: 1,
                                    background: "#ddd",
                                    top: "0",
                                }}
                            >
                                Category Name
                            </th>
                            <th
                                style={{
                                    width: "50px",
                                    position: "sticky",
                                    zIndex: 1,
                                    background: "#ddd",
                                    top: "0",
                                }}
                            >
                                Productivity Experienced Employee
                            </th>
                            <th
                                style={{
                                    width: "50px",
                                    position: "sticky",
                                    zIndex: 1,
                                    background: "#ddd",
                                    top: "0",
                                }}
                            >
                                Productivity New Employee
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.category_name}</td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        value={
                                            item.productivity_experienced_employee
                                        }
                                        onChange={(event) =>
                                            handleProductivityChange(
                                                item.id,
                                                "productivity_experienced_employee",
                                                event.target.value
                                            )
                                        }
                                        style={{ width: "60px" }}
                                    />
                                </td>
                                <td className="text-center">
                                    <input
                                        type="number"
                                        value={item.productivity_new_employee}
                                        onChange={(event) =>
                                            handleProductivityChange(
                                                item.id,
                                                "productivity_new_employee",
                                                event.target.value
                                            )
                                        }
                                        style={{ width: "60px" }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <br></br>
            <button
                className="btn btn-primary btn-lg"
                onClick={handleSaveClick}
                style={{
                    width: "100px",
                    fontSize: "14px",
                    alignItems: "center",
                    borderRadius: "10px",
                    cursor: updatedProductivity.length ? "pointer" : "default",
                    backgroundColor: updatedProductivity.length ? "#007bff" : "#CCCCCC",
                    color: "#FFFFFF",
                }}
                disabled={!updatedProductivity.length}
            >
                Save Data
            </button>
            <br></br>
            <div>
                <h3>
                    Upload Benchmark Productivity File{" "}
                    <h6>(Only .xls and .xlsx files supported)</h6>{" "}
                </h3>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                />
                <button
                    style={{
                        width: "100px",
                        fontSize: "14px",
                        alignItems: "center",
                        borderRadius: "10px",
                        cursor: fileSelected ? "pointer" : "default",
                        backgroundColor: fileSelected ? "#007bff" : "#CCCCCC",
                        color: "#FFFFFF",
                    }}
                    onClick={handleUploadFile}
                    disabled={!fileSelected}
                >
                    {fileUploading ? "Uploading..." : "Upload"}
                </button>
            </div>
            <br></br>
            <Link
                className="btn btn-primary btn-lg mx-1"
                to={"/manpower-planner/select-warehouse"}
            >
                Prev
            </Link>
            <button
                className="btn btn-primary btn-lg mx-1"
                onClick={handleNextButtonClick}
                style={{
                    backgroundColor: "green",
                }}
            >
                Next
            </button>
            <button
                className="btn btn-primary btn-lg position-absolute bottom-0 end-0 m-3"
                onClick={handleCancelClick}
                style={{
                    backgroundColor: "red",
                }}
            >
                Cancel
            </button>
            <Modal show={showDialog} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You have some unsaved data. Do you want to continue without
                    saving?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleYesClick}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Productivity;
