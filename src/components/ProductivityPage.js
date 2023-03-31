import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Productivity() {
    const [data, setData] = useState([]);
    const fileInputRef = useRef(null);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [fileSelected, setFileSelected] = useState(false);
    const [
        productivityExperiencedEmployee,
        setProductivityExperiencedEmployee,
    ] = useState(0);
    const [productivityNewEmployee, setProductivityNewEmployee] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const warehouse = JSON.parse(localStorage.getItem("warehouse"));
    const [fileUploading, setFileUploading] = useState(false);
    const [updatedProductivity, setUpdatedProductivity] = useState([]);

    useEffect(() => {
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
        navigate("/dashboard");
    };

    const getProductivityData = () => {
        fetch(
            "http://127.0.0.1:5000/benchmark_productivity/" + warehouse["id"],
            {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + user.access_token,
                },
            }
        )
            .then((response) => response.json())
            .then((responseData) => setData(responseData));
    };

    const handleProductivityChange = (id, fieldName, value) => {
        const newData = [ ...data ];
        value = parseInt(value)
        const indexInOriginalData = newData.findIndex(
            (obj) => obj.id === id
        );
        newData[indexInOriginalData][fieldName] = value;
        setData(newData)

        const index = updatedProductivity.findIndex(
            (obj) => obj.id === id
        );
        if (index !== -1) {
            updatedProductivity[index][fieldName] = value;
        } else {
            const newUpdatedProductivity = {
                id: id,
                [fieldName]: value
            };  
            updatedProductivity.push(newUpdatedProductivity);
        }
    }

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setProductivityExperiencedEmployee(
            data[index].productivity_experienced_employee
        );
        setProductivityNewEmployee(data[index].productivity_new_employee);
    };

    const handleSaveClick = () => {
        
        fetch(`http://127.0.0.1:5000/benchmark_productivity`, {
            method: "PUT",
            body: JSON.stringify({
                productivity: updatedProductivity,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user.access_token,
            },
        })
            .then((response) => response.json())
            .catch((error) => console.error(error));
        setUpdatedProductivity([]);
    };

    const handleFileSelected = () => {
        setFileSelected(true);
    };
    const handleUploadFile = (event) => {
        event.preventDefault();
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);
        setFileUploading(true);
        fetch(
            "http://127.0.0.1:5000/upload_productivity_file/" + warehouse["id"],
            {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: "Bearer " + user.access_token,
                },
            }
        )
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
                    getProductivityData();
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

    return (
        <div className="container mt-5" style={{ position: "relative" }}>
            <h4>
            Benchmark productivity for selected warehouse and categories has been auto-filled. 
            Type in values or upload new benchmark productivity file, if necessary.
            </h4>
<div style={{ height: "300px", overflowX: "auto" }}>
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th style={{ width: "50px", position: "sticky", zIndex: 1, background: "#fff" }}>Category Name</th>
        <th style={{ width: "50px", position: "sticky", zIndex: 1, background: "#fff" }}>Productivity Experienced Employee</th>
        <th style={{ width: "50px", position: "sticky", zIndex: 1, background: "#fff" }}>Productivity New Employee</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={item.id}>
          <td>{item.category_name}</td>
          <td className="text-center">
            <input
              type="number"
              value={item.productivity_experienced_employee}
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
            <Link
                className="btn btn-primary btn-lg mx-1"
                to={"/manpower-planner/expected-demands"}
                style={{
                    backgroundColor: "green",
                }}
            >
                Next
            </Link>
            <button
                className="btn btn-primary btn-lg position-absolute bottom-0 end-0 m-3"
                onClick={handleCancelClick}
                style={{
                    backgroundColor: "red",
                }}
            >
                Cancel
            </button>
        </div>
    );
}

export default Productivity;
