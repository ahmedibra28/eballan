import React from 'react'
import Steps from '../components/Steps'

import {
  FaArrowCircleRight,
  FaDollarSign,
  FaDotCircle,
  FaInfoCircle,
  FaPassport,
  FaPhoneAlt,
  FaUser,
} from 'react-icons/fa'
import {
  MdAirlineSeatLegroomExtra,
  MdOutlineAirlineSeatReclineNormal,
} from 'react-icons/md'
import Image from 'next/image'

const Passenger = () => {
  const steps = [
    {
      id: 1,
      title: 'Search',
      active: false,
      completed: true,
      link: '/search-results',
    },
    {
      id: 2,
      title: 'Passenger details',
      active: false,
      completed: true,
      link: '/passenger',
    },
    {
      id: 3,
      title: 'Trip summary',
      active: true,
      completed: false,
      link: '/trip-summary',
    },
    {
      id: 4,
      title: 'Payment',
      active: false,
      completed: false,
      link: '/payment',
    },
  ]

  return (
    <div className="py-2">
      <Steps steps={steps} />

      <h6 className="fw-bold text-uppercase mt-4">Trip Summary</h6>

      <div className="row gy-3">
        <div className="col-lg-8 col-12">
          <div className="row gy-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="col-lg-6 col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <p className="text-uppercase fw-bold">Passenger Details</p>

                    <h6>
                      <Image
                        src="https://www.worldometers.info//img/flags/small/tn_so-flag.gif"
                        width={20}
                        height={20}
                        style={{ objectFit: 'cover' }}
                        alt="flag"
                        className="rounded-pill"
                      />
                      <span className="text-muted">
                        {' '}
                        Mr. Abdikani Abukar Samow
                      </span>
                    </h6>
                    <h6>
                      <FaPassport className="mb-1" />
                      <span className="text-muted"> P00121212</span>
                    </h6>
                    <h6>
                      <FaPhoneAlt className="mb-1" />
                      <span className="text-muted"> +252 615 123 456</span>
                    </h6>
                    <h6>
                      <FaUser className="mb-1" />
                      <span className="text-muted"> Adult</span>
                    </h6>
                    <h6>
                      <MdOutlineAirlineSeatReclineNormal className="mb-1 fs-5" />
                      <span className="text-muted"> Random Seat</span>
                    </h6>
                    <h6 className="text-end">
                      <FaDollarSign className="mb-1" />
                      <span className="fw-bold"> $175.00</span>
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4 col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p>
                To go on trip from <strong>Mogadishu</strong> to
                <strong> Dhobley</strong>
              </p>

              <div className="row">
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span>15:20:00</span>
                  <small className="text-muted">Thu, 09, 03</small>
                </div>
                <div className="col-auto my-auto">
                  <FaDotCircle />
                </div>
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span> Mogadishu (MGQ)</span>
                  <small className="text-muted">
                    Aden Adde International Airport
                  </small>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-auto d-flex flex-column ms-5 ps-5"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <div
                    className="d-flex"
                    style={{ height: 50, marginLeft: 16 }}
                  >
                    <div className="vr"></div>
                  </div>
                </div>
              </div>
              <div className="row my-3">
                <div
                  className="col-auto"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  1hr 20min
                </div>
                <div className="col-auto my-auto" style={{ marginLeft: 2 }}>
                  <FaDotCircle />
                </div>
                <div
                  className="col-auto"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <Image
                    src="/favicon.png"
                    width={20}
                    height={20}
                    alt="airline"
                    style={{ objectFit: 'cover' }}
                  />
                  <span> eBallan Airline</span>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-auto ms-5 ps-5"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <div
                    className="d-flex"
                    style={{ height: 50, marginLeft: 16 }}
                  >
                    <div className="vr"></div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span> 15:20:00</span>
                  <small className="text-muted">Thu, 09, 03</small>
                </div>
                <div className="col-auto my-auto">
                  <FaDotCircle />
                </div>
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span> Dhobley (DOB)</span>
                  <small className="text-muted">
                    Aden Adde International Airport
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <p>
                <span className="me-4">1x Passenger</span>
                <span>$175.00</span>
              </p>
              <p className="fw-bold">
                <span className="me-4">Total</span>
                <span>$175.00</span>
              </p>

              <div className="text-end">
                <button className="btn btn-warning text-light rounded-pill">
                  Continue <FaArrowCircleRight className="mb-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-light p-2">
        <div className="text-end">
          <span className="me-5 fs-4">1x Passenger</span>
          <span className="fs-4">$175.00</span>
        </div>
        <div className="text-end">
          <span className="me-5 fw-bold fs-4">Total</span>
          <span className="fw-bold fs-4">$175.00</span>
        </div>
      </div>

      <div className="p-3 mt-4 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary rounded-pill">
          <FaInfoCircle className="mb-1" /> Review passenger details
        </button>
        <button className="btn btn-warning rounded-pill text-light">
          Continue <FaArrowCircleRight className="mb-1" />
        </button>
      </div> */}
    </div>
  )
}

export default Passenger
