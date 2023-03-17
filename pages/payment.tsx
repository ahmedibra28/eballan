import React from 'react'
import Steps from '../components/Steps'
import Image from 'next/image'
import { FaPhoneAlt } from 'react-icons/fa'

const Payment = () => {
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
      active: false,
      completed: true,
      link: '/trip-summary',
    },
    {
      id: 4,
      title: 'Payment',
      active: true,
      completed: false,
      link: '/payment',
    },
  ]
  return (
    <div className="py-2">
      <Steps steps={steps} />

      <h6 className="fw-bold text-uppercase mt-4">Payment</h6>

      <div className="row gy-3">
        <div className="col-lg-5 col-12 mx-auto">
          <div className="card shadow-sm rounded-2 border-0">
            <div className="card-body">
              <h6 className="fw-bold">Choose payment method</h6>

              <div className="row gy-3 mt-2 ">
                {['hormuud', 'somtel', 'somnet', 'mastercard'].map((item) => (
                  <div key={item} className="col-auto">
                    <div
                      className={`card ${
                        item === 'hormuud'
                          ? 'border border-warning border-3'
                          : 'border border-6 border-light'
                      } shadow-sm`}
                    >
                      <div className="card-body">
                        <Image
                          src={`/payments/${item}.png`}
                          width={40}
                          height={40}
                          alt="payment method"
                          style={{ objectFit: 'contain' }}
                        />
                        <small className="text-uppercase text-muted ms-2">
                          {item}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row gy-3 mt-4">
        <div className="col-lg-5 col-12 mx-auto">
          <div className="card shadow-sm rounded-2 border-0">
            <div className="card-body">
              <h6 className="fw-bold">Order Summary</h6>

              <table className="my-3">
                <tbody>
                  <tr>
                    <td className="">1x Passenger</td>
                    <td className="text-end ps-3">$175.00</td>
                  </tr>
                  <tr>
                    <td className="me-4 fw-bold">Total</td>
                    <td className="fw-bold text-end">$175.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="input-group mb-3">
                <span className="input-group-text bg-warning border border-3 border-warning rounded-0">
                  <FaPhoneAlt className="text-light" />
                </span>
                <input
                  type="text"
                  className="form-control rounded-0"
                  placeholder='Enter the phone number you used to pay with "Hormuud"'
                />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn btn-outline-danger rounded-pill btn-sm px-4">
                  Cancel
                </button>
                <button className="btn btn-primary rounded-pill btn-sm px-4">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
