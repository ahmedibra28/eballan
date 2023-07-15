import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement
)

import { Line } from 'react-chartjs-2'

const LineChart = ({
  dataValue,
  bgColor = 'rgb(117, 194, 246)',
}: {
  dataValue: { labels: string[]; data: number[]; title: string }
  bgColor?: string
}) => {
  const data = {
    labels: dataValue.labels,
    datasets: [
      {
        label: dataValue.title,
        data: dataValue.data,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    type: 'line',
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: bgColor,
        backgroundColor: bgColor,
        point: {
          radius: 0,
          hitRadius: 0,
        },
        scales: {
          xAxis: {
            display: true,
            yAxis: {
              display: false,
            },
          },
        },
      },
    },
  }

  return <Line data={data} options={options} />
}

export default LineChart
