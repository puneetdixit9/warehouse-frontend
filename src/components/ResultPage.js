import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";
import { utils, writeFile } from "xlsx";
import WarehouseService from '../services/warehouse.service';
import LineChart from "./LineChart";

const Result = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const requirementData = localStorage.getItem("requirementData");
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [isDataReady, setIsDataReady] = useState(false);
    const [tableType, setTableType] = useState("resultTable");
    const [additionalData, setAdditionalData] = useState({});
    const [warehouseName, setWarehouseName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [chartData, setChartData] = useState({});
    const [demandVsFulfillmentData, setDemandVsFulfillmentData] = useState({});
    let selectedCategoryForGraph = "";
    let errorDisplay = false;
    
    useEffect(() => {
        window.scrollTo(0, 25);
        if (!user) {
            navigate("/login");
        }
        if (!requirementData) {
            navigate("/manpower-planner/requiremnts");
        }

        WarehouseService.catculateManpower({body: requirementData}).then((response) => {
            if (response.status === 200) {
                setData(response.data.output);
                setAdditionalData(response.data.additional_data);
                setWarehouseName(response.data.warehouse_name);
                setDemandVsFulfillmentData(response.data.demand_vs_fulfillment_data)
                setIsDataReady(true);
            } else if (response.status === 400 && !errorDisplay) {
                errorDisplay = true;
                alert("Invalid Input Data")
            } else {
                console.error("Error in calculating manpower")
            }
        }).catch((error) => console.error(error));
    }, []);


    useEffect(() => {
        if (isDataReady) {
            updateFulfillmentDataFilteredData();
        }
      }, [demandVsFulfillmentData, startDate, endDate]);

    const updateFulfillmentDataFilteredData = () => {
        let filteredDates = Object.keys(demandVsFulfillmentData).filter(date => {
            if (startDate && endDate) {
              return date >= startDate && date <= endDate;
            } else if (startDate) {
              return date >= startDate;
            } else if (endDate) {
              return date <= endDate;
            }
            return true;
          })
        let demand = [];
        let expectedFulfillmentQty = [];
        let fulfillmentWithExisting = []
        if (selectedCategoryForGraph === "") {
            demand = filteredDates.map((date) => demandVsFulfillmentData[date].total.expected_demand)
            expectedFulfillmentQty = filteredDates.map((date) => demandVsFulfillmentData[date].total.fulfillment_with_total)
            fulfillmentWithExisting = filteredDates.map((date) => demandVsFulfillmentData[date].total.fulfillment_with_current)

        } else {
            demand = filteredDates.map((date) => demandVsFulfillmentData[date][selectedCategoryForGraph].expected_demand)   
            expectedFulfillmentQty = filteredDates.map((date) => demandVsFulfillmentData[date][selectedCategoryForGraph].fulfillment_with_total)
            fulfillmentWithExisting = filteredDates.map((date) => demandVsFulfillmentData[date][selectedCategoryForGraph].fulfillment_with_current)
        }

        setChartData({
            labels: filteredDates,
            demand: demand,
            expectedFulfillmentQty: expectedFulfillmentQty,
            fulfillmentWithExisting: fulfillmentWithExisting,
        });
      };

    const handleHome = () => {
        localStorage.removeItem("warehouse");
        localStorage.removeItem("requirementData");
        navigate("/");
    };

    const handleCalculateAgain = () => {
        navigate("/manpower-planner/select-warehouse");
    };
    

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        updateFulfillmentDataFilteredData();
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        updateFulfillmentDataFilteredData();
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        selectedCategoryForGraph = e.target.value;
        updateFulfillmentDataFilteredData();
    };

    const handleTableTypeChange = (e) => {
        setTableType(e.target.value);
    };

    function downloadExcel() {
        const worksheet = utils.table_to_sheet(
            document.getElementById(tableType)
        );
        worksheet["!cols"] = [{ wch: 10 }, { wch: 9 }, { wch: 21 }];
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Sheet1");

        writeFile(workbook, tableType+".xlsx");
    }

    const filteredData = Object.keys(data)
        .filter((date) => {
            if (startDate && endDate) {
                return date >= startDate && date <= endDate;
            } else if (startDate) {
                return date >= startDate;
            } else if (endDate) {
                return date <= endDate;
            }
            return true;
        })
        .reduce((filtered, date) => {
            const categories = Object.keys(data[date]);
            categories.forEach((category) => {
                if (!selectedCategory || category === selectedCategory) {
                    if (!filtered[date]) {
                        filtered[date] = {};
                    }
                    filtered[date][category] = data[date][category];
                }
            });
            return filtered;
        }, {});

    const filteredDemandData = Object.keys(demandVsFulfillmentData)
        .filter((date) => {
            if (startDate && endDate) {
                return date >= startDate && date <= endDate;
            } else if (startDate) {
                return date >= startDate;
            } else if (endDate) {
                return date <= endDate;
            }
            return true;
        })
        .reduce((filtered, date) => {
            const categories = Object.keys(demandVsFulfillmentData[date]);
            categories.forEach((category) => {
                if (!selectedCategory || category === selectedCategory) {
                    if (!filtered[date]) {
                        filtered[date] = {};
                    }
                    filtered[date][category] = demandVsFulfillmentData[date][category];
                }
            });
            return filtered;
        }, {});



    const uniqueDates = Object.keys(filteredData).filter(
        (key) => key !== "total" && key !== "additional_data"
    );

    const totalData = uniqueDates.reduce(
        (acc, date) => {
            const categories = Object.keys(filteredData[date]);
            categories.forEach((category) => {
                acc.num_of_existing_to_deploy +=
                    filteredData[date][category].num_of_existing_to_deploy;
                acc.num_of_new_to_deploy +=
                    filteredData[date][category].num_of_new_to_deploy;
                acc.total += filteredData[date][category].total;
            });
            return acc;
        },
        { num_of_existing_to_deploy: 0, num_of_new_to_deploy: 0, total: 0 }
    );
    const categories =
        Object.keys(data).length > 0
            ? Object.keys(data[Object.keys(data)[0]]).sort((a, b) => {
                return data[Object.keys(data)[0]][a].category_id - data[Object.keys(data)[0]][b].category_id;
            })
            : [];

    return (
        <div className="container">
            <div className="table-container">
                <h2>Manpower Requirement {warehouseName ? "(" + warehouseName + ")": "" }</h2>
                <br></br>
                <div>
                    <div className="additional-data">
                        <div className="additional-info left">
                            <div>
                                <label
                                    style={{ fontWeight: "bold" }}
                                    htmlFor="startDate"
                                >
                                    Start Date:
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                />
                            </div>
                        </div>
                        <div className="additional-info center">
                            <div>
                                <label
                                    style={{ fontWeight: "bold" }}
                                    htmlFor="endDate"
                                >
                                    End Date:
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                            </div>
                        </div>
                        <div className="additional-info right">
                            <div>
                                <label
                                    style={{ fontWeight: "bold" }}
                                    htmlFor="category"
                                >
                                    Category:
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">All</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <br></br>
                </div>
                <div className="additional-data">
                    <div className="additional-info left">
                        <div>
                            <div className="additional-info-label">
                                # Employee to be hired
                            </div>
                            <div className="additional-info-value">
                                {totalData.num_of_new_to_deploy}
                            </div>
                        </div>
                    </div>
                    <div className="additional-info center">
                        <div>
                            <div className="additional-info-label">
                                Project Fulfillment:
                            </div>
                            <div className="additional-info-value">
                                {additionalData.project_fulfillment
                                    ? additionalData.project_fulfillment
                                    : 0}
                                %
                            </div>
                        </div>
                    </div>
                    <div className="additional-info right">
                        <div>
                            <div className="additional-info-label">
                                Total Hiring Budget:
                            </div>
                            <div className="additional-info-value">
                            (&#x20B9;)
                                {additionalData.total_hiring_budget
                                    ? " " + additionalData.total_hiring_budget.toLocaleString('en-IN')
                                    : 0}
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <div
                    className="text-center"
                    style={{ width: "70%", height: "100%", marginLeft: "18%" }}
                >
                    <LineChart inputData={chartData}/>
                </div>

                <br></br>
                <div className="" style={{ textAlign: "center" }}>
                    <label style={{ fontWeight: "bold" }} htmlFor="tableType">
                        Select Table:{" "}
                    </label>
                    <select
                        id="tableType"
                        value={tableType}
                        onChange={handleTableTypeChange}
                    >
                        <option value="resultTable">
                            New, existing to be deployed table (Result table)
                        </option>
                        <option value="demandFulfullmentTable">
                            Date-wise demand vs projected fulfillment table{" "}
                        </option>
                    </select>
                </div>
                <br></br>
                <div style={{ height: "300px", overflowX: "auto" }}>
                    {tableType === "resultTable" ? (
                        <table
                            id="resultTable"
                            style={{ borderCollapse: "collapse" }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <th
                                        style={{
                                            textAlign: "center",
                                            backgroundColor: "#ddd",
                                        }}
                                    >
                                        Date
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                            backgroundColor: "#ddd",
                                        }}
                                    >
                                        Category
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                            backgroundColor: "#ddd",
                                        }}
                                    >
                                        Num of Existing to Deploy
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                            backgroundColor: "#ddd",
                                        }}
                                    >
                                        Num of New to Deploy
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                            backgroundColor: "#ddd",
                                        }}
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueDates.map((date) => {
                                    const categories = Object.keys(
                                        filteredData[date]
                                    ).sort((a, b) => {
                                        return filteredData[Object.keys(filteredData)[0]][a].category_id - filteredData[Object.keys(filteredData)[0]][b].category_id;
                                    });
                                    return (
                                        <>
                                            {categories.map(
                                                (category, index) => {
                                                    const {
                                                        num_of_existing_to_deploy,
                                                        num_of_new_to_deploy,
                                                        total,
                                                    } =
                                                        filteredData[date][
                                                            category
                                                        ];
                                                    return (
                                                        <tr
                                                            key={`${date}_${category}`}
                                                        >
                                                            {index === 0 ? (
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                    rowSpan={
                                                                        categories.length
                                                                    }
                                                                >
                                                                    {date}
                                                                </td>
                                                            ) : null}
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {category}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {
                                                                    num_of_existing_to_deploy
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {
                                                                    num_of_new_to_deploy
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {total}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </>
                                    );
                                })}
                                <tr
                                    style={{
                                        position: "sticky",
                                        bottom: 0,
                                        zIndex: 1,
                                        backgroundColor: "#ddd",
                                    }}
                                >
                                    <td
                                        colSpan={2}
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            backgroundColor: "#ddd",
                                        }}
                                    >
                                        Total
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {totalData.num_of_existing_to_deploy}
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {totalData.num_of_new_to_deploy}
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {totalData.total}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <div>
                            <table
                                id="demandFulfullmentTable"
                                style={{ borderCollapse: "collapse" }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 1,
                                        }}
                                    >
                                        <th
                                            style={{
                                                textAlign: "center",
                                                backgroundColor: "#ddd",
                                            }}
                                        >
                                            Date
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "center",
                                                backgroundColor: "#ddd",
                                            }}
                                        >
                                            Category
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "center",
                                                backgroundColor: "#ddd",
                                            }}
                                        >
                                            Expected Demand
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "center",
                                                backgroundColor: "#ddd",
                                            }}
                                        >
                                            Fulfillment With Existing Employee
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "center",
                                                backgroundColor: "#ddd",
                                            }}
                                        >
                                            Fulfillment With Total Employee
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {uniqueDates.map((date) => {
                                    const categories = Object.keys(
                                        filteredDemandData[date]
                                    ).sort((a, b) => {
                                        return filteredDemandData[Object.keys(filteredDemandData)[0]][a].category_id - filteredDemandData[Object.keys(filteredDemandData)[0]][b].category_id;
                                    });
                                    return (
                                        <>
                                            {categories.map(
                                                (category, index) => {
                                                    const {
                                                        expected_demand,
                                                        fulfillment_with_current,
                                                        fulfillment_with_total
                                                    } =
                                                    demandVsFulfillmentData[date][
                                                            category
                                                        ];
                                                    return (
                                                        <tr
                                                            key={`${date}_${category}`}
                                                        >
                                                            {index === 0 ? (
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                    rowSpan={
                                                                        categories.length === 1 ? categories.length : categories.length - 1
                                                                    }
                                                                >
                                                                    {date}
                                                                </td>
                                                            ) : null}
                                                            <td
                                                                style={{
                                                                    textAlign:"center",
                                                                    fontWeight: category === "total" ? "bold" : ""
                                                                }}
                                                                colSpan={category === "total" ? 2 : 1}
                                                            >
                                                                {category === "total" ? "Total (" +date+")": category}
                                                            
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign: "center",
                                                                    fontWeight: category === "total" ? "bold" : ""
                                                                }}
                                                            >
                                                                {
                                                                    expected_demand
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign: "center",
                                                                    fontWeight: category === "total" ? "bold" : ""
                                                                }}
                                                            >
                                                                {
                                                                    fulfillment_with_current
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                
                                                                    textAlign: "center",
                                                                    fontWeight: category === "total" ? "bold" : ""
                                                                }}
                                                            >
                                                                {fulfillment_with_total}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <br></br>
                <button
                    className="btn btn-primary btn-lg mx-1"
                    onClick={handleCalculateAgain}
                >
                    Modify Inputs
                </button>
                <button
                    className="btn btn-primary btn-lg mx-1"
                    style={{
                        backgroundColor: "green",
                    }}
                    onClick={downloadExcel}
                >
                    Download Excel
                </button>
                <button
                    className="btn btn-primary btn-lg mx-1"
                    onClick={handleHome}
                >
                    Home
                </button>
            </div>
        </div>
    );
};

export default Result;
