// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const BidsOverview = ({ data }) => {
//   const [isVisible, setIsVisible] = useState(true);

//   const chartData = {
//     labels: data.map(item => new Date(item[1].seconds * 1000).toLocaleString()), // Convert seconds to a readable date format
//     datasets: [
//       {
//         label: 'Bid Size',
//         data: data.map(item => item[1].amount/(10**6) * item[1].price), // Calculate bid size
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: true,
//       }
//     ]
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top'
//       },
//       title: {
//         display: true,
//         text: 'Bids Overview'
//       }
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Time'
//         }
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Bid Size'
//         }
//       }
//     }
//   };

//   const handleClick = (event) => {
//     // Prevent default behavior and stop event propagation
//     event.preventDefault();
//     event.stopPropagation();
//     setIsVisible(true); // Ensure the graph is always visible
//   };

//   return (
//     <div className="" onClick={handleClick}>
//       <h4 className="text-lg" onClick={handleClick}>Bids overview</h4>
//       <div className="mt-4 bg-emerald-50 h-full">
//         {isVisible && <Line data={chartData} options={options} />}
//       </div>
//     </div>
//   );
// };

// export default BidsOverview;

import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Function to transform data
const transformData = (data, deal_decimal) => {
  const labels = data.map((item) => new Date(item[1].seconds * 1000).toLocaleString())
  const datasetData = data.map((item) => (item[1].amount / 10 ** deal_decimal) * item[1].price)

  return {
    labels,
    datasets: [
      {
         label: 'Bid Size...',
        data: datasetData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }
    ]
  }
}

const BidsOverview = ({ data, deal_decimal }) => {
  // Transform data outside the render method
  const chartData = transformData(data, deal_decimal)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display:false
      },
      // title: {
      //   display: true,
      //   text: 'Bids Overview'
      // }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Bid Size'
        }
      }
    }
  }

  return (
    <div className="flex flex-col justify-start ml-0">
      <div> 
        <h4 className="text-lg">Bids overview</h4>
      </div>
      <div className="bg-emerald-50 h-full ml-0">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default BidsOverview
