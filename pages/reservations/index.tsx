import React, { useState, useEffect, FormEvent, Fragment } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../components'

import { FaTrash } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../api'
import { IReservation } from '../../models/Reservation'
import { currency } from '../../utils/currency'

const Reservations = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['reservations'],
    method: 'GET',
    url: `reservations?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const deleteApi = apiHook({
    key: ['reservations'],
    method: 'DELETE',
    url: `reservations`,
  })?.deleteObj

  useEffect(() => {
    if (deleteApi?.isSuccess) {
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Reservations List'
  const label = 'Reservation'
  const modal = 'reservation'

  return (
    <>
      <Meta title="Reservations" />

      {deleteApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been deleted successfully.`}
        />
      )}
      {deleteApi?.isError && (
        <Message variant="danger" value={deleteApi?.error} />
      )}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>

            <div className="col-auto">
              <Search
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Passengers</th>
                <th>Airline</th>
                <th>Departure City</th>
                <th>Arrival City</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reservation Date</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IReservation, i: number) => (
                <tr key={i}>
                  <td>
                    {[
                      ...item?.passengers?.adult,
                      ...item?.passengers?.child,
                      ...item?.passengers?.infant,
                    ].map((passenger: any, i: number) => (
                      <Fragment key={i}>
                        <span className="badge bg-primary" key={i}>
                          {i + 1} - {passenger?.firstName}
                        </span>
                        <br />
                      </Fragment>
                    ))}
                  </td>
                  <td>{item?.flight?.airline}</td>
                  <td>{item?.flight?.fromCityName}</td>
                  <td>{item?.flight?.toCityName}</td>
                  <td>
                    {currency(
                      item?.prices[0].fare *
                        (item?.passengers?.adult?.length || 0) +
                        item?.prices[1].fare *
                          (item?.passengers?.child?.length || 0) +
                        item?.prices[2].fare *
                          (item?.passengers?.infant?.length || 0)
                    )}
                  </td>
                  <td>
                    {item?.status === 'booked' ? (
                      <span className="badge bg-success text-uppercase">
                        Booked
                      </span>
                    ) : (
                      <span className="badge bg-danger text-uppercase">
                        Canceled
                      </span>
                    )}
                  </td>

                  <td>{moment(item?.flight?.departureDate).format('lll')}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-danger btn-sm ms-1 rounded-pill"
                        onClick={() => deleteHandler(item._id)}
                        disabled={deleteApi?.isLoading}
                      >
                        {deleteApi?.isLoading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <span>
                            <FaTrash />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Reservations)), {
  ssr: false,
})
