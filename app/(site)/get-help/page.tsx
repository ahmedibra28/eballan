'use client'

import React from 'react'
import FormContainer from '@/components/FormContainer'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa6'

const GetHelp = () => {
  return (
    <FormContainer title='Get Help'>
      <div className='space-y-5 md:text-lg text-center'>
        <div className='flex flex-row justify-center items-center gap-2'>
          <FaWhatsapp className='text-green-500' />
          <a href='https://wa.me/+252621598011'>WhatsApp</a>
        </div>

        <div className='flex flex-row justify-center items-center gap-2'>
          <FaEnvelope className='text-my-primary' />
          <a href='mailto:info@eballan.com'>info@eballan.com</a>
        </div>
      </div>
    </FormContainer>
  )
}

export default GetHelp
