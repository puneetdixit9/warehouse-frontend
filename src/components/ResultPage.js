import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";
import Chart from "chart.js/auto";
import XLSX from 'xlsx';

const Result = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [tableType, setTableType] = useState("resultTable");
    const chartContainer = useRef(null);
    const demandVsFulfillmentData = [
        { date: "01/11/22", demand: 1927, expectedFulfillmentQty: 1171 },
        { date: "02/11/22", demand: 1673, expectedFulfillmentQty: 1474 },
        { date: "03/11/22", demand: 1159, expectedFulfillmentQty: 1638 },
        { date: "04/11/22", demand: 1363, expectedFulfillmentQty: 1730 },
        { date: "05/11/22", demand: 1932, expectedFulfillmentQty: 1180 },
        { date: "06/11/22", demand: 1552, expectedFulfillmentQty: 1266 },
        { date: "07/11/22", demand: 1151, expectedFulfillmentQty: 1941 },
    ];

    useEffect(() => {
        let user = localStorage.getItem("user");
        user = JSON.parse(user);
        if (!user) {
            navigate("/login");
        }
        let requirementData = localStorage.getItem("requirementData");
        fetch(`http://127.0.0.1:5000/calculate`, {
            method: "POST",
            body: requirementData,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user.access_token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data["output"]);
            })
            .catch((error) => console.error(error));

        if (chartContainer && chartContainer.current) {
            const chartConfig = {
                type: "line",
                data: {
                    labels: [
                        "01/11/22",
                        "02/11/22",
                        "03/11/22",
                        "04/11/22",
                        "05/11/22",
                        "06/11/22",
                        "07/11/22",
                    ],
                    datasets: [
                        {
                            label: "Demand Total",
                            data: [1227, 1673, 900, 1663, 1332, 1552, 1151],
                            borderColor: "red",
                            fill: false,
                        },
                        {
                            label: "Expected Fulfillment Qty",
                            data: [1171, 1474, 738, 1630, 1180, 1266, 1141],
                            borderColor: "blue",
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                },
            };
            const myChart = new Chart(chartContainer.current, chartConfig);
            return () => {
                myChart.destroy();
            };
        }
    }, []);

    const handleHome = () => {
        localStorage.removeItem("warehouse");
        localStorage.removeItem("requirementData");
        navigate("/dashboard");
    };

    const handleCalculateAgain = () => {
        navigate("/manpower-planner/select-warehouse");
    };
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleTableTypeChange = (e) => {
        setTableType(e.target.value);
    };

    // function downloadExcel() {
    //   // Convert the table data to a worksheet

    //   const worksheet = XLSX.utils.table_to_sheet(document.getElementById('my-table'));
    
    //   // Create a workbook and add the worksheet
    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    //   // Save the workbook as an Excel file
    //   XLSX.writeFile(workbook, 'my-table.xlsx');
    // }

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
            ? Object.keys(data[Object.keys(data)[0]])
            : [];

    return (
        <div className="container">
            <div className="table-container">
                <h2>Manpower Requirement</h2>
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
                                Additional Employee Required
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
                            <div className="additional-info-value">{5}%</div>
                        </div>
                    </div>
                    <div className="additional-info right">
                        <div>
                            <div className="additional-info-label">
                                Total Hiring Budget:
                            </div>
                            <div className="additional-info-value">{5}</div>
                        </div>
                    </div>
                </div>
                <br></br>
                <div
                    className="text-center"
                    style={{ width: "70%", height: "100%", marginLeft: "18%" }}
                >
                    <canvas ref={chartContainer} />
                </div>
                <br></br>
                <div className="" style={{ textAlign: "center" }}>
                    <label htmlFor="tableType">Select Table: </label>
                    <select
                        id="tableType"
                        value={tableType}
                        onChange={handleTableTypeChange}
                    >
                        <option value="resultTable">
                            New, existing to be deployed table (Result table)
                        </option>
                        <option value="fulfillmentTable">
                            Date-wise demand vs projected fulfillment table{" "}
                        </option>
                    </select>
                </div>
                <br></br>
                <div style={{ height: "300px", overflowX: "auto" }}>
                    {tableType === "resultTable" ? (
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>
                                        Date
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                        Category
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                        Num of Existing to Deploy
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                        Num of New to Deploy
                                    </th>
                                    <th style={{ textAlign: "center" }}>
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueDates.map((date) => {
                                    const categories = Object.keys(
                                        filteredData[date]
                                    );
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
                                <tr>
                                    <td
                                        colSpan={2}
                                        style={{
                                            fontWeight: "bold",
                                            textAlign: "center",
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
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "center" }}>
                                            Date
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                            Demand
                                        </th>
                                        <th style={{ textAlign: "center" }}>
                                            Expected Fulfillment Qty
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandVsFulfillmentData.map(
                                        ({
                                            date,
                                            demand,
                                            expectedFulfillmentQty,
                                        }) => (
                                            <tr key={date}>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {date}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {demand}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {expectedFulfillmentQty}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Result;
