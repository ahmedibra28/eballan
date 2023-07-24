import React from 'react'
import apiHook from '../../api'
import { useRouter } from 'next/router'
import { IReservation } from '../../models/Reservation'
import { currency } from '../../utils/currency'
import moment from 'moment'

const ReservationDetails = () => {
  const router = useRouter()
  const { id } = router?.query

  const getApi = apiHook({
    key: ['reservations', `${id}`],
    method: 'GET',
    url: `reservations/${id}`,
  })?.get

  const data = getApi?.data as IReservation

  const passengerPrice = (type: string) =>
    data?.prices?.find((item) => item?.passengerType === type)

  return (
    <div className="row gy-3">
      <div className="col-lg-9 col-12 mx-auto">
        <h6 className="text-center">
          {data?.status === 'canceled' ? (
            <span className="bg-danger badge">
              {data?.status?.toUpperCase()}
            </span>
          ) : (
            <span className="bg-success badge">
              {data?.status?.toUpperCase()}
            </span>
          )}
        </h6>
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h5 className="fw-bold text-muted text-uppercase">Passengers</h5>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Title</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Nationality</th>
                <th>Sex</th>
                <th>Passport</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data && (
                <>
                  {data?.passengers?.adult &&
                    data?.passengers?.adult?.length > 0 && (
                      <>
                        <tr>
                          <td className="" colSpan={7}>
                            <span className="fw-bold text-uppercase">
                              Adult
                            </span>
                          </td>
                        </tr>

                        {data?.passengers?.adult?.map((adult, i: number) => (
                          <tr key={i}>
                            <td>{adult?.passengerTitle}</td>
                            <td>{adult?.firstName}</td>
                            <td>{adult?.lastName}</td>
                            <td>{adult?.nationality}</td>
                            <td>{adult?.sex}</td>
                            <td>{adult?.passportNumber}</td>
                            <td>
                              {currency(
                                (passengerPrice('Adult')?.fare || 0) +
                                  (passengerPrice('Adult')?.commission || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}

                  {data?.passengers?.child &&
                    data?.passengers?.child?.length > 0 && (
                      <>
                        <tr>
                          <td className="" colSpan={7}>
                            <span className="fw-bold text-uppercase">
                              Child
                            </span>
                          </td>
                        </tr>

                        {data?.passengers?.child?.map((child, i: number) => (
                          <tr key={i}>
                            <td>{child?.passengerTitle}</td>
                            <td>{child?.firstName}</td>
                            <td>{child?.lastName}</td>
                            <td>{child?.nationality}</td>
                            <td>{child?.sex}</td>
                            <td>{child?.passportNumber}</td>
                            <td>
                              {currency(
                                (passengerPrice('Child')?.fare || 0) +
                                  (passengerPrice('Child')?.commission || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}

                  {data?.passengers?.infant &&
                    data?.passengers?.infant?.length > 0 && (
                      <>
                        <tr>
                          <td className="" colSpan={7}>
                            <span className="fw-bold text-uppercase">
                              Infant
                            </span>
                          </td>
                        </tr>

                        {data?.passengers?.infant?.map((infant, i: number) => (
                          <tr key={i}>
                            <td>{infant?.passengerTitle}</td>
                            <td>{infant?.firstName}</td>
                            <td>{infant?.lastName}</td>
                            <td>{infant?.nationality}</td>
                            <td>{infant?.sex}</td>
                            <td>{infant?.passportNumber}</td>
                            <td>
                              {currency(
                                (passengerPrice('Infant')?.fare || 0) +
                                  (passengerPrice('Infant')?.commission || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-lg-9 col-12 mx-auto">
        <h5 className="fw-bold text-muted text-uppercase">Flight Details</h5>

        <div className="p-2 bg-white mb-2">
          <div>
            <span className="fw-bold">Contact Email</span>
            <span className="ms-2">{data?.contact?.email}</span>
          </div>

          <div>
            <span className="fw-bold">Contact Phone</span>
            <span className="ms-2">{data?.contact?.phone}</span>
          </div>
        </div>

        <div className="p-2 bg-white mb-2">
          <div>
            <span className="fw-bold">Payment Method</span>
            <span className="ms-2">
              {data?.payment?.paymentMethod?.toUpperCase()}
            </span>
          </div>

          <div>
            <span className="fw-bold">Payment Phone</span>
            <span className="ms-2">{data?.payment?.phone}</span>
          </div>
        </div>

        <div className="p-2 bg-white mb-2">
          <div>
            <span className="fw-bold">Airline</span>
            <span className="ms-2">{data?.flight?.airline?.toUpperCase()}</span>
          </div>

          <div>
            <span className="fw-bold">Reservation ID</span>
            <span className="ms-2">{data?.flight?.reservationId}</span>
          </div>

          <div>
            <span className="fw-bold">PNR Number</span>
            <span className="ms-2">{data?.flight?.pnrNumber}</span>
          </div>
        </div>

        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">Departure Date</div>
              {moment(data?.flight?.departureDate).format('llll')}
            </div>

            <div className="ms-2 ms-auto justify-content-end text-end">
              <div className="fw-bold">Arrival Date</div>
              {moment(data?.flight?.arrivalDate).format('llll')}
            </div>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">From City</div>
              {data?.flight?.fromCityName}
            </div>

            <div className="ms-2 ms-auto text-end">
              <div className="fw-bold">To City</div>
              {data?.flight?.toCityName}
            </div>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">From Country</div>
              {data?.flight?.fromCountryName}
            </div>

            <div className="ms-2 ms-auto text-end">
              <div className="fw-bold">To Country</div>
              {data?.flight?.toCountryName}
            </div>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">From City Code</div>
              {data?.flight?.fromCityCode}
            </div>
            <div className="ms-2 ms-auto text-end">
              <div className="fw-bold">To City Code</div>
              {data?.flight?.toCityCode}
            </div>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">From Airport</div>
              {data?.flight?.fromAirportName}
            </div>

            <div className="ms-2 ms-auto text-end">
              <div className="fw-bold">To Airport</div>
              {data?.flight?.toAirportName}
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ReservationDetails
