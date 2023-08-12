import React from 'react'
import { Spinner, Message, Meta } from '../../../components'

import apiHook from '../../../api'

const Dashboard = () => {
  const getApi = apiHook({
    key: ['agent-summary-report'],
    method: 'GET',
    url: `reports/agents/summary`,
  })?.get

  return (
    <>
      <Meta title="Agents revenue summary" />
      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              List of agents revenue summary
              <sup className="fs-6"> [{getApi?.data?.length}] </sup>
            </h3>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Name</th>
                <th>Count</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item?.name}</td>
                  <td>{item?.count}</td>
                  <td>{item?.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Dashboard
