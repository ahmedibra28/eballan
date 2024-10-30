'use client'

import React, { useEffect, useTransition } from 'react'
import {
  FaCircleCheck,
  FaMagnifyingGlassArrowRight,
  FaMinus,
  FaPlus,
  FaRotate,
  FaUsers,
} from 'react-icons/fa6'
import { CustomSubmitButton, InputDate } from '../dForms'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import city from '@/server/city'
import { ICity, ISearchFlight } from '@/types'
import Message from '../Message'
import flight from '@/server/flight'
import useFlightsStore from '@/zustand/useFlightsStore'
import ComboboxCity from '../ComboboxCity'

export default function SearchForm({ source }: { source?: string }) {
  const [adult, setAdult] = React.useState(1)
  const [child, setChild] = React.useState(0)
  const [infant, setInfant] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [cities, setCities] = React.useState<ICity[]>([])
  const [first, setFirst] = React.useState(true)

  const [fromSelected, setFromSelected] = React.useState<ICity | null>(null)
  const [toSelected, setToSelected] = React.useState<ICity | null>(null)

  const [fromError, setFromError] = React.useState<string | null>(null)
  const [toError, setToError] = React.useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const { updateFlights } = useFlightsStore((state) => state)
  const getCities = async () => {
    city()?.then((data: any) => {
      if (data?.error) {
        setError(String(data?.error))
        setTimeout(() => {
          setError(null)
        }, 5000)
        return null
      }

      setCities(data)
    })
  }

  const searchFlights = async (args: ISearchFlight) => {
    flight(args)?.then((data: any) => {
      if (data?.error) {
        setError(String(data?.error))
        setTimeout(() => {
          setError(null)
        }, 5000)
        return null
      }
      updateFlights(data)
    })
  }

  useEffect(() => {
    getCities()
  }, [])

  useEffect(() => {
    setFromError(null)
  }, [fromSelected])
  useEffect(() => {
    setToError(null)
  }, [toSelected])

  React.useEffect(() => {
    const milliseconds = 40 * 60 * 1000 // 40 minutes

    const interval = setInterval(() => {
      if (source !== 'home') {
        router.replace('/')
      }
    }, milliseconds)

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const fromId = parseInt(searchParams.get('fromId') || '0')
    const toId = parseInt(searchParams.get('toId') || '0')
    const date = searchParams.get('date') || ''
    const adult = parseInt(searchParams.get('adult') || '1')
    const child = parseInt(searchParams.get('child') || '0')
    const infant = parseInt(searchParams.get('infant') || '0')

    // setValue('date', date || DateTime().format('YYYY-MM-DD'))
    setValue('date', date)
    setAdult(adult)
    setChild(child)
    setInfant(infant)

    setFromSelected(cities?.find((x) => x.id === fromId) || null)
    setToSelected(cities?.find((x) => x.id === toId) || null)

    if (source !== 'home' && !isPending) {
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
  }, [cities])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({})

  React.useEffect(() => {
    if (
      source !== 'home' &&
      (adult || child || infant) &&
      !first &&
      !isPending
    ) {
      console.log({
        fromId: Number(fromSelected?.id),
        toId: Number(toSelected?.id),
        date: watch('date'),
        adult,
        child,
        infant,
      })
      startTransition(() => {
        searchFlights({
          fromId: Number(fromSelected?.id),
          toId: Number(toSelected?.id),
          date: watch('date'),
          adult,
          child,
          infant,
        })
      })
    }
    setFirst(false)
    // eslint-disable-next-line
  }, [adult, child, infant])

  const submitHandler = (data: any) => {
    if (
      fromSelected?.id &&
      toSelected?.id &&
      data?.date &&
      (adult || child || infant)
    ) {
      const params = {
        fromId: Number(fromSelected?.id),
        toId: Number(toSelected?.id),
        date: data?.date,
        adult,
        child,
        infant,
      }
      if (source === 'home') {
        // @ts-ignore
        return router.push(`/search?${new URLSearchParams(params).toString()}`)
      } else {
        // @ts-ignore
        router.push(`/search?${new URLSearchParams(params).toString()}`)
        startTransition(() => {
          searchFlights({
            fromId: Number(fromSelected?.id),
            toId: Number(toSelected?.id),
            date: data?.date,
            adult,
            child,
            infant,
          })
        })
      }
    }
  }

  const swap = () => {
    setFromSelected(toSelected)
    setToSelected(fromSelected)
  }

  const menu = (
    <ul className='menus dropdown-content z-[1] bg-base-200 w-52 md:w-64 rounded-box text-xs md:text-sm'>
      <li className='flex items-center justify-between p-2'>
        <span> Adults (Over 11)</span>
        <div className='flex flex-row items-center justify-between'>
          <button
            type='button'
            onClick={() => setAdult(adult > 0 ? adult - 1 : 0)}
            className='flex items-center justify-center w-6 h-6 p-2 bg-red-500 rounded-full'
          >
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>{adult}</span>
          <button
            type='button'
            onClick={() => setAdult(adult + 1)}
            className='flex items-center justify-center w-6 h-6 p-2 bg-green-500 rounded-full'
          >
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
      <li className='flex items-center justify-between p-2'>
        <span> Children (2 - 11)</span>
        <div className='flex flex-row items-center justify-between'>
          <button
            type='button'
            onClick={() => setChild(child > 0 ? child - 1 : 0)}
            className='flex items-center justify-center w-6 h-6 p-2 bg-red-500 rounded-full'
          >
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>{child}</span>
          <button
            type='button'
            onClick={() => setChild(child + 1)}
            className='flex items-center justify-center w-6 h-6 p-2 bg-green-500 rounded-full'
          >
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
      <li className='flex items-center justify-between p-2'>
        <span> Infants (Under 2)</span>
        <div className='flex flex-row items-center justify-between'>
          <button
            type='button'
            onClick={() => setInfant(infant > 0 ? infant - 1 : 0)}
            className='flex items-center justify-center w-6 h-6 p-2 bg-red-500 rounded-full'
          >
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>{infant}</span>
          <button
            type='button'
            onClick={() => setInfant(infant + 1)}
            className='flex items-center justify-center w-6 h-6 p-2 bg-green-500 rounded-full'
          >
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
    </ul>
  )

  return (
    <div
      className={`${
        source === 'home' ? 'bg-white/70' : ''
      } min-h-60 w-full md:p-8 pt-2 max-w-7xl rounded-xl ${
        source !== 'home' ? '' : ''
      }`}
    >
      {error && <Message variant='error' value={error} />}
      <div className='p-2 mx-auto'>
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
            <ComboboxCity
              cities={cities}
              selected={fromSelected!}
              setSelected={setFromSelected}
              fromError={fromError}
              placeholder='From'
              name='from'
            />
          </div>

          <div className='w-auto mx-auto'>
            <button
              onClick={swap}
              type='button'
              className='w-16 h-16 mx-auto mt-auto bg-white btn text-my-primary'
            >
              <FaRotate />
            </button>
          </div>

          <div className='w-[40%] md:w-full mx-auto'>
            <ComboboxCity
              cities={cities}
              selected={toSelected!}
              setSelected={setToSelected}
              toError={toError}
              placeholder='To'
              name='to'
            />
          </div>

          <div className='w-[71%] md:w-full mr-auto'>
            <InputDate
              register={register}
              errors={errors}
              label='Date'
              hasLabel={false}
              name='date'
              placeholder='Enter date'
              className='bg-white p-3 h-16 input min-w-[80%] md:w-full rounded-xl outline-none'
              value={watch().date}
            />
          </div>

          <div className='w-[25%] ml-auto'>
            <details className='z-0 mx-auto dropdown dropdown-end w-22'>
              <summary
                style={{
                  borderRadius: '0.65rem',
                }}
                className='w-full h-16 text-white border btn btn-lg bg-my-primary border-my-primary hover:bg-my-primary md:w-auto md:m-auto'
              >
                <div className='flex flex-row gap-x-4'>
                  <span> {adult + child + infant}</span> <FaUsers />
                </div>
              </summary>
              {menu}
            </details>
          </div>

          <div className='w-full mx-auto'>
            <CustomSubmitButton
              isLoading={isPending || false}
              label='Search'
              type='submit'
              onClick={() => {
                if (!fromSelected?.id) {
                  setFromError('From is required')
                }
                if (!toSelected?.id) {
                  setToError('To is required')
                }
              }}
              classStyle='btn btn-primary opacity-1 rounded-none w-full h-16 rounded-xl'
              // @ts-ignore
              iconLeft={<FaMagnifyingGlassArrowRight className='text-lg' />}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
