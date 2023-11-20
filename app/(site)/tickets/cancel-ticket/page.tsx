'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import useApi from '@/hooks/useApi'
import Link from 'next/link'
import { InputEmail, InputTel, InputText } from '@/components/dForms'
import Message from '@/components/Message'
import { useRouter } from 'next/navigation'

const Cancellation = () => {
  const router = useRouter()
  const [step, setStep] = React.useState(1)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const postApi = useApi({
    key: ['reservation'],
    method: 'POST',
    url: `reservations/cancellation`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      reset()
      setStep(4)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  const submitHandler = (data: { reservationId?: string }) => {
    postApi?.mutateAsync(data)
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
          className='btn btn-primary form-control mt-3'
          disabled={postApi?.isPending}
          onClick={() => {
            setStep(2)
          }}
        >
          {postApi?.isPending ? (
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
          placeholder='Enter phone'
        />

        <button
          type='button'
          className='btn btn-primary form-control mt-3'
          disabled={postApi?.isPending}
          onClick={() => {
            setStep(3)
          }}
        >
          {postApi?.isPending ? (
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
        <h6 className='fw-bold'>Refund Policy</h6>
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
          <Link href='/privacy-policy?active=refund-policy'> read more...</Link>
        </p>

        <button
          type='submit'
          className='btn btn-primary form-control mt-3'
          disabled={postApi?.isPending}
        >
          {postApi?.isPending ? (
            <span className='spinner-border spinner-border-sm' />
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
        <h1>Success</h1>

        <Link
          href={'/'}
          type='button'
          className='btn btn-primary form-control mt-3'
        >
          Go To Home
        </Link>
      </>
    )
  }

  return (
    <div className='w-full md:w-1/2 lg:w-1/3 mx-auto'>
      <div className='col-lg-6 col-md-10 col-12 mx-auto'>
        <Head>
          <title>Reservation Cancellation</title>
          <meta
            property='og:title'
            content='Reservation Cancellation'
            key='title'
          />
        </Head>
        <h3 className='fw-light font-monospace text-center mb-5'>
          Reservation Cancellation
        </h3>
        {postApi?.isSuccess && (
          <Message
            variant='success'
            value='Reservation Cancellation Successful.'
          />
        )}
        {postApi?.isError && <Message variant='error' value={postApi?.error} />}

        <hr />

        <form onSubmit={handleSubmit(submitHandler)}>
          {step === 1 && stepOne()}
          {step === 2 && stepTwo()}
          {step === 3 && stepThree()}
          {step === 4 && stepFour()}
        </form>
      </div>
    </div>
  )
}

export default Cancellation
