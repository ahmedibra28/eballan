'use client'

import React, { useEffect, useTransition } from 'react'
import {
  FaCircleCheck,
  FaMagnifyingGlassArrowRight,
  FaMinus,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaPlus,
  FaRotate,
  FaUsers,
} from 'react-icons/fa6'
import {
  Autocomplete,
  CustomSubmitButton,
  InputDate,
  InputText,
} from '../dForms'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import city from '@/server/city'
import { ICity, ISearchFlight } from '@/types'
import Message from '../Message'
import flight from '@/server/flight'
import useFlightsStore from '@/zustand/useFlightsStore'

export default function SearchForm({ source }: { source?: string }) {
  const [valueF, setValueF] = React.useState<string | null>('')
  const [valueT, setValueT] = React.useState<string | null>('')
  const [adult, setAdult] = React.useState(1)
  const [child, setChild] = React.useState(0)
  const [infant, setInfant] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [cities, setCities] = React.useState<ICity[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const { updateFlights } = useFlightsStore((state) => state)
  const getCities = async () => {
    try {
      const data = await city()
      setCities(data)
    } catch (error) {
      setError(String(error))
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const searchFlights = async (args: ISearchFlight) => {
    try {
      const data = await flight(args)
      updateFlights(data)
    } catch (error) {
      setError(String(error))
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  useEffect(() => {
    getCities()
  }, [])

  useEffect(() => {
    const from = searchParams.get('from') || ''
    const to = searchParams.get('to') || ''
    const fromId = parseInt(searchParams.get('fromId') || '0')
    const toId = parseInt(searchParams.get('toId') || '0')
    const date = searchParams.get('date') || ''
    const adult = parseInt(searchParams.get('adult') || '1')
    const child = parseInt(searchParams.get('child') || '0')
    const infant = parseInt(searchParams.get('infant') || '0')

    setValueF(from)
    setValueT(to)
    setValue('from', from)
    setValue('to', to)
    setValue('fromId', fromId)
    setValue('toId', toId)
    setValue('date', date)
    setAdult(adult)
    setChild(child)
    setInfant(infant)

    if (source !== 'home') {
      startTransition(() => {
        searchFlights({
          date,
          adult,
          child,
          infant,
          fromId,
          toId,
        })
      })
    }
    // eslint-disable-next-line
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({})

  const submitHandler = (data: any) => {
    const params = {
      ...data,
      adult,
      child,
      infant,
    }
    if (source === 'home') {
      return router.push(`/search?${new URLSearchParams(params).toString()}`)
    } else {
      router.push(`/search?${new URLSearchParams(params).toString()}`)
      startTransition(() => {
        searchFlights({
          ...data,
          adult,
          child,
          infant,
        })
      })
    }
  }

  const swap = () => {
    const from = watch('from')
    const to = watch('to')
    const fromId = watch('fromId')
    const toId = watch('toId')

    setValue('from', to)
    setValue('to', from)
    setValue('fromId', toId)
    setValue('toId', fromId)
    setValueF(to)
    setValueT(from)
  }

  const menu = (
    <ul className='menus dropdown-content z-[1] bg-base-200 w-full md:w-64 rounded-box text-sm'>
      <li className='flex justify-between items-center p-2'>
        <span> Adults (Over 11)</span>
        <div className='flex flex-row justify-between items-center'>
          <button
            onClick={() => setAdult(adult > 0 ? adult - 1 : 0)}
            className='w-6 h-6 rounded-full bg-red-500 p-2 flex items-center justify-center'
          >
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>{adult}</span>
          <button
            onClick={() => setAdult(adult + 1)}
            className='w-6 h-6 rounded-full bg-green-500 p-2 flex items-center justify-center'
          >
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
      <li className='flex justify-between items-center p-2'>
        <span> Children (2 - 11)</span>
        <div className='flex flex-row justify-between items-center'>
          <button
            onClick={() => setChild(child > 0 ? child - 1 : 0)}
            className='w-6 h-6 rounded-full bg-red-500 p-2 flex items-center justify-center'
          >
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>{child}</span>
          <button
            onClick={() => setChild(child + 1)}
            className='w-6 h-6 rounded-full bg-green-500 p-2 flex items-center justify-center'
          >
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
      <li className='flex justify-between items-center p-2'>
        <span> Infants (Under 2)</span>
        <div className='flex flex-row justify-between items-center'>
          <button
            onClick={() => setInfant(infant > 0 ? infant - 1 : 0)}
            className='w-6 h-6 rounded-full bg-red-500 p-2 flex items-center justify-center'
          >
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>{infant}</span>
          <button
            onClick={() => setInfant(infant + 1)}
            className='w-6 h-6 rounded-full bg-green-500 p-2 flex items-center justify-center'
          >
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
    </ul>
  )

  return (
    <div className='bg-white/70 min-h-60 w-full md:p-8 pt-2 max-w-7xl rounded-xl'>
      {error && <Message variant='error' value={error} />}
      <div className='mx-auto p-2'>
        <div className='flex flex-row justify-between md:justify-start gap-x-2'>
          <button
            disabled
            className='btn bg-my-primary hover:bg-my-primary text-white  px-5 md:px-10 w-[48%] md:w-auto'
          >
            ONE WAY <FaCircleCheck />
          </button>
          <button
            disabled
            className='btn bg-my-primary hover:bg-my-primary text-white  px-5 md:px-10 w-[48%] md:w-auto'
          >
            ECONOMIC <FaCircleCheck />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className='p-2'>
        <div className='flex flex-row flex-wrap md:flex-nowrap justify-between py-5 gap-x-0.5 gap-y-5 md:gap-x-2'>
          <div className='w-[40%] md:w-full mx-auto'>
            <Autocomplete
              register={register}
              className='border-none h-16 rounded-xl'
              errors={errors}
              label='From'
              name='from'
              iconLeft={
                <FaPlaneDeparture className='text-my-primary text-lg' />
              }
              // @ts-ignore
              items={cities?.filter((item) =>
                item?.name?.toLowerCase()?.includes(valueF?.toLowerCase()!)
              )}
              item='name'
              hasLabel={false}
              placeholder='From'
              dropdownValue='departure-date'
              value={valueF!}
              onChange={setValueF}
              setValue={setValue}
              customFormat={(item: ICity) => (
                <div className='flex flex-col justify-start items-start'>
                  <div>{item?.name}</div>
                  <div>
                    <span className='text-xs'>
                      {item?.countryName} ({item?.code})
                    </span>
                  </div>
                  <hr />
                </div>
              )}
            />
          </div>

          <div className='w-auto mx-auto'>
            <button
              onClick={swap}
              type='button'
              className='btn bg-white h-16 w-16 text-my-primary mt-auto mx-auto'
            >
              <FaRotate />
            </button>
          </div>

          <div className='w-[40%] md:w-full mx-auto'>
            <Autocomplete
              register={register}
              className='border-none h-16 rounded-xl'
              errors={errors}
              label='To'
              hasLabel={false}
              name='to'
              iconLeft={<FaPlaneArrival className='text-my-primary text-lg' />}
              // @ts-ignore
              items={cities?.filter((item) =>
                item?.name?.toLowerCase()?.includes(valueT?.toLowerCase()!)
              )}
              item='name'
              placeholder='To'
              dropdownValue='arrival-date'
              value={valueT!}
              onChange={setValueT}
              setValue={setValue}
              customFormat={(item: any) => (
                <div className='flex flex-col justify-start items-start'>
                  <div>{item?.name}</div>
                  <div>
                    <span className='text-xs'>
                      {item?.countryName} ({item?.code})
                    </span>
                  </div>
                  <hr />
                </div>
              )}
            />
          </div>

          <div className='w-[72%] md:w-full mx-auto'>
            <InputDate
              register={register}
              errors={errors}
              label='Date'
              hasLabel={false}
              name='date'
              placeholder='Enter date'
              className='w-full p-[11px] outline-none h-16 rounded-xl'
            />
          </div>

          <div className='w-auto mx-auto'>
            <details className='dropdown w-22 mx-auto'>
              <summary
                style={{
                  borderRadius: '0.65rem',
                }}
                className='btn btn-lg bg-my-primary border border-my-primary hover:bg-my-primary text-white w-full md:w-auto md:m-auto'
              >
                <div className='flex flex-row gap-x-4'>
                  <span> {adult + child + infant}</span> <FaUsers />
                </div>
              </summary>
              {menu}
            </details>
          </div>

          <div className='w-full mt-auto mx-auto'>
            <CustomSubmitButton
              isLoading={isPending || false}
              label='Search'
              type='submit'
              classStyle='btn btn-primary opacity-1 rounded-none w-full h-16 rounded-xl'
              // @ts-ignore
              iconLeft={<FaMagnifyingGlassArrowRight className='text-lg' />}
            />
          </div>
        </div>

        {/* Hidden inputs */}
        <div className='w-full mx-auto hidden'>
          <InputText
            register={register}
            errors={errors}
            name='fromId'
            isRequired={false}
            className='hidden'
          />
        </div>
        <div className='w-full mx-auto hidden'>
          <InputText
            register={register}
            errors={errors}
            name='toId'
            isRequired={false}
            className='hidden'
          />
        </div>
      </form>
    </div>
  )
}
