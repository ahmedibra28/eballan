import React, { Fragment, useEffect, useState } from 'react'
import Steps from '../components/Steps'

import {
  FaArrowCircleRight,
  FaDotCircle,
  FaPassport,
  FaPhoneAlt,
  FaSignInAlt,
  FaUser,
} from 'react-icons/fa'
import { MdOutlineAirlineSeatReclineNormal } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'
import useFlightStore from '../zustand/flightStore'
import { currency } from '../utils/currency'
import moment from 'moment'
import { useRouter } from 'next/router'
import {
  DynamicFormProps,
  dynamicInputSelect,
  inputDate,
  inputText,
  staticInputSelect,
} from '../utils/dForms'
import { useForm } from 'react-hook-form'
import apiHook from '../api'
import { FormView } from '../components'
import { userInfo } from '../api/api'

const Passenger = () => {
  const router = useRouter()
  const { passengers, flight, contact, updatePassenger } = useFlightStore(
    (state) => state
  )

  const [tempPassengerInfo, setTempPassengerInfo] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (!contact?.phone || !contact?.email) {
      router.push('/passenger')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPassengerTitle = apiHook({
    key: ['passenger-titles'],
    method: 'GET',
    url: `passenger/titles?airline=maandeeqair`,
  })?.get

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

  const infoCard = (item: any, type: string) => {
    return (
      <div className="col-lg-6 col-12">
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
              <span className="text-muted ms-1">
                {item?.passengerTitle}. {item?.firstName} {item?.secondName}{' '}
                {item?.lastName}
              </span>
            </h6>
            <h6>
              <FaPassport className="mb-1" />
              <span className="text-muted"> {item?.passportNumber}</span>
            </h6>
            <h6>
              <FaPhoneAlt className="mb-1" />
              <span className="text-muted"> {contact?.phone}</span>
            </h6>
            <h6>
              <FaUser className="mb-1" />
              <span className="text-muted"> {type}</span>
            </h6>
            <h6>
              <MdOutlineAirlineSeatReclineNormal className="mb-1 fs-5" />
              <span className="text-muted"> Random Seat</span>
            </h6>
            <h6 className="text-end">
              <span className="fw-bold">
                {currency(
                  flight?.prices?.find((item) => item?.passenger?.type === type)
                    ?.fare +
                    (type === 'Adult'
                      ? flight?.prices?.find(
                          (item) => item?.passenger?.type === type
                        )?.dbCommission || 0
                      : type === 'Child'
                      ? flight?.prices?.find(
                          (item) => item?.passenger?.type === type
                        )?.dbCommission || 0
                      : (type === 'Infant' &&
                          flight?.prices?.find(
                            (item) => item?.passenger?.type === type
                          )?.dbCommission) ||
                        0)
                )}
              </span>
            </h6>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target={`#updatePassenger`}
              onClick={() => {
                setTempPassengerInfo(item)
                editHandler(item)
              }}
              className="btn btn-primary btn-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )
  }

  const form = [
    <Fragment key={0}>
      <div className="col-md-6 col-12">
        {dynamicInputSelect({
          register,
          errors,
          label: 'Passenger Title',
          name: `passengerTitle`,
          placeholder: 'Select passenger title',
          value: 'description',
          data: getPassengerTitle?.data,
        } as DynamicFormProps)}
      </div>
      <div className="col-md-6 col-12">
        {inputText({
          register,
          errors,
          label: 'First Name',
          name: `firstName`,
          placeholder: 'Enter fist name',
        } as DynamicFormProps)}
      </div>
      <div className="col-md-6 col-12">
        {inputText({
          register,
          errors,
          label: 'Second Name',
          name: `secondName`,
          placeholder: 'Enter second name',
        } as DynamicFormProps)}
      </div>
      <div className="col-md-6 col-12">
        {inputText({
          register,
          errors,
          label: 'Last Name',
          name: `lastName`,
          placeholder: 'Enter last name',
        } as DynamicFormProps)}
      </div>
      <div className="col-md-6 col-12">
        {staticInputSelect({
          register,
          errors,
          label: 'Nationality',
          name: `nationality`,
          placeholder: 'Select nationality',
          data: [{ name: 'Somalia' }, { name: 'Ethiopia' }, { name: 'Kenya' }],
        } as DynamicFormProps)}
      </div>
      <div className="col-md-6 col-12">
        {staticInputSelect({
          register,
          errors,
          label: 'Sex',
          name: `sex`,
          placeholder: 'Select sex',
          data: [{ name: 'Male' }, { name: 'Female' }],
        } as DynamicFormProps)}
      </div>
      <div className="col-md-6 col-12">
        {inputDate({
          register,
          errors,
          label: 'Date of Birth',
          name: `dob`,
          placeholder: 'Enter date of birth',
        } as DynamicFormProps)}
      </div>

      <div className="col-lg-6 col-md-6 col-12">
        {inputText({
          register,
          errors,
          label: 'Passport Number',
          name: `passportNumber`,
          placeholder: 'Enter passport number',
          isRequired: false,
        } as DynamicFormProps)}
      </div>

      <div className="col-lg-6 col-md-6 col-12">
        {inputDate({
          register,
          errors,
          label: 'Passport Expiry Date',
          name: `passportExpiryDate`,
          placeholder: 'Enter passport expiry date',
          isRequired: false,
        } as DynamicFormProps)}
      </div>
    </Fragment>,
  ]

  const formCleanHandler = () => {
    reset()
    setTempPassengerInfo(null)
  }

  const editHandler = (item: any) => {
    setValue('passengerTitle', item?.passengerTitle)
    setValue('firstName', item?.firstName)
    setValue('secondName', item?.secondName)
    setValue('lastName', item?.lastName)
    setValue('nationality', item?.nationality)
    setValue('sex', item?.sex)
    setValue('dob', item?.dob)
    setValue('passportNumber', item?.passportNumber)
    setValue('passportExpiryDate', item?.passportExpiryDate)
  }

  const submitHandler = (data: any) => {
    if (tempPassengerInfo) {
      // @ts-ignore
      updatePassenger({ ...data, id: tempPassengerInfo?.id })

      formCleanHandler()

      document
        .querySelector(
          '#updatePassenger > div > div > div.modal-body > form > div.modal-footer > button.btn'
        )
        // @ts-ignore
        ?.click()
    }
  }

  return (
    <div className="py-2">
      <Steps steps={steps} />

      <FormView
        edit={true}
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={false}
        isLoadingPost={false}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={'updatePassenger'}
        label="Passenger Info"
        modalSize="modal-md"
      />

      <h6 className="fw-bold text-uppercase mt-4">Trip Summary</h6>

      <div className="row gy-3">
        <div className="col-lg-8 col-12">
          <div className="row gy-3 mb-3">
            {passengers?.[0]?.adult?.map((item, i) => (
              <Fragment key={i}>{infoCard(item, 'Adult')}</Fragment>
            ))}
          </div>

          <div className="row gy-3 mb-3">
            {passengers?.[0]?.child?.map((item, i) => (
              <Fragment key={i}>{infoCard(item, 'Child')}</Fragment>
            ))}
          </div>

          <div className="row gy-3 mb-3">
            {passengers?.[0]?.infant?.map((item, i) => (
              <Fragment key={i}>{infoCard(item, 'Infant')}</Fragment>
            ))}
          </div>
        </div>

        <div className="col-lg-4 col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <p>
                To go on trip from
                <strong> {flight?.flight?.fromCityName}</strong> to
                <strong> {flight?.flight?.toCityName}</strong>
              </p>

              <div className="row">
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span>{flight?.flight?.departureTime}</span>
                  <small className="text-muted">
                    {moment(flight?.flight?.departureDate).format(
                      'ddd, DD MMM'
                    )}
                  </small>
                </div>
                <div className="col-auto my-auto">
                  <FaDotCircle />
                </div>
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span>
                    {' '}
                    {flight?.flight?.fromCityName} (
                    {flight?.flight?.fromCityCode})
                  </span>
                  <small className="text-muted">
                    {flight?.flight?.fromAirportName}
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
                  {getHoursBetween(
                    flight?.flight?.departureTime,
                    flight?.flight?.arrivalTime
                  )}
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
                  <span> {flight?.airline}</span>
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
                  <span> {flight?.flight?.arrivalTime}</span>
                  <small className="text-muted">
                    {moment(flight?.flight?.arrivalDate).format('ddd, DD MMM')}
                  </small>
                </div>
                <div className="col-auto my-auto">
                  <FaDotCircle />
                </div>
                <div
                  className="col-auto d-flex flex-column"
                  style={{ minWidth: 90, maxWidth: 300 }}
                >
                  <span>
                    {flight?.flight?.toCityName} ({flight?.flight?.toCityCode})
                  </span>
                  <small className="text-muted">
                    {flight?.flight?.toAirportName}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <p>
                <span className="me-4">
                  {Number(passengers?.[0]?.adult?.length || 0) +
                    Number(passengers?.[0]?.child?.length || 0) +
                    Number(passengers?.[0]?.infant?.length || 0)}
                  x Passengers
                </span>
              </p>
              <p className="fw-bold">
                <span className="me-4">Total</span>
                <span>
                  {currency(
                    flight?.prices?.reduce(
                      (acc, item) => acc + item?.totalPrice,
                      0
                    )
                  )}
                </span>
              </p>

              <div className="d-flex justify-content-between">
                {!userInfo().userInfo && (
                  <Link
                    href="/auth/login?next=/trip-summary"
                    className="btn btn-primary text-light rounded-pill"
                  >
                    Login <FaSignInAlt className="mb-1" />
                  </Link>
                )}
                <Link
                  href="/payment"
                  className="btn btn-warning text-light rounded-pill"
                >
                  Continue {!userInfo().userInfo && 'as guest'}{' '}
                  <FaArrowCircleRight className="mb-1" />
                </Link>
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
