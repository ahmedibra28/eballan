import React, { Fragment, useEffect } from 'react'
import Steps from '../components/Steps'
import {
  DynamicFormProps,
  dynamicInputSelect,
  inputDate,
  inputEmail,
  inputTel,
  inputText,
  staticInputSelect,
} from '../utils/dForms'
import { useForm } from 'react-hook-form'
import { FaArrowCircleRight } from 'react-icons/fa'
import useFlightStore from '../zustand/flightStore'
import useSearchFlightStore from '../zustand/searchFlightStore'
import useNumberToArray from '../hook/useNumberToArray'
import { useRouter } from 'next/router'
import apiHook from '../api'

import { v4 as uuidv4 } from 'uuid'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

const Passenger = () => {
  const router = useRouter()

  const { setPassengers, setContact, flight } = useFlightStore((state) => state)

  const { searchFlight } = useSearchFlightStore((state) => state)

  useEffect(() => {
    if (!flight || !flight?.flight?.id) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({})

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
      active: true,
      completed: false,
      link: '/passenger',
    },
    {
      id: 3,
      title: 'Trip summary',
      active: false,
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

  const getPassengerTitle = apiHook({
    key: ['passenger-titles'],
    method: 'GET',
    url: `passenger/titles?airline=maandeeqair`,
  })?.get

  const getCountries = apiHook({
    key: ['countries'],
    method: 'GET',
    url: `countries?airline=maandeeqair`,
  })?.get

  const submitHandler = (data: any) => {
    const reformatData = (types: string[]) => {
      const reformattedData = {}

      types.forEach((type) => {
        const typeData = []

        for (let i = 1; i <= 2; i++) {
          const obj = {}

          for (const key in data) {
            // @ts-ignore
            if (key.includes(type) && key.includes(i)) {
              // @ts-ignore
              const newKey = key.replace(type, '').replace(i, '')
              // @ts-ignore
              obj[newKey] = data[key]
              // obj['id'] = uuidv4()
            }
          }

          if (Object.keys(obj).length > 0) {
            typeData.push({ ...obj, id: uuidv4() })
          }
        }

        if (typeData.length > 0) {
          // @ts-ignore
          reformattedData[type.toLowerCase()] = typeData
        }
      })

      return [reformattedData]
    }

    const types = ['Adult', 'Child', 'Infant']

    const newData = reformatData(types)

    setPassengers(newData as any)
    setContact({
      email: data.email,
      phone: data.phone,
    })

    router.push('/trip-summary')
  }

  const formatResult = (item: { name: string }) => {
    return (
      <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
    )
  }

  const passengerForm = (passengerType: string, number: number) => {
    return (
      <div className="row gy-3 bg-light shadow-sm rounded-2 p-2 mt-4">
        <div className="col-12">
          <h6 className="fw-bold text-uppercase">
            {passengerType} {number} - Info
          </h6>
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          {dynamicInputSelect({
            register,
            errors,
            label: 'Passenger Title',
            name: `passengerTitle${passengerType}${number}`,
            placeholder: 'Select passenger title',
            value: 'description',
            data: getPassengerTitle?.data,
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'First Name',
            name: `firstName${passengerType}${number}`,
            placeholder: 'Enter fist name',
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'Second Name',
            name: `secondName${passengerType}${number}`,
            placeholder: 'Enter second name',
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'Last Name',
            name: `lastName${passengerType}${number}`,
            placeholder: 'Enter last name',
          } as DynamicFormProps)}
        </div>

        <div className="col-lg-4 col-md-6 col-12">
          <label htmlFor="" className="form-label mb-0">
            Nationality
          </label>
          <div className="input-group w-100 form-control form-control-sm rounded-0">
            <div className="w-100 border-0">
              <ReactSearchAutocomplete
                items={getCountries?.data as any[]}
                formatResult={formatResult}
                showIcon={false}
                styling={{ border: 'none', boxShadow: 'none', height: '25px' }}
                placeholder="Search nationality"
              />
            </div>
          </div>
        </div>

        {/* <div className="col-lg-4 col-md-6 col-12">
          {dynamicInputSelect({
            register,
            errors,
            label: 'Nationality',
            name: `nationality${passengerType}${number}`,
            placeholder: 'Select nationality',
            data: getCountries?.data,
            value: 'friendlyName',
          } as DynamicFormProps)}
        </div> */}
        <div className="col-lg-4 col-md-6 col-12">
          {staticInputSelect({
            register,
            errors,
            label: 'Sex',
            name: `sex${passengerType}${number}`,
            placeholder: 'Select sex',
            data: [{ name: 'Male' }, { name: 'Female' }],
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {inputDate({
            register,
            errors,
            label: 'Date of Birth',
            name: `dob${passengerType}${number}`,
            placeholder: 'Enter date of birth',
          } as DynamicFormProps)}
        </div>

        {/* <div className="col-lg-6 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'Passport Number',
            name: `passportNumber${passengerType}${number}`,
            placeholder: 'Enter passport number',
            isRequired: false,
          } as DynamicFormProps)}
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          {inputDate({
            register,
            errors,
            label: 'Passport Expiry Date',
            name: `passportExpiryDate${passengerType}${number}`,
            placeholder: 'Enter passport expiry date',
            isRequired: false,
          } as DynamicFormProps)}
        </div> */}
      </div>
    )
  }

  return (
    <div className="py-2">
      <Steps steps={steps} />
      <form onSubmit={handleSubmit(submitHandler)}>
        {useNumberToArray(searchFlight?.noAdult || 0).map((item, i: number) => (
          <Fragment key={i}>{passengerForm('Adult', item)}</Fragment>
        ))}

        {/* @ts-ignore */}
        {useNumberToArray(searchFlight?.noChild).map((item, i: number) => (
          <Fragment key={i}>{passengerForm('Child', item)}</Fragment>
        ))}

        {/*  @ts-ignore */}
        {useNumberToArray(searchFlight?.noInfant).map((item, i: number) => (
          <Fragment key={i}>{passengerForm('Infant', item)}</Fragment>
        ))}

        <div className="row gy-3 bg-light shadow-sm rounded-2 p-2 mt-4">
          <div className="col-12">
            <h6 className="fw-bold text-uppercase">Contact Details</h6>
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            {inputTel({
              register,
              errors,
              label: 'Phone',
              name: 'phone',
              placeholder: 'Enter phone number',
            } as DynamicFormProps)}
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            {inputEmail({
              register,
              errors,
              label: 'Email',
              name: 'email',
              placeholder: 'Enter email',
            } as DynamicFormProps)}
          </div>
        </div>

        <div className="p-3 mt-4 d-flex justify-content-end align-items-center">
          {/* <button className="btn btn-primary rounded-pill">
          <FaUserPlus className="mb-1" /> Add another passenger
        </button> */}
          <button
            type="submit"
            className="btn btn-warning rounded-pill text-light"
          >
            Continue <FaArrowCircleRight className="mb-1" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default Passenger
