import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { FaArrowCircleLeft, FaDollarSign } from 'react-icons/fa'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { inputNumber, staticInputSelect } from '../../utils/dynamicForm'
const CheckOut = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const [checkout, setCheckout] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const patientId =
    router.query && router.query.checkout && router.query.checkout[0]
  const doctorId =
    router.query && router.query.checkout && router.query.checkout[1]

  useEffect(() => {
    const getCheckout = async () => {
      setLoading(true)
      await axios
        .get(
          `https://himiloapi.com/api/v1/doctors?apiKey=apikey123456&hospital=test`
        )
        .then((res) => {
          setCheckout(res.data)
          setError('')
          setLoading(false)
        })
        .catch((error) => {
          setCheckout([])
          setError(error.response.data.message)
          setLoading(false)
        })
    }

    if (doctorId && patientId) getCheckout()
  }, [patientId, doctorId])

  const doctor =
    checkout &&
    checkout.doctors &&
    checkout.doctors.find((doc) => doc.DoctorID === doctorId)

  const toDay = new Date()

  if (error)
    return (
      <div className='text-center'>
        <span className='text-danger'>{error}</span>
      </div>
    )

  const submitHandler = (data) => {
    setLoadingPost(true)

    try {
      const createNewTicket = async (ticket) => {
        await axios
          .post(
            `https://himiloapi.com/api/v1/patients/existing?apiKey=apikey123456&hospital=test`,
            ticket
          )
          .then((res) => {
            typeof window !== undefined && alert(JSON.stringify(res.data))
            setLoadingPost(false)
          })
          .catch((error) => {
            reset()
            setLoadingPost(false)
            setError(error.response.data.message)
          })
      }

      createNewTicket({
        PatientID: patientId,
        DoctorID: doctor.DoctorID,
        PatientType: 'OutPatient',
        BookingTel: data.mobile,
        AppointmentDate: data.appointment,
        Booked: 1,
      })
    } catch (error) {
      setError(error.response.data.message)
      console.error(error.response.data.message)
    }
  }

  return (
    <>
      {loading ? (
        <div className='text-center' style={{ fontSize: '200px' }}>
          <div className='spinner-border' role='status'></div>
        </div>
      ) : (
        doctor && (
          <>
            <button
              onClick={() => router.back()}
              className='btn btn-primary btn-sm rounded-pill'
            >
              <FaArrowCircleLeft className='mb-1' /> Go Back
            </button>

            <div className='row shadow mt-2 rounded-3'>
              <div className='col-12 mx-auto p-3'>
                <hr />
                <div className='row'>
                  <div className='col-lg-4 col-12'>
                    <span className='fw-bold'>Patient ID: </span>{' '}
                    {patientId && patientId}
                  </div>

                  <div className='col-lg-4 col-12'>
                    <span className='fw-bold'>Doctor Queue No: </span> #
                    {doctor.OnlineDoctorNo}
                  </div>
                  <div className='col-lg-4 col-12'>
                    <span className='fw-bold'>Doctor Name: </span> {doctor.Name}
                  </div>
                </div>
                <hr />

                <div className='row'>
                  <div className='col-md-4 col-12'>
                    <span className='fw-bold'>Ticket Cost: </span> $
                    {doctor.Cost.toFixed(2)}
                  </div>

                  <div className='col-md-4 col-12'>
                    <span className='fw-bold'>Service Cost: </span> $1.00
                  </div>

                  <div className='col-md-4 col-12'>
                    <span className='fw-bold'>Total Cost: </span> $
                    {(doctor.Cost + 1).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className='row mt-3'>
                <div className='col-md-4 col-6'>
                  {staticInputSelect({
                    register,
                    errors,
                    label: 'Appointment Date',
                    name: 'appointment',
                    data: [
                      { name: moment(toDay).format('YYYY-MM-DD') },
                      {
                        name: moment(toDay).add(1, 'days').format('YYYY-MM-DD'),
                      },
                    ],
                  })}
                </div>
                <div className='col-md-4 col-6'>
                  {inputNumber({
                    register,
                    errors,
                    label: 'Mobile Number',
                    name: 'mobile',
                  })}
                </div>
                <div className='col-md-4 col-12 mt-2'>
                  <button
                    disabled={loadingPost}
                    className='btn btn-primary btn-lg mt-3 form-control'
                  >
                    {loadingPost ? (
                      <span className='spinner-border spinner-border-sm' />
                    ) : (
                      <span>
                        <FaDollarSign className='mb-1' /> Pay Now
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className='text-center'>
              <span className='text-danger'>{error}</span>
            </div>
          </>
        )
      )}
    </>
  )
}

export default CheckOut
