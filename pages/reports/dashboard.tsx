import React from 'react'
import { currency } from '../../utils/currency'

import moment from 'moment'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'

const Dashboard = () => {
  const numbers = [
    {
      title: 'Users',
      value: 3,
      isMoney: false,
    },
    {
      title: 'Agents',
      value: 242,
      isMoney: false,
    },
    {
      title: 'Active airlines',
      value: 63,
      isMoney: false,
    },
    {
      title: 'Reservations',
      value: 58,
      isMoney: false,
    },
    {
      title: 'Amended tickets',
      value: 6,
      isMoney: false,
    },
    {
      title: 'Refunded tickets',
      value: 33,
      isMoney: false,
    },
    {
      title: 'Active reservations',
      value: 23,
      isMoney: false,
    },
    {
      title: 'Occupancy reservations',
      value: 182,
      isMoney: false,
    },
    {
      title: 'Seats sold',
      value: 465,
      isMoney: false,
    },
    {
      title: 'Total sales',
      value: 87,
      isMoney: true,
    },
    {
      title: 'Total sales commission',
      value: 54,
      isMoney: true,
    },
  ]

  const labels = Array.from({ length: 6 }, (_, i) =>
    moment().subtract(i, 'months').format('MMM YY')
  )

  // const topDestinations = {
  //   min: 0,
  //   max: 100,
  //   cities: [
  //     { name: 'Lagos', value: 100 },
  //     { name: 'Abuja', value: 60 },
  //     { name: 'Port Harcourt', value: 90 },
  //     { name: 'Kano', value: 10 },
  //     { name: 'Enugu', value: 20 },
  //   ],
  // }

  // const months = (
  //   <div
  //     className="progress"
  //     role="progressbar"
  //     aria-label="Example with label"
  //     aria-valuenow="25"
  //     aria-valuemin="0"
  //     aria-valuemax="100"
  //   >
  //     <div className="progress-bar" style={{ width: '25%' }}>
  //       25%
  //     </div>
  //   </div>
  // )

  const topDestinationsData = {
    labels: [
      'London, England',
      'New York City, USA',
      'Dubai, UAE',
      'Bangkok, Thailand',
      'Hong Kong, China',
    ],
    data: [3.8, 3.2, 2.9, 2.5, 2.2],
    title: 'Top 5 Destinations',
  }

  const revenueByAirlineData = {
    labels: ['Halla Airline', 'Maandeeq Air', 'Fly 24'],
    data: [79, 12, 69],
    title: 'Total Revenue by Airline',
  }

  const revenueByAgentData = [
    { _id: '7', name: 'Stanley Clark', amount: 517 },
    { _id: '6', name: 'Nellie Scott', amount: 803 },
    { _id: '2', name: 'Marcus Barker', amount: 506 },
    { _id: '10', name: 'Joel Blair', amount: 733 },
    { _id: '4', name: 'Brandon Cobb', amount: 312 },
    { _id: '13', name: 'Phoebe Boyd', amount: 638 },
    { _id: '9', name: 'Nell Schwartz', amount: 364 },
    { _id: '18', name: 'Daniel Price', amount: 410 },
    { _id: '3', name: 'Julia Hampton', amount: 768 },
    { _id: '6', name: 'Virgie Manning', amount: 794 },
    { _id: '18', name: 'Walter Hunter', amount: 676 },
  ]

  console.log(labels)

  const revenueGrowthData = {
    labels: labels,
    data: [12966, 9249, 2211, 907, 1000, 5908],
    title: 'Revenue Growth',
  }

  const refundedTicketsData = {
    labels: labels,
    data: [4121, 3249, 2211, 907, 2000, 33720],
    title: 'Refunded Tickets',
  }

  return (
    <div className="row gy-3">
      {numbers.map((number, i: number) => (
        <div key={i} className="col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card shadow-sm rounded-0 border-0">
            <div className="card-body text-center">
              <small className="text-center">{number.title}</small>
              <h5 className="card-text text-center fw-bold fs-1 text-primary">
                {number.isMoney ? currency(number.value) : number.value}
              </h5>
            </div>
          </div>
        </div>
      ))}
      <div className="col-lg-6 col-12">
        <BarChart dataValue={topDestinationsData} bgColor="rgb(255, 82, 162)" />
      </div>
      <div className="col-lg-6 col-12">
        <BarChart dataValue={revenueByAirlineData} />
      </div>

      <div className="col-lg-6 col-12">
        <LineChart dataValue={revenueGrowthData} bgColor="rgb(63, 46, 62)" />
      </div>

      <div className="col-lg-6 col-12">
        <LineChart
          dataValue={refundedTicketsData}
          bgColor="rgb(150, 129, 235)"
        />
      </div>

      <div className="col-lg-6 col-12">
        <h5 className="fw-bold">Revenue by Agent</h5>
        <ol className="list-group list-group-numbered border-0">
          {revenueByAgentData.map((agent, i: number) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-start bg-transparent border border-top-0 border-end-0 border-start-0"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{agent?.name}</div>
              </div>
              <span className="badge bg-primary rounded-pill px-3 my-auto py-2">
                {currency(agent?.amount)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Dashboard
