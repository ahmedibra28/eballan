import React from 'react'
import { FormContainer } from '../components'
import Link from 'next/link'

const Success = () => {
  return (
    <FormContainer>
      <h3 className="fw-bold text-success font-monospace text-center">
        Success
      </h3>
      <p className="text-center">
        You have successfully booked your reservation. Please check your email
        and download your ticket from there.
      </p>

      <div className="text-center">
        <Link href="/" className="btn btn-outline-primary">
          Home
        </Link>
      </div>
    </FormContainer>
  )
}

export default Success
