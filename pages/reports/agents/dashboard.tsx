import React from 'react'
import BarChart from '../../../components/charts/BarChart'
import LineChart from '../../../components/charts/LineChart'
import apiHook from '../../../api'
import Link from 'next/link'

type DashboardReport = {
  agents: number
  users: number
  airlines: number
  reservations: number
  amendedTickets: number
  refundedTickets: number
  activeReservations: number
  occupancyReservations: number
  seatedSold: number
  totalSales: string
  totalSalesCommission: string
  totalRevenueByAirline: {
    [airline: string]: number
  }
  topDestinations: {
    _id: string
    count: number
  }[]
  revenueGrowthForLastFiveMonths: {
    month: string
    revenue: number
  }[]
  refundedTicketForLastFiveMonths: {
    _id: string
    count: number
  }[]
  topAgents: {
    _id: string
    count: number
    totalRevenue: number
    name: string
  }[]
}

const Dashboard = () => {
  const getApi = apiHook({
    key: ['dashboard-report'],
    method: 'GET',
    url: `reports/dashboard`,
  })?.get

  const data = getApi?.data as DashboardReport

  const numbers = [
    {
      title: 'Reservations',
      value: data?.reservations,
      isMoney: false,
    },
    {
      title: 'Amended tickets',
      value: data?.amendedTickets,
      isMoney: false,
    },
    {
      title: 'Refunded tickets',
      value: data?.refundedTickets,
      isMoney: false,
    },
    {
      title: 'Active reservations',
      value: data?.activeReservations,
      isMoney: false,
    },
    {
      title: 'Occupancy reservations',
      value: data?.occupancyReservations,
      isMoney: false,
    },
    {
      title: 'Seats sold',
      value: data?.seatedSold,
      isMoney: false,
    },
    {
      title: 'Total sales',
      value: data?.totalSales,
      isMoney: true,
    },
    {
      title: 'Total sales commission',
      value: data?.totalSalesCommission,
      isMoney: true,
    },
  ]

  // const labels = Array.from({ length: 6 }, (_, i) =>
  //   moment().subtract(i, 'months').format('MMM YY')
  // )

  const topDestinationsData = {
    labels: data?.topDestinations.map((destination) => destination._id),
    data: data?.topDestinations.map((destination) => destination.count),
    title: 'Top 5 Destinations',
  }

  return (
    <div className="row gy-3">
      {numbers.map((number, i: number) => (
        <div key={i} className="col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card shadow-sm rounded-0 border-0">
            <div className="card-body text-center">
              <small className="text-center">{number.title}</small>
              <h5 className="card-text text-center fw-bold fs-1 text-primary">
                {number.isMoney ? number.value : number.value}
              </h5>
            </div>
          </div>
        </div>
      ))}
      <div className="col-lg-6 col-12">
        <BarChart dataValue={topDestinationsData} bgColor="rgb(255, 82, 162)" />
      </div>
    </div>
  )
}

export default Dashboard
