'use client'

import Message from '@/components/Message'
import Steps from '@/components/ui/Steps'
import book from '@/server/book'
import useFlightStore from '@/zustand/useFlightStore'
import usePassengerStore from '@/zustand/usePassengerStore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { FaPhone } from 'react-icons/fa6'
import useUserInfoStore from '@/zustand/userStore'

export default function Page() {
  const router = useRouter()

  const [phone, setPhone] = React.useState('')
  const [paymentMethod, setPaymentMethod] = React.useState('Hormuud')
  const [dealerCode, setDealerCode] = React.useState<string | null>(null)
  const [paymentLink, setPaymentLink] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const { userInfo } = useUserInfoStore((state) => state)

  const { flight } = useFlightStore((state) => state)
  const { passenger } = usePassengerStore((state) => state)

  const [isPending, startTransition] = useTransition()

  React.useEffect(() => {
    const milliseconds = 40 * 60 * 1000 // 40 minutes

    const interval = setInterval(() => {
      router.replace('/')
    }, milliseconds)

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (!passenger || !flight) return router.back()
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (paymentMethod) {
      setPhone('')
    }
  }, [paymentMethod])

  const payments = [
    { name: 'Hormuud', image: '/payments/hormuud.png', disabled: false },
    { name: 'Somtel', image: '/payments/somtel.png', disabled: false },
    { name: 'Somnet', image: '/payments/somnet.png', disabled: false },
    { name: 'Mastercard', image: '/payments/mastercard.png', disabled: true },
  ]

  const handleBook = () => {
    startTransition(async () => {
      book({
        passenger: passenger!,
        flight: flight!,
        payment: { phone, paymentMethod },
        createdById: userInfo?.id,
        dealerCode: dealerCode || '',
        ...(paymentLink && paymentMethod?.toLowerCase() === 'somtel'
          ? {
              status: 'verify',
              link: paymentLink,
            }
          : {
              status: 'invoice',
              link: paymentLink,
            }),
      }).then((data) => {
        if (data?.error) {
          setError(String(data?.error))
          setTimeout(() => {
            setError(null)
          }, 5000)
          return null
        }

        if (data?.link) {
          window.open(data?.link, '_blank')
          setPaymentLink(data?.link)
        } else if (!data?.link) {
          setPaymentLink('')
          return router.push(
            `/success?reservationId=${data.reservationId}&pnrNumber=${data.pnrNumber}`
          )
        }
      })
    })
  }
  return (
    <div className='mx-auto max-w-7xl'>
      <Steps current={3} />
      {error && <Message variant='error' value={error} />}

      <div className='w-full md:w-[70%] lg:w-[50%] card-body bg-white mx-auto'>
        <h3 className='font-bold uppercase'>Choose payment method</h3>

        <div className='flex flex-row flex-wrap gap-4'>
          {payments?.map((item) => (
            <button
              key={item.name}
              disabled={item.disabled}
              onClick={() => setPaymentMethod(item.name)}
              className={`btn ${
                paymentMethod === item.name ? 'btn-primary' : 'bg-white'
              }  h-20 w-full md:w-[40%] border shadow-3xl p-2 flex justify-start items-center gap-x-2 mx-auto`}
            >
              <Image
                src={item.image}
                alt='payment'
                width={500}
                height={500}
                className='object-contain w-12 h-12'
              />
              <h3 className='font-bold uppercase'>{item.name}</h3>
            </button>
          ))}
        </div>
        <hr className='my-5' />

        <div className='border-0 shadow-sm card rounded-2'>
          <div className='card-body'>
            <h3 className='font-bold uppercase text-my-primary'>
              Order Summary
            </h3>

            <div className='w-full p-2'>
              <strong>Amount</strong>
              <p>
                {Number(flight?.adult || 0) +
                  Number(flight?.child || 0) +
                  Number(flight?.infant || 0)}
                x Passenger
              </p>
              <p>
                <span className='font-bold uppercase'>Total </span>
                <span>
                  $
                  {flight?.prices
                    ?.reduce((acc, cur) => acc + cur?.totalPrice, 0)
                    ?.toFixed(2)}
                </span>
              </p>
            </div>

            <div className='flex flex-row justify-start mb-3 input-group bg-warning'>
              <span className='m-auto mx-3 my-auto border rounded-none bg-warning border-3 border-warning'>
                <FaPhone className='text-light' />
              </span>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                disabled={Boolean(!paymentMethod)}
                type='number'
                className='w-full border rounded-none input border-3 border-warning focus:outline-none'
                placeholder={`Enter your payment number`}
              />
            </div>

            {userInfo?.role === 'AGENCY' && (
              <div className='mb-3'>
                <input
                  onChange={(e) => setDealerCode(e.target.value)}
                  value={dealerCode!}
                  type='text'
                  className='w-full border rounded-none input border-3 border-warning focus:outline-none'
                  placeholder={`Enter your dealer code`}
                />
              </div>
            )}

            <div className='flex justify-between mt-4'>
              <button
                onClick={() => router.back()}
                className='px-8 btn btn-outline btn-error rounded-xl'
              >
                Cancel
              </button>
              <button
                disabled={
                  Boolean(!phone) || Boolean(isPending) || !paymentMethod
                }
                className='px-8 btn btn-primary rounded-xl'
                onClick={handleBook}
              >
                {isPending
                  ? 'Loading...'
                  : paymentLink
                  ? 'Verify Payment'
                  : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
