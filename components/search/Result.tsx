import Image from 'next/image'
import React from 'react'
import { FaArrowRight, FaShareAlt } from 'react-icons/fa'
import { currency } from '../../utils/currency'
import useFlightStore from '../../zustand/flightStore'
import { useRouter } from 'next/router'

const Result = ({ item }: { item: any }) => {
  const router = useRouter()

  const { setFlight } = useFlightStore((state) => state)
  function getHoursBetween(startTime: string, endTime: string): string {
    const start = new Date(`2022-01-01T${startTime}Z`)
    const end = new Date(`2022-01-01T${endTime}Z`)
    const diff = end.getTime() - start.getTime()
    const hours = diff / (1000 * 60 * 60)

    if (hours >= 1) {
      const wholeHours = Math.floor(hours)
      const minutes = Math.round((hours - wholeHours) * 60)
      return `${wholeHours}:${minutes < 10 ? '0' : ''}${minutes} hour`
    } else {
      const minutes = Math.round(hours * 60)
      return `${minutes} minutes`
    }
  }

  return (
    <div className="card border-0 rounded-2 shadow mb-2">
      <div className="card-body">
        <div className="row">
          <div className="col-lg-3 col-12 my-auto text-center">
            <Image src="/favicon.png" alt="airplane" width={50} height={50} />{' '}
            <br />
            <br />
            <span className="fw-bold text-uppercase">{item.airline}</span>
          </div>
          <div className="col-lg-6 col-12 border border-bottom-0 border-top-0 my-auto">
            <div className="d-flex justify-content-around align-items-center">
              <div className="text-center">
                <span className="fw-bold"> {item?.flight?.departureTime}</span>{' '}
                <br />
                <span className="">{item?.flight?.fromCityCode}</span>
              </div>
              <div className="text-center">
                <FaArrowRight className="me-3" />
                <span className="">Direct</span>
                <FaArrowRight className="ms-3" />
              </div>
              <div className="text-center">
                <span className="fw-bold"> {item?.flight?.arrivalTime}</span>
                <br />
                <span className="">{item?.flight?.toCityCode}</span>
              </div>
              <div className="text-center">
                <span className="fw-light">
                  {getHoursBetween(
                    item?.flight?.departureTime,
                    item?.flight?.arrivalTime
                  )}
                </span>
                <br />
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-12 text-center">
            <FaShareAlt className="text-warning float-end" /> <br />
            <button className="btn btn-light text-uppercase my-2">
              <span className="fs-1">
                {currency(
                  item?.prices?.reduce(
                    (acc: number, cur: any) => acc + cur.totalPrice,
                    0
                  )
                )}
              </span>
            </button>
            <br />
            <button
              onClick={() => {
                setFlight(item)
                router.push('/passenger')
              }}
              className="btn btn-primary text-uppercase"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
