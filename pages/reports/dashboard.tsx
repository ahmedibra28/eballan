import React from 'react'
import BarChart from '../../components/charts/BarChart'
import LineChart from '../../components/charts/LineChart'
import apiHook from '../../api'
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
      title: 'Users',
      value: data?.users,
      isMoney: false,
    },
    {
      title: 'Agents',
      value: data?.agents,
      isMoney: false,
    },
    {
      title: 'Active airlines',
      value: data?.airlines,
      isMoney: false,
    },
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

  const revenueByAirlineData = {
    labels: data ? Object?.keys(data?.totalRevenueByAirline) : [],
    data: data ? Object?.values(data?.totalRevenueByAirline) : [],
    title: 'Total Revenue by Airline',
  }

  const revenueByAgentData = data?.topAgents?.map((agent) => ({
    _id: agent._id,
    name: agent.name,
    amount: agent.totalRevenue,
  }))

  const revenueGrowthData = {
    labels: data?.revenueGrowthForLastFiveMonths?.map((item) => item.month),
    data: data?.revenueGrowthForLastFiveMonths?.map((item) => item.revenue),
    title: 'Revenue Growth',
  }

  const refundedTicketsData = {
    labels: data?.refundedTicketForLastFiveMonths?.map((item) => item._id),
    data: data?.refundedTicketForLastFiveMonths?.map((item) => item.count),
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
                {number.isMoney ? number.value : number.value}
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

      {revenueByAgentData?.length > 0 && (
        <div className="col-lg-6 col-12">
          <h5 className="fw-bold">Revenue by Agent</h5>
          <ol className="list-group list-group-numbered border-0">
            {revenueByAgentData?.map((agent, i: number) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-start bg-transparent border border-top-0 border-end-0 border-start-0"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{agent?.name}</div>
                </div>
                <span className="badge bg-primary rounded-pill px-3 my-auto py-2">
                  {agent?.amount}
                </span>
              </li>
            ))}
          </ol>
          <Link
            className="text-muted btn btn-outline-light btn-sm"
            href="/reports/agents/summary"
          >
            See more...
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
