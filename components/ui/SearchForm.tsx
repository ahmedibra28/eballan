'use client'

import React from 'react'
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
import { Autocomplete, CustomSubmitButton, InputDate } from '../dForms'
import { useForm } from 'react-hook-form'

export default function SearchForm() {
  const [valueF, setValueF] = React.useState('')
  const [valueT, setValueT] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({})

  const data = [
    { id: '96', name: 'Leona Chandler' },
    { id: '97', name: 'Flora Beck' },
    { id: '92', name: 'Theresa Dawson' },
    { id: '90', name: 'Harriet Webster' },
    { id: '83', name: 'Jeff Carr' },
    { id: '61', name: 'Ernest Joseph' },
    { id: '75', name: 'Margaret Bryan' },
    { id: '80', name: 'Susan Robinson' },
    { id: '46', name: 'Louis Estrada' },
    { id: '33', name: 'Todd Reyes' },
  ]

  const menu = (
    <ul className='menus dropdown-content z-[1] bg-base-200 w-full md:w-64 rounded-box text-sm'>
      <li className='flex justify-between items-center p-2'>
        <span> Adults (Over 11)</span>
        <div className='flex flex-row justify-between items-center'>
          <button className='w-6 h-6 rounded-full bg-red-500 p-2 flex items-center justify-center'>
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>5</span>
          <button className='w-6 h-6 rounded-full bg-green-500 p-2 flex items-center justify-center'>
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
      <li className='flex justify-between items-center p-2'>
        <span> Children (2 - 11)</span>
        <div className='flex flex-row justify-between items-center'>
          <button className='w-6 h-6 rounded-full bg-red-500 p-2 flex items-center justify-center'>
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>5</span>
          <button className='w-6 h-6 rounded-full bg-green-500 p-2 flex items-center justify-center'>
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
      <li className='flex justify-between items-center p-2'>
        <span> Infants (Under 2)</span>
        <div className='flex flex-row justify-between items-center'>
          <button className='w-6 h-6 rounded-full bg-red-500 p-2 flex items-center justify-center'>
            <FaMinus className='text-white' />
          </button>
          <span className='mx-2'>5</span>
          <button className='w-6 h-6 rounded-full bg-green-500 p-2 flex items-center justify-center'>
            <FaPlus className='text-white' />
          </button>
        </div>
      </li>
    </ul>
  )

  return (
    <div className='bg-white/70 min-h-60 w-full p-2s md:p-8 max-w-7xl rounded-xl'>
      <div className='mx-auto text-center'>
        <div className='md:btn-group mx-auto'>
          <button
            disabled
            className='btn bg-my-primary hover:bg-my-primary text-white  px-5 md:px-10 w-[50%] md:w-auto'
          >
            ONE WAY <FaCircleCheck />
          </button>
          <button
            disabled
            className='btn bg-my-primary hover:bg-my-primary text-white  px-5 md:px-10 w-[50%] md:w-auto'
          >
            ECONOMIC <FaCircleCheck />
          </button>

          <details className='dropdown m-auto md:ml-5 w-full mx-auto'>
            <summary
              style={{
                borderRadius: '0.65rem',
              }}
              className='btn bg-my-primary border border-my-primary hover:bg-my-primary text-white px-10 w-full md:w-auto mt-3 md:m-auto'
            >
              5 <FaUsers />
            </summary>
            {menu}
          </details>
        </div>
      </div>

      <div className='flex flex-row flex-wrap md:flex-nowrap justify-between my-10  gap-x-1 md:gap-x-2'>
        <div className='w-[38%] md:w-[40%] lg:w-[25%] mx-auto'>
          <Autocomplete
            register={register}
            className='border-none h-16 rounded-xl'
            errors={errors}
            // label='From'
            name='from'
            iconLeft={<FaPlaneDeparture className='text-my-primary text-lg' />}
            items={data}
            item='name'
            placeholder='From'
            dropdownValue='product-sale'
            value={valueF}
            onChange={setValueF}
            setValue={setValue}
            customFormat={(item: any) => (
              <div className='flex flex-col justify-start items-start'>
                <div>{item?.name}</div>

                <div>
                  <span className='text-xs'> $2.55</span>
                </div>

                <hr />
              </div>
            )}
          />
        </div>

        <button className='btn bg-white h-16 w-16 text-my-primary mt-auto mx-auto rounded-full'>
          <FaRotate />
        </button>

        <div className='w-[38%] md:w-[40%] lg:w-[25%] mx-auto'>
          <Autocomplete
            register={register}
            className='border-none h-16 rounded-xl'
            errors={errors}
            // label='To'
            name='to'
            iconLeft={<FaPlaneArrival className='text-my-primary text-lg' />}
            items={data}
            item='name'
            placeholder='To'
            dropdownValue='product-sale'
            value={valueT}
            onChange={setValueT}
            setValue={setValue}
            customFormat={(item: any) => (
              <div className='flex flex-col justify-start items-start'>
                <div>{item?.name}</div>

                <div>
                  <span className='text-xs'> $2.55</span>
                </div>

                <hr />
              </div>
            )}
          />
        </div>

        <div className='w-[58%] md:w-[28%] lg:w-[25%] mx-auto'>
          <InputDate
            register={register}
            errors={errors}
            // label='Date'
            name='date'
            placeholder='Enter date'
            className='w-full p-[11px] outline-none h-16 rounded-xl'
          />
        </div>

        <div className='w-[39%] md:w-[28%] lg:w-[20%] mt-auto mx-auto'>
          <CustomSubmitButton
            isLoading={false}
            label='Search'
            type='submit'
            classStyle='btn btn-primary opacity-1 rounded-none w-full h-16 rounded-xl'
            // @ts-ignore
            iconLeft={<FaMagnifyingGlassArrowRight className='text-lg' />}
          />
        </div>
      </div>
    </div>
  )
}
