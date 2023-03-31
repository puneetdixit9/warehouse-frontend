import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ExpectedDemand() {
    const [updatedDemands, setUpdatedDemands] = useState([]);
    const [editableData, setEditableData] = useState([{}]);
    const user = JSON.parse(localStorage.getItem("user"));
    const warehouse = JSON.parse(localStorage.getItem("warehouse"));
    const [fileUploading, setFileUploading] = useState(false);

    const fileInputRef = useRef(null);
    const [fileSelected, setFileSelected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!warehouse) {
            navigate("/manpower-planner/select-warehouse");
            return;
        }
        if (!user) {
            navigate("/login");
        }
        getDemandsData();
    }, []);


    const getDemandsData = () => {
        fetch(
            "http://127.0.0.1:5000/demands/" +
                warehouse["id"] +
                "?start_date=" +
                warehouse["startDate"] +
                "&end_date=" +
                warehouse["endDate"],
            {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + user.access_token,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                setEditableData([{}])
                setEditableData(data);
            });
    };

    const handleSaveClick = () => {
        fetch(`http://127.0.0.1:5000/demands`, {
            method: "PUT",
            body: JSON.stringify({
                demands: updatedDemands,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user.access_token,
            },
        })
            .then((response) => response.json())
            .catch((error) => console.error(error));
        setUpdatedDemands([]);
    };

    const categories = Object.keys(editableData[Object.keys(editableData)[0]])
        .filter((category) => category !== "total")

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
        navigate("/dashboard");
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
        fetch("http://127.0.0.1:5000/demand_forecast_file/" + warehouse["id"], {
            method: "POST",
            body: formData,
            headers: {
                Authorization: "Bearer " + user.access_token,
            },
        })
            .then((response) => {
                return response.json().then((json) => {
                    return {
                        status: response.status,
                        data: json,
                    };
                });
            })
            .then(({ status, data }) => {
                if (status === 201) {
                    alert("File uploaded successfully");
                    getDemandsData();
                } else {
                    alert("Error in File : " + data.error);
                }
                setFileUploading(false);
                setFileSelected(false);
                fileInputRef.current.value = "";
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                setFileUploading(false);
                setFileSelected(false);
                fileInputRef.current.value = "";
            });
    };

    
    const header = (
        <tr>
        <th style={{ position: "sticky", left: 0, zIndex: 2, width: "200px", background: "#fff", whiteSpace: "nowrap" }}>Date</th>
        {categories.map((category) => (
          <th key={category} style={{ width: "50px", position: "sticky", zIndex: 1, background: "#fff" }}>
            {category}
          </th>
        ))}
        <th style={{ position: "sticky", right: 0, zIndex: 2, fontWeight: "bold", background: "#fff" }}>Total</th>
      </tr>
      );
      
      const rows = Object.entries(editableData).map(([date, values]) => {
        const rowTotal = values.total;
        let cells;
        if (date === "total") {
          cells = categories.map((category) => (
            <td key={category} style={{ fontWeight: "bold", width: "120px" }}>
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
                  onBlur={(event) => handleBlur(event, date, category)}
                  onChange={(event) => handleDemandChange(event, date, category)}
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
            <td style={{ position: "sticky", left: 0, fontWeight: "bold", width: "200px", background: "#fff", whiteSpace: "nowrap" }}>{date === "total" ? "TOTAL" : date}</td>
            {cells}
            <td className="text-center" style={{ position: "sticky", right: 0, fontWeight: "bold", width: "80px", background: "#fff" }}>{rowTotal}</td>
          </tr>
        );
      });
      
      
      
      return (
        <div
          className="container mt-5"
          style={{ position: "relative", overflowX: "auto", paddingRight: "16px" }}
        >
          <h4>
          Expected daily demand for selected warehouse and selected duration has been auto-filled. 
          Type in values or upload new demand forecast file, if necessary.
          </h4>
          <div style={{ height: "300px", overflowY: "scroll", overflowX: "scroll"}}>
            <table className="table table-bordered table-striped">
                <thead style={{ zIndex: 1 }}>{header}</thead>
                <tbody style={{ zIndex: 0 }}>{rows}</tbody>
              
            </table>      
            </div>
            <br></br>
            <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSaveClick}
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
                <Link
                    className="btn btn-primary btn-lg mx-1"
                    to={"/manpower-planner/requiremnts"}
                    style={{
                        backgroundColor: "green",
                    }}
                >
                    Next
                </Link>
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
        </div>
    );
}

export default ExpectedDemand;
