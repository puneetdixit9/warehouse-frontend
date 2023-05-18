import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import WarehouseService from '../services/warehouse.service';

function ExpectedDemand() {
    const [updatedDemands, setUpdatedDemands] = useState([]);
    const [editableData, setEditableData] = useState([{}]);
    const token = JSON.parse(localStorage.getItem("token"));
    const warehouse = JSON.parse(localStorage.getItem("warehouse"));
    const [fileUploading, setFileUploading] = useState(false);

    const fileInputRef = useRef(null);
    const [fileSelected, setFileSelected] = useState(false);
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 25);
        if (!warehouse) {
            navigate("/manpower-planner/select-warehouse");
            return;
        }
        if (!token) {
            navigate("/login");
        }
        getDemandsData();
    }, []);

    const getDemandsData = () => {
        WarehouseService.getExpectedDemandsData({remainingPath: warehouse["id"] + "?start_date=" + warehouse["startDate"] + "&end_date=" + warehouse["endDate"]}).then((response) => {
            if (response.status === 200) {
                setEditableData([{}]);
                setEditableData(response.data);
            } else {
                console.error("Error in fetching demands")
            }
        }).catch((error) => console.error(error));
    };

    const handleSaveClick = () => {
        WarehouseService.updateExpectedDemandsData({body: JSON.stringify({demands: updatedDemands})}).then((response) => {
            if (response.status === 200) {
                setUpdatedDemands([]);
                getDemandsData()
            } else if (response.status === 400){
                alert("Invalid Values")
            } else {
                console.error("Error in updating demands forecasting")
            }
        }).catch((error) => {
            console.error(error)
        });
        
    };

    const categories = Object.keys(
        editableData[Object.keys(editableData)[0]]
    ).filter((category) => category !== "total")
    .sort((a, b) => {
        return editableData[Object.keys(editableData)[0]][a].category_id - editableData[Object.keys(editableData)[0]][b].category_id;
    });

    const handleDemandChange = (event, date, category) => {
        const newData = { ...editableData };
        newData[date][category].demand = parseInt(event.target.value);

        setEditableData(newData);
        const newUpdatedDemand = {
            id: newData[date][category].id,
            demand: newData[date][category].demand,
        };
        const index = updatedDemands.findIndex(
            (obj) => obj.id === newUpdatedDemand.id
        );
        if (index !== -1) {
            updatedDemands[index].demand = newUpdatedDemand.demand;
        } else {
            updatedDemands.push(newUpdatedDemand);
        }
        setUpdatedDemands(updatedDemands);
    };

    const handleCancelClick = () => {
        localStorage.removeItem("warehouse");
        navigate("/");
    };

    const handleNextButtonClick = () => {
        if (updatedDemands.length > 0) {
            setShowDialog(true);
        } else {
            navigate("/manpower-planner/requiremnts");
        }
    };

    const handleClose = () => setShowDialog(false);

    const handleYesClick = () => {
        setShowDialog(false);
        navigate("/manpower-planner/requiremnts");
    };

    const handleBlur = (event, date, category) => {
        const newData = { ...editableData };
        newData[date][category].demand = parseInt(event.target.value);
        setEditableData(newData);
    };

    const handleFileSelected = () => {
        setFileSelected(true);
    };

    const handleUploadFile = (event) => {
        event.preventDefault();
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("start_date", warehouse["startDate"]);
        formData.append("end_date", warehouse["endDate"]);
        setFileUploading(true);
        WarehouseService.uploadExpectedDemandsFile({ remainingPath: warehouse["id"], body: formData}).then((response) => {
            if (response.status === 201) {
                alert("File uploaded successfully");
                getDemandsData();
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

    const header = (
        <tr>
            <th
                style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    width: "200px",
                    background: "#ddd",
                    whiteSpace: "nowrap",
                    top: "0",
                }}
            >
                Date
            </th>
            {categories.map((category) => (
                <th
                    key={category}
                    style={{
                        width: "50px",
                        position: "sticky",
                        zIndex: 1,
                        background: "#ddd",
                        top: "0",
                    }}
                >
                    {category}
                </th>
            ))}
            <th
                style={{
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                    fontWeight: "bold",
                    background: "#ddd",
                    top: "0",
                }}
            >
                Total
            </th>
        </tr>
    );

    const rows = Object.entries(editableData).map(([date, values]) => {
        const rowTotal = values.total;
        let cells;
        if (date === "total") {
            cells = categories.map((category) => (
                <td
                    key={category}
                    style={{
                        fontWeight: "bold",
                        width: "120px",
                        position: "sticky",
                        bottom: "0",
                        background: "#ddd",
                    }}
                >
                    {values[category]}
                </td>
            ));
        } else {
            cells = categories.map((category) => (
                <td key={category} style={{ width: "80px" }}>
                    {values[category] ? (
                        <input
                            type="number"
                            defaultValue={values[category].demand}
                            onBlur={(event) =>
                                handleBlur(event, date, category)
                            }
                            onChange={(event) =>
                                handleDemandChange(event, date, category)
                            }
                            style={{ width: "60px" }}
                        />
                    ) : (
                        "-"
                    )}
                </td>
            ));
        }
        return (
            <tr key={date}>
                {date === "total" ? (
                    <td
                        style={{
                            position: "sticky",
                            left: 0,
                            fontWeight: "bold",
                            width: "200px",
                            background: "#ddd",
                            whiteSpace: "nowrap",
                            bottom: "0",
                            zIndex: "2",
                        }}
                    >
                        TOTAL
                    </td>
                ) : (
                    <td
                        style={{
                            position: "sticky",
                            left: 0,
                            fontWeight: "bold",
                            width: "200px",
                            background: "#fff",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {date}
                    </td>
                )}
                {cells}
                <td
                    className="text-center"
                    style={{
                        position: "sticky",
                        right: 0,
                        fontWeight: "bold",
                        width: "80px",
                        bottom: "0",
                        background: date === "total" ? "#ddd" : "#fff",
                    }}
                >
                    {rowTotal}
                </td>
            </tr>
        );
    });

    return (
        <div
            className="container mt-5"
            style={{
                position: "relative",
                overflowX: "auto",
                paddingRight: "16px",
            }}
        >
            <h4>
                Expected daily demand for selected warehouse and selected
                duration has been auto-filled. Type in values or upload new
                demand forecast file, if necessary.
            </h4>
            <div
                style={{
                    height: "300px",
                    overflowY: "scroll",
                    overflowX: "scroll",
                }}
            >
                <table className="table table-bordered table-striped">
                    <thead style={{ zIndex: 1 }}>{header}</thead>
                    <tbody style={{ zIndex: 0 }}>{rows}</tbody>
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
                    cursor: updatedDemands.length ? "pointer" : "default",
                    backgroundColor: updatedDemands.length ? "#007bff" : "#CCCCCC",
                    color: "#FFFFFF",
                }}
                disabled={!updatedDemands.length}
            >
                Save Data
            </button>
            <br></br>
            <div>
                <h3>
                    Upload Demand Forecast File
                    <h6>(Only .xls and .xlsx files supported)</h6>
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

            <div>
                <br></br>
                <Link
                    className="btn btn-primary btn-lg mx-1"
                    to={"/manpower-planner/productivity"}
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
            </div>

            <button
                className="btn btn-primary btn-lg position-absolute bottom-0 end-0 m-3"
                style={{
                    backgroundColor: "red",
                }}
                onClick={handleCancelClick}
            >
                Cancel
            </button>
            <Modal show={showDialog} onHide={handleClose} style={{zIndex: 100001}}>
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

export default ExpectedDemand;
