import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import {
  FaArrowAltCircleRight,
  FaArrowCircleLeft,
  FaCheckSquare,
  FaRegCheckCircle,
  FaSearch,
} from 'react-icons/fa'
import Link from 'next/link'

const ExistingPatient = () => {
  const router = useRouter()
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.get(
        `https://himiloapi.com/api/v1/patients?search=${search}&apiKey=apikey123456&hospital=test`
      )
      console.log(await data)
      setPatients(await data)
      setError('')
    } catch (error) {
      setError(error.response.data.message)
      setPatients([])
    }
    setLoading(false)
  }
  return (
    <div className=''>
      <button
        onClick={() => router.back()}
        className='btn btn-primary btn-sm rounded-pill mb-2'
      >
        <FaArrowCircleLeft className='mb-1' /> Go Back
      </button>
      <form onSubmit={submitHandler}>
        <div className='input-group mb-3'>
          <input
            onChange={(e) => setSearch(e.target.value)}
            required
            type='text'
            className='form-control shadow-none'
            placeholder='Search by patient id or mobile number'
            aria-label='Search by patient id or mobile number'
            aria-describedby='basic-addon2'
          />
          <button
            className='input-group-text btn btn-primary shadow-none'
            id='basic-addon2'
          >
            <FaSearch className='mb-1' /> Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className='text-center' style={{ fontSize: '200px' }}>
          <div className='spinner-border' role='status'></div>
        </div>
      ) : patients && patients.total > 0 ? (
        <table className='table table-sm hover bordered table-striped caption-top'>
          <caption>{patients && patients.total} Patients were found!</caption>
          <thead>
            <tr>
              <th scope='col'>PATIENT ID</th>
              <th scope='col'>NAME</th>
              <th scope='col'>GENDER</th>
              <th scope='col'>AGE</th>
              <th scope='col'>TEL</th>
              <th scope='col'>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {patients &&
              patients.patients.map((patient, index) => (
                <tr key={index}>
                  <td>{patient.PatientID}</td>
                  <td>{patient.Name}</td>
                  <td>{patient.Gender}</td>
                  <td>{patient.Age}</td>
                  <td>{patient.Tel}</td>
                  <td>
                    <Link href={`/appointment/${patient.PatientID}`}>
                      <a className='btn btn-primary btn-sm  shadow-none'>
                        {' '}
                        <FaArrowAltCircleRight className='mb-1' /> NEXT{' '}
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className='text-center'>
          <span className='text-danger'>{error}</span>
        </div>
      )}
    </div>
  )
}

export default ExistingPatient
