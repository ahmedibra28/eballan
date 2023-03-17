import React from 'react'
import Steps from '../components/Steps'
import {
  DynamicFormProps,
  inputDate,
  inputEmail,
  inputTel,
  inputText,
  staticInputSelect,
} from '../utils/dForms'
import { useForm } from 'react-hook-form'
import { FaArrowCircleRight, FaUserPlus } from 'react-icons/fa'

const Passenger = () => {
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

  const submitHandler = (data: any) => {
    console.log(data)
  }

  return (
    <div className="py-2">
      <Steps steps={steps} />
      <form onSubmit={handleSubmit(submitHandler)}></form>
      <div className="row gy-3 bg-light shadow-sm rounded-2 p-2 mt-4">
        <div className="col-12">
          <h6 className="fw-bold text-uppercase">Personal Info</h6>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'First Name',
            name: 'fistName',
            placeholder: 'Enter fist name',
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'Second Name',
            name: 'secondName',
            placeholder: 'Enter second name',
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'Last Name',
            name: 'lastName',
            placeholder: 'Enter last name',
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {staticInputSelect({
            register,
            errors,
            label: 'Nationality',
            name: 'nationality',
            placeholder: 'Select nationality',
            data: [
              { name: 'Somalia' },
              { name: 'Ethiopia' },
              { name: 'Kenya' },
            ],
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {staticInputSelect({
            register,
            errors,
            label: 'Sex',
            name: 'sex',
            placeholder: 'Select sex',
            data: [{ name: 'Male' }, { name: 'Female' }],
          } as DynamicFormProps)}
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          {inputDate({
            register,
            errors,
            label: 'Date of Birth',
            name: 'dob',
            placeholder: 'Enter date of birth',
          } as DynamicFormProps)}
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          {inputText({
            register,
            errors,
            label: 'Passport Number',
            name: 'passportNumber',
            placeholder: 'Enter passport number',
          } as DynamicFormProps)}
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          {inputDate({
            register,
            errors,
            label: 'Passport Expiry Date',
            name: 'passportExpiryDate',
            placeholder: 'Enter passport expiry date',
          } as DynamicFormProps)}
        </div>
      </div>

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

      <div className="p-3 mt-4 d-flex justify-content-between align-items-center">
        <button className="btn btn-primary rounded-pill">
          <FaUserPlus className="mb-1" /> Add another passenger
        </button>
        <button className="btn btn-warning rounded-pill text-light">
          Continue <FaArrowCircleRight className="mb-1" />
        </button>
      </div>
    </div>
  )
}

export default Passenger
