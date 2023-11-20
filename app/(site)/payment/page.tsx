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
    // if (!passenger || !flight) return router.back()
    // eslint-disable-next-line
  }, [])

  // const handleBooking = () => {
  //   if (paymentMethod === 'somtel' && !paymentLink) {
  //     confirmBooking?.mutateAsync({
  //       passengers,
  //       flight,
  //       contact,
  //       payment: {
  //         phone,
  //         paymentMethod,
  //         status: 'invoice',
  //       },
  //     })
  //   }
  //   if (paymentMethod === 'somtel' && paymentLink) {
  //     confirmBooking?.mutateAsync({
  //       passengers,
  //       flight,
  //       contact,
  //       payment: {
  //         phone,
  //         paymentMethod,
  //         status: 'verify',
  //         link: paymentLink,
  //       },
  //     })
  //   }

  //   if (paymentMethod !== 'somtel') {
  //     confirmBooking?.mutateAsync({
  //       passengers,
  //       flight,
  //       contact,
  //       payment: {
  //         phone,
  //         paymentMethod,
  //       },
  //     })
  //   }
  // }

  // useEffect(() => {
  //   if (confirmBooking?.isSuccess) {
  //     if (confirmBooking?.data?.link) {
  //       window.open(confirmBooking?.data?.link, '_blank')
  //       setPaymentLink(confirmBooking?.data?.link)
  //     } else if (!confirmBooking?.data?.link) {
  //       setPaymentLink('')
  //       router.push('/success')
  //     }
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [confirmBooking?.isSuccess])

  React.useEffect(() => {
    if (paymentMethod) {
      setPhone('')
    }
  }, [paymentMethod])

  const payments = [
    { name: 'Hormuud', image: '/payments/hormuud.png', disabled: false },
    { name: 'Somtel', image: '/payments/somtel.png', disabled: true },
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
      })
        .then((data) => {
          return router.push(
            `/success?reservationId=${data.reservationId}&pnrNumber=${data.pnrNumber}`
          )
        })
        .catch((error) => {
          setError(String(error))
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    })
  }
  return (
    <div className='max-w-7xl mx-auto'>
      <Steps current={3} />
      {error && <Message variant='error' value={error} />}

      <div className='w-full md:w-[70%] lg:w-[50%] card-body bg-white mx-auto'>
        <h3 className='uppercase font-bold'>Choose payment method</h3>

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
                className='w-12 h-12 object-contain'
              />
              <h3 className='font-bold uppercase'>{item.name}</h3>
            </button>
          ))}
        </div>
        <hr className='my-5' />

        <div className='card shadow-sm rounded-2 border-0'>
          <div className='card-body'>
            <h3 className='uppercase font-bold text-my-primary'>
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

            <div className='input-group mb-3'>
              <span className='bg-warning border border-3 border-warning rounded-none'>
                <FaPhone className='text-light' />
              </span>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                disabled={Boolean(!paymentMethod)}
                type='number'
                className='input border border-3 border-warning rounded-none w-full focus:outline-none'
                placeholder={`Enter your payment number`}
              />
            </div>

            {userInfo?.role === 'AGENCY' && (
              <div className='mb-3'>
                <input
                  onChange={(e) => setDealerCode(e.target.value)}
                  value={dealerCode!}
                  type='text'
                  className='input border border-3 border-warning rounded-none w-full focus:outline-none'
                  placeholder={`Enter your dealer code`}
                />
              </div>
            )}

            <div className='flex justify-between mt-4'>
              <button
                onClick={() => router.back()}
                className='btn btn-outline btn-error rounded-xl px-8'
              >
                Cancel
              </button>
              <button
                disabled={
                  Boolean(!phone) || Boolean(isPending) || !paymentMethod
                }
                className='btn btn-primary rounded-xl px-8'
                onClick={handleBook}
              >
                {isPending
                  ? 'Loading...'
                  : paymentLink
                  ? 'Verify Payment After You Pay'
                  : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
