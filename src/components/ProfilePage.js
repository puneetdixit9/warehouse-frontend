// import React from 'react';
// import '../styles/ProfilePage.css';

// function Profile() {
//   const user = {
//     username: 'puneet',
//     email: 'puneet@gmail.com',
//     firstName: 'Puneet',
//     lastName: 'Dixit',
//   };

//   return (
//     <div className="profile-container">
//       <h2>Profile</h2>
//       <div className="profile-info">
//         <div className="profile-row">
//           <div className="profile-label">Username:</div>
//           <div className="profile-value">{user.username}</div>
//         </div>
//         <div className="profile-row">
//           <div className="profile-label">Email:</div>
//           <div className="profile-value">{user.email}</div>
//         </div>
//         <div className="profile-row">
//           <div className="profile-label">First Name:</div>
//           <div className="profile-value">{user.firstName}</div>
//         </div>
//         <div className="profile-row">
//           <div className="profile-label">Last Name:</div>
//           <div className="profile-value">{user.lastName}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;

import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['01/11/22', '02/11/22', '03/11/22', '04/11/22', '05/11/22', '06/11/22', '07/11/22'],
  datasets: [
    {
      label: 'Demand',
      data: [1927, 1673, 1159, 1363, 1932, 1552, 1151],
      fill: false,
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    },
    {
      label: 'Expected fulfillment qty',
      data: [1171, 1474, 1638, 1730, 1180, 1266, 1941],
      fill: false,
      borderColor: 'rgb(54, 162, 235)',
      tension: 0.1
    }
  ]
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const ChartComponent = () => (
  <div>
    <Line data={data} options={options} />
  </div>
);

export default ChartComponent;
