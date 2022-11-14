import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaDollarSign } from 'react-icons/fa'
import {
  dynamicInputSelect,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../utils/dynamicForm'

const NewPatient = () => {
  const [doctors, setDoctors] = useState([])
  const [towns, setTowns] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const toDay = new Date()

  useEffect(() => {
    const getDoctors = async () => {
      setLoading(true)
      await axios
        .get(
          `https://himiloapi.com/api/v1/doctors?apiKey=apikey123456&hospital=test`
        )
        .then((res) => {
          setDoctors(res.data)
          setError('')
          setLoading(false)
        })
        .catch((error) => {
          setDoctors([])
          setError(error.response.data.message)
          setLoading(false)
        })
    }
    getDoctors()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const getTowns = async () => {
      setLoading(true)
      await axios
        .get(
          `https://himiloapi.com/api/v1/towns?apiKey=apikey123456&hospital=test`
        )
        .then((res) => {
          setTowns(res.data)
          setError('')
          setLoading(false)
        })
        .catch((error) => {
          setTowns([])
          setError(error.response.data.message)
          setLoading(false)
        })
    }
    getTowns()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedDoctor =
    doctors &&
    doctors.doctors &&
    doctors.doctors.find((doc) => doc && doc.DoctorID === watch().Doctor)

  const submitHandler = (data) => {
    setLoadingPost(true)

    try {
      const createNewTicket = async (obj) => {
        console.log(obj)
        await axios
          .post(
            `https://himiloapi.com/api/v1/patients/new?apiKey=apikey123456&hospital=test`,
            obj
          )
          .then((res) => {
            typeof window !== undefined && alert(JSON.stringify(res.data))
            console.log(res.data)
            setLoadingPost(false)
            setError('')
            reset()
          })
          .catch((error) => {
            setError(error.response.data.message)
            setLoadingPost(false)
          })
      }

      createNewTicket({
        Name: data.Name,
        Gender: data.Gender,
        Age: data.Age,
        DateUnit: data.Unit,
        Town: data.Town,
        PatientType: 'OutPatient',
        Booked: 1,
        Tel: data.PatientMobile,
        BookingTel: data.PaymentMobile,
        MaritalStatus: data.Status,
        City: data.City,
        AppointmentDate: data.appointment,
        DoctorID: selectedDoctor.DoctorID,
      })
    } catch (error) {
      setError(error.response.data.message)
      console.error(error.response.data.message)
    }
  }
  if (error)
    return (
      <div className='text-center'>
        <span className='text-danger'>{error}</span>
      </div>
    )

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {loading ? (
        <div className='text-center' style={{ fontSize: '200px' }}>
          <div className='spinner-border' role='status'></div>
        </div>
      ) : (
        <div className='row'>
          <div className='col-lg-3 col-md-4 col-6'>
            {inputText({
              register,
              errors,
              label: 'Patient Name',
              name: 'Name',
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {staticInputSelect({
              register,
              errors,
              label: 'Gender',
              name: 'Gender',
              data: [{ name: 'Male' }, { name: 'Female' }],
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {inputNumber({
              register,
              errors,
              label: 'Age',
              name: 'Age',
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {staticInputSelect({
              register,
              errors,
              label: 'Unit',
              name: 'Unit',
              data: [{ name: 'Years' }, { name: 'Months' }, { name: 'Days' }],
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {staticInputSelect({
              register,
              errors,
              label: 'City',
              name: 'City',
              data: [{ name: 'Mogadishu' }],
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {dynamicInputSelect({
              register,
              errors,
              label: 'Town',
              name: 'Town',
              data: towns && towns.towns,
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {inputNumber({
              register,
              errors,
              label: 'Patient Mobile Number',
              name: 'PatientMobile',
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {staticInputSelect({
              register,
              errors,
              label: 'Status',
              name: 'Status',
              data: [
                { name: 'Child' },
                { name: 'Single' },
                { name: 'Married' },
              ],
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
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
          <div className='col-lg-3 col-md-4 col-6'>
            {dynamicInputSelect({
              register,
              errors,
              label: 'Doctor',
              name: 'Doctor',
              data: doctors && doctors.doctors,
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            {inputNumber({
              register,
              errors,
              label: 'Payment Mobile',
              name: 'PaymentMobile',
            })}
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            <button
              disabled={loadingPost}
              className='btn btn-primary btn-lg mt-4 form-control'
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
          <hr />
          <div className='col-lg-3 col-md-4 col-6'>
            <div className='mb-3'>
              <label htmlFor='DoctorNo'>Doctor No</label>
              <input
                className='form-control'
                disabled
                value={selectedDoctor && selectedDoctor.DoctorNo}
              />
            </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            <div className='mb-3'>
              <label htmlFor='Ticket Cost'>Ticket Cost</label>
              <input
                className='form-control'
                disabled
                value={selectedDoctor && selectedDoctor.Cost.toFixed(2)}
              />
            </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            <div className='mb-3'>
              <label htmlFor='Service Cost'>Service Cost</label>
              <input className='form-control' disabled value={`1.00`} />
            </div>
          </div>
          <div className='col-lg-3 col-md-4 col-6'>
            <div className='mb-3'>
              <label htmlFor='Total Cost'>Total Cost</label>
              <input
                className='form-control'
                disabled
                value={
                  selectedDoctor &&
                  (selectedDoctor && selectedDoctor.Cost + 1).toFixed(2)
                }
              />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default NewPatient
