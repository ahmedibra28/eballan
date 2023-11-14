'use client'
import React, { useEffect } from 'react'
import Head from 'next/head'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'
import { CustomSubmitButton } from '@/components/dForms'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const Verify = ({
  params,
}: {
  params: {
    token: string
  }
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  const postApi = useApi({
    key: ['verify'],
    method: 'POST',
    url: `auth/verify`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      const { id, email, menu, routes, token, name, mobile, role, image } =
        postApi.data
      updateUserInfo({
        id,
        email,
        menu,
        routes,
        token,
        name,
        mobile,
        role,
        image,
      })

      router.push('/auth/login')
    }
    // eslint-disable-next-line
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo.id && router.push('/')
  }, [router, userInfo.id])

  const submitHandler = () => {
    postApi?.mutateAsync({ verifyToken: token })
  }

  return (
    <FormContainer title='Verify'>
      <Head>
        <title>Verify</title>
        <meta property='og:title' content='Verify' key='title' />
      </Head>
      {postApi?.isSuccess && (
        <Message variant='success' value={postApi?.data?.message} />
      )}

      {postApi?.isError && <Message variant='error' value={postApi?.error} />}

      {token ? (
        <CustomSubmitButton
          onClick={submitHandler}
          label='Verify Account Creation'
          isLoading={postApi?.isPending}
        />
      ) : (
        <>
          <div className='text-center'>
            <p>
              Check your email and click on the verify button or copy and paste
              the link.
            </p>
            <p>or</p>
            <div className='my-5'>
              <Link href='/auth/login' className='underline'>
                Sign In?
              </Link>
            </div>
          </div>
        </>
      )}
    </FormContainer>
  )
}

export default Verify
