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
  BarElement,
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
  BarElement
)

import { Bar } from 'react-chartjs-2'

const BarChart = ({
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
        backgroundColor: bgColor,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: 'rgba(47, 97,68, 1)',
        fill: 'start',
        backgroundColor: 'rgba(47, 97,68, 0.3)',
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

  return <Bar data={data} options={options} />
}

export default BarChart
