import React, { useEffect } from 'react'
import { FormContainer, Message } from '../../components'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import apiHook from '../../api'
import { DynamicFormProps, inputText } from '../../utils/dForms'

const Cancellation = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['reservation'],
    method: 'POST',
    url: `reservations/cancellation`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      reset()
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  const submitHandler = (data: { reservationId?: string }) => {
    postApi?.mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Reservation Cancellation</title>
        <meta
          property="og:title"
          content="Reservation Cancellation"
          key="title"
        />
      </Head>
      <h3 className="fw-light font-monospace text-center mb-5">
        Reservation Cancellation
      </h3>
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value="Reservation Cancellation Successful."
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputText({
          register,
          errors,
          label: 'Reservation Number',
          name: 'reservationId',
          placeholder: 'Enter Reservation Number',
        } as DynamicFormProps)}

        <button
          type="submit"
          className="btn btn-primary form-control mt-3"
          disabled={postApi?.isLoading}
        >
          {postApi?.isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Confirm'
          )}
        </button>
      </form>
    </FormContainer>
  )
}

export default Cancellation
