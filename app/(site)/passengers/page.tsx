'use client'

import Message from '@/components/Message'
import {
  DynamicInputSelect,
  InputDate,
  InputEmail,
  InputText,
  StaticInputSelect,
} from '@/components/dForms'
import Steps from '@/components/ui/Steps'
import country from '@/server/country'
import passengerTitle from '@/server/passengerTitle'
import { ICountry, IPassenger, IPassengerTitle } from '@/types'
import useFlightStore from '@/zustand/useFlightStore'
import React, { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowRight } from 'react-icons/fa6'
import { v4 as uuidv4 } from 'uuid'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import useNumberToArray from '@/hooks/useNumberToArray'
import usePassengerStore from '@/zustand/usePassengerStore'
import { useRouter } from 'next/navigation'
import ComboboxCountry from '@/components/ComboboxCountry'

export default function Page() {
  const router = useRouter()

  const [error, setError] = React.useState<string | null>(null)
  const [passengerTitles, setPassengerTitles] = React.useState<
    IPassengerTitle[]
  >([])

  const [countries, setCountries] = React.useState<ICountry[]>([])
  const [phoneNumber, setPhoneNumber] = React.useState('')

  const { flight } = useFlightStore((state) => state)
  const { updatePassenger } = usePassengerStore((state) => state)

  React.useEffect(() => {
    if (!flight) return router.back()
    // eslint-disable-next-line
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({})

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

  const submitHandler = (data: any) => {
    if (!phoneNumber || phoneNumber?.length < 12) {
      setError('Please enter a valid phone number')
      setTimeout(() => {
        setError(null)
      }, 5000)
      return null
    }
    data.phone = phoneNumber
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

    const newData = reformatData(types) as any

    const result = {
      ...newData[0],
      contact: { email: data.email, phone: phoneNumber },
    } as IPassenger

    updatePassenger(result)

    router.push('/trip-summary')
  }

  const passengerForm = (passengerType: string, number: number) => {
    return (
      <div className='flex flex-row flex-wrap gap-2 bg-gray-200 p-3 mb-3'>
        <div className='w-full'>
          <h6 className='font-bold uppercase'>
            {passengerType} {number} - Info
          </h6>
        </div>
        <div className='w-full md:w-[48%] lg:w-[32%]'>
          <DynamicInputSelect
            register={register}
            errors={errors}
            name={`passengerTitle${passengerType}${number}`}
            label='Passenger Title'
            value='description'
            placeholder='Select passenger title'
            data={passengerTitles?.filter((item: any) =>
              passengerType === 'Adult'
                ? item.description === 'MR' || item.description === 'MRS'
                : passengerType === 'Infant'
                ? item.description === 'INF'
                : item.description === 'CHD'
            )}
          />
        </div>
        <div className='w-full md:w-[48%] lg:w-[32%]'>
          <InputText
            register={register}
            errors={errors}
            label='First Name'
            name={`firstName${passengerType}${number}`}
            placeholder='Enter first name'
          />
        </div>
        <div className='w-full md:w-[48%] lg:w-[32%]'>
          <InputText
            register={register}
            errors={errors}
            label='Second Name'
            name={`secondName${passengerType}${number}`}
            placeholder='Enter second name'
          />
        </div>
        <div className='w-full md:w-[48%] lg:w-[32%]'>
          <InputText
            register={register}
            errors={errors}
            label='Last Name'
            name={`lastName${passengerType}${number}`}
            placeholder='Enter last name'
          />
        </div>

        <div className='w-full md:w-[48%] lg:w-[32%]'>
          <ComboboxCountry
            countries={countries}
            placeholder='Country'
            register={register}
            errors={errors}
            label='Country'
            name={`country${passengerType}${number}`}
          />
        </div>

        <div className='w-[48%] md:w-[24%] lg:w-[15%]'>
          <StaticInputSelect
            register={register}
            errors={errors}
            label='Sex'
            name={`sex${passengerType}${number}`}
            placeholder='Select sex'
            data={[{ name: 'Male' }, { name: 'Female' }]}
          />
        </div>
        <div className='w-[48%] md:w-[24%] lg:w-[16%]'>
          <InputDate
            register={register}
            errors={errors}
            label='Date of Birth'
            name={`dob${passengerType}${number}`}
            placeholder='Enter date of birth'
            className='min-w-[95%] input rounded-none border border-gray-300 w-full'
          />
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto'>
      {error && <Message variant='error' value={error} />}
      <Steps current={1} />
      <form onSubmit={handleSubmit(submitHandler)}>
        {useNumberToArray(flight?.adult || 0).map((item, i: number) => (
          <Fragment key={i}>{passengerForm('Adult', item)}</Fragment>
        ))}

        {/* @ts-ignore */}
        {useNumberToArray(flight?.child).map((item, i: number) => (
          <Fragment key={i}>{passengerForm('Child', item)}</Fragment>
        ))}

        {/*  @ts-ignore */}
        {useNumberToArray(flight?.infant).map((item, i: number) => (
          <Fragment key={i}>{passengerForm('Infant', item)}</Fragment>
        ))}

        <div className='flex flex-row flex-wrap mt-4 bg-gray-200 px-3 py-5 gap-2'>
          <div className='w-full'>
            <h6 className='font-bold uppercase'>Contact Details</h6>
          </div>
          <div className='flex flex-row justify-between items-start w-full gap-x-2'>
            <div
              className='w-full md:w-[48%] lg:w-[48%] mt-2'
              style={{ zIndex: -0 }}
            >
              <label htmlFor='phone'>Phone</label>
              <div className='mt-2'>
                <PhoneInput
                  country={'so'}
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  inputStyle={{ width: '100%', height: '48px' }}
                />
              </div>
            </div>
            <div className='w-full md:w-[48%] lg:w-[48%]'>
              <InputEmail
                register={register}
                errors={errors}
                label='Email'
                name='email'
                placeholder='Enter email'
              />
            </div>
          </div>
        </div>

        <div className='p-3 mt-4 text-end'>
          <button
            type='submit'
            className='btn btn-warning rounded-pill text-light float-end ml-auto'
          >
            Continue <FaArrowRight className='mb-1' />
          </button>
        </div>
      </form>
    </div>
  )
}
