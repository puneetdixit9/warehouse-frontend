import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";

const Result = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ total: {}, additional_data: {} });
    let uniqueDates = Object.keys(data).filter(
        (key) => key !== "total" && key !== "additional_data"
    );

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
    }, []);

    
    const handleHome = () => {
        localStorage.removeItem('warehouse')
        localStorage.removeItem('requirementData')
        navigate('/dashboard')
    }

    const handleCalculateAgain = () => {
        navigate('/manpower-planner/select-warehouse')
    }


    return (
        <div className="container" style={{ position: "relative" }}>
            <div className="table-container">
                <h2>Manpower Requirement</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Num of Existing to Deploy</th>
                            <th>Num of New to Deploy</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueDates.map((date) => {
                            const categories = Object.keys(data[date]);
                            return (
                                <>
                                    {categories.map((category, index) => {
                                        const {
                                            num_of_existing_to_deploy,
                                            num_of_new_to_deploy,
                                            total,
                                        } = data[date][category];
                                        return (
                                            <tr key={`${date}_${category}`}>
                                                {index === 0 ? (
                                                    <td
                                                        rowSpan={
                                                            categories.length
                                                        }
                                                    >
                                                        {date}
                                                    </td>
                                                ) : null}
                                                <td>{category}</td>
                                                <td>
                                                    {num_of_existing_to_deploy}
                                                </td>
                                                <td>{num_of_new_to_deploy}</td>
                                                <td>{total}</td>
                                            </tr>
                                        );
                                    })}
                                </>
                            );
                        })}
                        <tr>
                            <td>Total</td>
                            <td>-</td>
                            <td>{data.total.num_of_existing_to_deploy}</td>
                            <td>{data.total.num_of_new_to_deploy}</td>
                            <td>{data.total.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="additional-data">
                <h2>Projections - Dailyload vs Throughput</h2>
                <div class="additional-info">
                    <div class="additional-info-box">
                        <div class="additional-info-label">
                            Additional Employee Required
                        </div>
                        <div class="additional-info-value">
                            {data.additional_data.additional_employee_required}
                        </div>
                    </div>
                    <br></br>
                </div>
                <div class="additional-info">
                    <div class="additional-info-box">
                        <div class="additional-info-label">
                            Project Fulfillment:
                        </div>
                        <div class="additional-info-value">
                            {data.additional_data.project_fulfillment}%
                        </div>
                    </div>
                </div>

                <div class="additional-info">
                    <div class="additional-info-box">
                        <div class="additional-info-label">
                            Total Hiring Budget:
                        </div>
                        <div class="additional-info-value">
                            {data.additional_data.total_hiring_budget}
                        </div>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary btn-lg mx-2" onClick={handleCalculateAgain}> Calculate Again </button>
            <button className="btn btn-primary btn-lg position-absolute bottom-0 end-0 m-3" onClick={handleHome}> Done </button>
        </div>
    );
};

export default Result;
