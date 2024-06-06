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
  const labels = data.map((item) => 
    new Date(item[1].seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  )
  const datasetData = data.map((item) => (item[1].amount / 10 ** deal_decimal) * item[1].price)

  return {
    labels,
    datasets: [
      {
        label: 'Bid Size',
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
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const date = new Date(data[context.dataIndex][1].seconds * 1000)
            const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
            const bidSize = context.raw
            return `Time: ${time}\nBid Size: ${bidSize}`
          }
        }
      }
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
