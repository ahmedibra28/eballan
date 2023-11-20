'use client'
import FormView from '@/components/FormView'
import Message from '@/components/Message'
import {
  Autocomplete,
  DynamicInputSelect,
  InputDate,
  InputText,
  StaticInputSelect,
} from '@/components/dForms'
import Steps from '@/components/ui/Steps'
import DateTime from '@/lib/dateTime'
import country from '@/server/country'
import passengerTitle from '@/server/passengerTitle'
import { ICountry, IPassengerTitle } from '@/types'
import useFlightStore from '@/zustand/useFlightStore'
import usePassengerStore from '@/zustand/usePassengerStore'
import useUserInfoStore from '@/zustand/userStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function Page() {
  const router = useRouter()

  const [error, setError] = React.useState<string | null>(null)
  const [valueC, setValueC] = React.useState<string | null>(null)
  const [passengerTitles, setPassengerTitles] = React.useState<
    IPassengerTitle[]
  >([])
  const [countries, setCountries] = React.useState<ICountry[]>([])

  const { passenger, updatePassenger } = usePassengerStore((state) => state)
  const { flight } = useFlightStore((state) => state)
  const { userInfo } = useUserInfoStore((state) => state)
  const [tempPType, setTempPType] = React.useState([])

  React.useEffect(() => {
    if (!passenger || !flight) return router.back()
    // eslint-disable-next-line
  }, [])

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

  const getTitle = (n: string) => {
    if (n === '1') {
      return 'Mr. '
    } else if (n === '2') {
      return 'Mrs. '
    } else if (n === '3') {
      return 'Chd. '
    } else if (n === '4') {
      return 'Inf. '
    } else return ''
  }

  const getPassengerTitles = async () => {
    try {
      const data = await passengerTitle()
      setPassengerTitles(data)
    } catch (error) {
      setError(String(error))
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const getCountries = async () => {
    try {
      const data = await country()
      setCountries(data)
    } catch (error) {
      setError(String(error))
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  React.useEffect(() => {
    getPassengerTitles()
    getCountries()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({})

  const editHandler = (item: any) => {
    setValue('id', item?.id)
    setValue('country', item?.country)
    setValue('countryId', item?.countryId)
    setValue('dob', item?.dob)
    setValue('firstName', item?.firstName)
    setValue('lastName', item?.lastName)
    setValue('secondName', item?.secondName)
    setValue('passengerTitle', item?.passengerTitle)
    setValue('sex', item?.sex)
    setValue('passengerType', item?.passengerType)
    setValue('passengerTitle', Number(item?.passengerTitle))

    const newData = passengerTitles?.filter((item: any) =>
      watch('passengerType') === 'Adult'
        ? item.description === 'MR' || item.description === 'MRS'
        : watch('passengerType') === 'Infant'
        ? item.description === 'INF'
        : item.description === 'CHD'
    )
    setTempPType(newData as any)
  }

  const modal = 'editPassengerModal'

  const formCleanHandler = () => {
    reset()
    // @ts-ignore
    window[modal].close()
  }

  const submitHandler = (data: any) => {
    let previousPassengers = passenger as any
    const updatedPassenger = data

    if (data?.passengerType === 'Adult') {
      const oldPassengers = previousPassengers?.adult?.filter(
        (item: any) => item.id !== updatedPassenger?.id
      )

      previousPassengers = {
        ...previousPassengers,
        adult: [...(oldPassengers ?? []), updatedPassenger],
      }
    }
    if (data?.passengerType === 'Child') {
      const oldPassengers = previousPassengers?.child?.filter(
        (item: any) => item.id !== updatedPassenger?.id
      )

      previousPassengers = {
        ...previousPassengers,
        child: [...(oldPassengers ?? []), updatedPassenger],
      }
    }
    if (data?.passengerType === 'Infant') {
      const oldPassengers = previousPassengers?.infant?.filter(
        (item: any) => item.id !== updatedPassenger?.id
      )

      previousPassengers = {
        ...previousPassengers,
        infant: [...(oldPassengers ?? []), updatedPassenger],
      }
    }

    updatePassenger(previousPassengers)
    formCleanHandler()
  }

  const form = [
    <div key={0} className='flex flex-wrap justify-between'>
      <div className='w-full md:w-[48%]'>
        {tempPType?.length > 0 && (
          <DynamicInputSelect
            register={register}
            errors={errors}
            name={`passengerTitle`}
            label='Passenger Title'
            value='description'
            placeholder='Select passenger title'
            data={tempPType}
          />
        )}
      </div>
      <div className='w-full md:w-[48%]'>
        <InputText
          register={register}
          errors={errors}
          label='First Name'
          name={`firstName`}
          placeholder='Enter first name'
        />
      </div>
      <div className='w-full md:w-[48%]'>
        <InputText
          register={register}
          errors={errors}
          label='Second Name'
          name={`secondName`}
          placeholder='Enter second name'
        />
      </div>
      <div className='w-full md:w-[48%]'>
        <InputText
          register={register}
          errors={errors}
          label='Last Name'
          name={`lastName`}
          placeholder='Enter last name'
        />
      </div>

      <div className='w-full md:w-[48%]'>
        <Autocomplete
          register={register}
          className='w-full input border border-gray-300'
          errors={errors}
          label='Country'
          name={`country`}
          // @ts-ignore
          items={countries?.filter((item) =>
            item?.name?.toLowerCase()?.includes(valueC?.toLowerCase()!)
          )}
          item='name'
          hasLabel={true}
          placeholder='Country'
          dropdownValue='countryEdit'
          // value={valueC!}
          onChange={setValueC}
          setValue={setValue}
          customFormat={(item: ICountry) => (
            <div className='flex flex-col justify-start items-start'>
              <div>{item?.name}</div>
              <div>
                <span className='text-xs'>
                  {item?.name} ({item?.isoCode})
                </span>
              </div>
              <hr />
            </div>
          )}
        />
        <div className='hidden'>
          <InputText
            register={register}
            errors={errors}
            name={`countryId`}
            isRequired={false}
            className='hidden'
          />
        </div>
      </div>

      <div className='w-full md:w-[48%]'>
        <StaticInputSelect
          register={register}
          errors={errors}
          label='Sex'
          name={`sex`}
          placeholder='Select sex'
          data={[{ name: 'Male' }, { name: 'Female' }]}
        />
      </div>
      <div className='w-full md:w-[48%]'>
        <InputDate
          register={register}
          errors={errors}
          label='Date of Birth'
          name={`dob`}
          placeholder='Enter date of birth'
          className='min-w-[95%] input rounded-none border border-gray-300 w-full'
        />
      </div>
    </div>,
  ]

  return (
    <div className='max-w-7xl mx-auto'>
      <Steps current={2} />
      {error && <Message variant='error' value={error} />}

      <FormView
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={false}
        isLoadingPost={false}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={`Edit Record`}
        modalSize='max-w-xl'
      />

      <h2 className='font-bold uppercase mb-2'>Trip Summary</h2>
      <div className='flex flex-row flex-wrap justify-between gap-2'>
        <div className='w-full lg:w-[65%]'>
          <div className='flex flex-row flex-wrap justify-between gap-2'>
            {passenger?.adult?.map((item, index: number) => (
              <div
                key={item?.id}
                className='w-full md:w-[48%] bg-white card-body'
              >
                <h4 className='font-bold uppercase'>
                  Adult {index + 1} Details
                </h4>
                <hr />
                <p>
                  {getTitle(item?.passengerTitle)} {item?.firstName}{' '}
                  {item?.secondName} {item?.lastName}
                </p>
                <p>{item?.sex}</p>
                <p>{item?.country}</p>
                <p>{DateTime(item?.dob).format('DD MMM YYYY')}</p>
                <p>Adult</p>
                <p>Random Seat</p>

                <button
                  onClick={() => {
                    editHandler({ ...item, passengerType: 'Adult' })
                    // @ts-ignore
                    window[modal].showModal()
                  }}
                  className='btn btn-outline btn-ghost w-28'
                >
                  Update
                </button>
              </div>
            ))}

            {passenger?.child?.map((item, index: number) => (
              <div
                key={item?.id}
                className='w-full md:w-[48%] bg-white card-body'
              >
                <h4 className='font-bold uppercase'>
                  Child {index + 1} Details
                </h4>
                <hr />
                <p>
                  {getTitle(item?.passengerTitle)} {item?.firstName}{' '}
                  {item?.secondName} {item?.lastName}
                </p>
                <p>{item?.sex}</p>
                <p>{item?.country}</p>
                <p>{DateTime(item?.dob).format('DD MMM YYYY')}</p>
                <p>Child</p>
                <p>Random Seat</p>

                <button
                  onClick={() => {
                    editHandler({ ...item, passengerType: 'Child' })
                    // @ts-ignore
                    window[modal].showModal()
                  }}
                  className='btn btn-outline btn-ghost w-28'
                >
                  Update
                </button>
              </div>
            ))}

            {passenger?.infant?.map((item, index: number) => (
              <div
                key={item?.id}
                className='w-full md:w-[48%] bg-white card-body'
              >
                <h4 className='font-bold uppercase'>
                  Infant {index + 1} Details
                </h4>
                <hr />
                <p>
                  {getTitle(item?.passengerTitle)} {item?.firstName}{' '}
                  {item?.secondName} {item?.lastName}
                </p>
                <p>{item?.sex}</p>
                <p>{item?.country}</p>
                <p>{DateTime(item?.dob).format('DD MMM YYYY')}</p>
                <p>Infant</p>
                <p>Random Seat</p>

                <button
                  onClick={() => {
                    editHandler({ ...item, passengerType: 'Infant' })
                    // @ts-ignore
                    window[modal].showModal()
                  }}
                  className='btn btn-outline btn-ghost w-28'
                >
                  Update
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className='w-full md:w-[48%] lg:w-[34%] bg-white card-body'>
          <div>
            <p>
              To go on trip from
              <strong> {flight?.flight?.fromCityName} </strong>
              to
              <strong> {flight?.flight?.toCityName}</strong>
            </p>
            <hr className='my-4' />

            <div className='w-full bg-gray-100 p-2 mb-5'>
              <strong>From</strong>
              <p>
                {flight?.flight?.fromCityName} ({flight?.flight?.fromCityCode})
              </p>
              <p>{flight?.flight?.fromAirportName}</p>
              <p>
                {DateTime(flight?.flight?.departureDate).format(
                  'DD MMM YYYY hh:mm'
                )}
              </p>
            </div>
            <div className='w-full bg-gray-100 p-2 mb-5'>
              <strong>Duration</strong>
              <p>
                {getHoursBetween(
                  DateTime(flight?.flight?.departureDate).format('hh:mm'),
                  DateTime(flight?.flight?.arrivalDate).format('hh:mm')
                )}
              </p>
            </div>
            <div className='w-full bg-gray-100 p-2 mb-5'>
              <strong>To</strong>
              <p>
                {flight?.flight?.toCityName} ({flight?.flight?.toCityCode})
              </p>
              <p>{flight?.flight?.toAirportName}</p>
              <p>
                {DateTime(flight?.flight?.arrivalDate).format(
                  'DD MMM YYYY hh:mm'
                )}
              </p>
            </div>
          </div>

          <hr className='mb-5' />
          <div className='w-full bg-gray-100 p-2'>
            <strong>Pricing</strong>
            <p>
              {Number(flight?.adult || 0) +
                Number(flight?.child || 0) +
                Number(flight?.infant || 0)}
              x Passenger
            </p>
            <p>
              <span className='font-bold uppercase'>Total </span>
              <span>
                $
                {flight?.prices
                  ?.reduce((acc, cur) => acc + cur?.totalPrice, 0)
                  ?.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className='text-end my-5'>
        <div className='btn-group'>
          {!userInfo?.token && (
            <>
              <Link
                href={`/auth/login?next=/trip-summary`}
                className='btn bg-my-primary text-white'
              >
                Login
              </Link>
              <button className='btn btn-ghost'> OR </button>
            </>
          )}
          <Link href={'/payment'} className='btn bg-my-secondary text-white'>
            Continue {!userInfo?.token && <span>as guest</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}
