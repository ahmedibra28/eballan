import React, { useEffect, useState } from 'react'
import Steps from '../components/Steps'
import Image from 'next/image'
import { FaPhoneAlt } from 'react-icons/fa'
import useFlightStore from '../zustand/flightStore'
import { useRouter } from 'next/router'
import { currency } from '../utils/currency'
import apiHook from '../api'
import { Message } from '../components'

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

  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('hormuud')

  const { passengers, flight, contact } = useFlightStore((state) => state)

  useEffect(() => {
    if (flight?.prices?.length === 0 || !contact.phone) {
      router.push('/passenger')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmBooking = apiHook({
    key: ['reservations'],
    method: 'POST',
    url: `reservations`,
  })?.post

  const handleBooking = () => {
    confirmBooking?.mutateAsync({
      passengers,
      flight,
      contact,
      payment: {
        phone,
        paymentMethod,
      },
    })
    console.log({
      passengers,
      flight,
      contact,
      payment: {
        phone,
        paymentMethod,
      },
    })
  }

  useEffect(() => {
    if (confirmBooking?.isSuccess) {
      router.push('/success')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmBooking?.isSuccess])

  useEffect(() => {
    if (paymentMethod) {
      setPhone('')
    }
  }, [paymentMethod])

  return (
    <div className="py-2">
      <Steps steps={steps} />

      {confirmBooking?.isError && (
        <Message variant="danger" value={confirmBooking?.error} />
      )}

      <h6 className="fw-bold text-uppercase mt-4">Payment</h6>

      <div className="row gy-3">
        <div className="col-lg-5 col-12 mx-auto">
          <div className="card shadow-sm rounded-2 border-0">
            <div className="card-body">
              <h6 className="fw-bold">Choose payment method</h6>

              <div className="row gy-3 mt-2 ">
                {['hormuud', 'somtel', 'somnet', 'mastercard'].map((item) => (
                  <div key={item} className="col-auto">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod(item)}
                      className={`card ${
                        item === paymentMethod
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
                    </button>
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
                    <td className="">
                      {Number(passengers?.[0]?.adult?.length || 0) +
                        Number(passengers?.[0]?.child?.length || 0) +
                        Number(passengers?.[0]?.infant?.length || 0)}
                      x Passengers
                    </td>
                  </tr>
                  <tr>
                    <td className="me-4 fw-bold">Total</td>
                    <td className="fw-bold text-end">
                      {currency(
                        flight?.prices?.reduce(
                          (acc, item) => acc + item?.totalPrice,
                          0
                        ) || 0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="input-group mb-3">
                <span className="input-group-text bg-warning border border-3 border-warning rounded-0">
                  <FaPhoneAlt className="text-light" />
                </span>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  disabled={Boolean(!paymentMethod)}
                  type="number"
                  className="form-control rounded-0"
                  placeholder={`Enter your ${paymentMethod} phone number without +252`}
                />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  onClick={() => router.push('/')}
                  className="btn btn btn-outline-danger rounded-pill btn-sm px-4"
                >
                  Cancel
                </button>
                <button
                  disabled={Boolean(!phone) || confirmBooking?.isLoading}
                  onClick={() => handleBooking()}
                  className="btn btn-primary rounded-pill btn-sm px-4"
                >
                  {confirmBooking?.isLoading ? 'Loading...' : 'Pay Now'}
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
