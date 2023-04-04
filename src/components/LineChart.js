import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
          usePointStyle: true,
          pointStyle: "line",
          pointStyleWidth: 50,
      },
  },
    title: {
      display: true,
      text: 'Demand Vs Fulfillment Chart',
    },
  },
};


const LineChart = ({inputData}) => {
  const data = {
    labels: inputData.labels,
    datasets: [
      {
        label: 'Demand',
        data: inputData.demand,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 3
      },
      {
        label: 'Fulfillment',
        data: inputData.expectedFulfillmentQty,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 3
      },
    ],
  };
  return (
     <Line options={options} data={data} />
  )
};

export default LineChart;