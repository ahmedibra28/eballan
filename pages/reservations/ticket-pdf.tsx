import React from 'react'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import apiHook from '../../api'
import { DynamicFormProps, inputText } from '../../utils/dForms'

const TicketPDF = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['reservation-guest-pdf'],
    method: 'POST',
    url: `reservations/guest-pdf`,
  })?.post

  const submitHandler = (data: { q?: string }) => {
    postApi?.mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Get Your Reservation Ticket</title>
        <meta
          property="og:title"
          content="Get Your Reservation Ticket"
          key="title"
        />
      </Head>
      <h3 className="fw-light font-monospace text-center mb-5">
        Get Your Reservation Ticket
      </h3>
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value={`Reservation pdf has been generated and sent your email successfully.`}
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        {inputText({
          register,
          errors,
          label: 'Mobile Number / Email',
          name: 'q',
          placeholder: 'Enter Mobile Number / Email',
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

export default TicketPDF
