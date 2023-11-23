'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { InputEmail, InputTel, InputText } from '@/components/dForms'
import Message from '@/components/Message'
import { useRouter } from 'next/navigation'
import cancelReservation from '@/server/cancel-reservation'

const Cancellation = () => {
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const router = useRouter()
  const [step, setStep] = React.useState(1)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const submitHandler = (data: {
    reservationId?: string
    email?: string
    phone?: string
  }) => {
    if (data.reservationId && data.email && data.phone) {
      startTransition(async () => {
        cancelReservation({
          reservationId: Number(data.reservationId),
          phone: data.phone!,
          email: data.email!,
        })
          .then((data) => {
            setSuccess(data.message)
            reset()
            setStep(4)

            setTimeout(() => {
              setSuccess(null)
              router.push(`/`)
            }, 5000)
          })
          .catch((error) => {
            setError(String(error))
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
      })
    }
  }

  const stepOne = () => {
    return (
      <>
        <h6 className='fw-bold text-uppercase text-center'>Step 1 / 3</h6>
        <hr />

        <InputText
          register={register}
          errors={errors}
          label='Reservation Number'
          name='reservationId'
          placeholder='Enter Reservation Number'
        />

        <button
          type='button'
          className='btn btn-primary form-control mt-3 w-44 mx-auto'
          disabled={isPending}
          onClick={() => {
            setStep(2)
          }}
        >
          {isPending ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Next'
          )}
        </button>
      </>
    )
  }

  const stepTwo = () => {
    return (
      <>
        <h6 className='fw-bold text-uppercase text-center'>Step 2 / 3</h6>
        <hr />

        <InputEmail
          register={register}
          errors={errors}
          label='Email'
          name='email'
          placeholder='Enter email'
        />

        <InputTel
          register={register}
          errors={errors}
          label='Phone'
          name='phone'
          placeholder='Enter phone (with country code)'
        />

        <button
          type='button'
          className='btn btn-primary form-control mt-3 w-44 mx-auto'
          disabled={isPending}
          onClick={() => {
            setStep(3)
          }}
        >
          {isPending ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            'Next'
          )}
        </button>
      </>
    )
  }

  const stepThree = () => {
    return (
      <>
        <h6 className='fw-bold text-uppercase text-center'>Step 3 / 3</h6>
        <hr />
        <h6 className='font-bold mb-2'>Refund Policy</h6>
        <p>1.1 Change booking fee will charge $10 </p>
        <p>1.2 Cancellation fee $10 </p>
        <p>1.3 No show $30 </p>

        <p>
          1.4 Refunding the payment will take 48 hours of working time, and the
          commission of the agent cannot be refunded.
        </p>
        <p>
          1.5 If less than 24 hours before departure, the ticket cannot be
          cancelled or changed
        </p>
        <p>
          <Link href='/privacy-policy?active=refund-policy' className='link'>
            {' '}
            read more...
          </Link>
        </p>

        <button
          type='submit'
          className='btn btn-primary form-control mt-3 w-44 mx-auto'
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className='spinner-border spinner-border-sm' /> Loading...
            </>
          ) : (
            'Confirm'
          )}
        </button>
      </>
    )
  }

  const stepFour = () => {
    return (
      <>
        <h1 className='text-center'>Successfully Canceled</h1>

        <Link
          href={'/'}
          type='button'
          className='btn btn-primary form-control mt-3 w-44 mx-auto'
        >
          Go To Home
        </Link>
      </>
    )
  }

  return (
    <div className='w-full md:w-1/2 lg:w-[40%] mx-auto bg-white card-body'>
      {error && <Message variant='error' value={error} />}
      {success && <Message variant='success' value={success} />}

      <h3 className='font-bold font-monospace text-center mb-5 text-my-primary'>
        Reservation Cancellation
      </h3>

      <hr />

      <form onSubmit={handleSubmit(submitHandler)}>
        {step === 1 && stepOne()}
        {step === 2 && stepTwo()}
        {step === 3 && stepThree()}
        {step === 4 && stepFour()}
      </form>
    </div>
  )
}

export default Cancellation
