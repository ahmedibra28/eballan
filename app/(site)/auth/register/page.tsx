'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  CustomSubmitButton,
  InputEmail,
  InputPassword,
  InputTel,
  InputText,
  InputTextArea,
} from '@/components/dForms'
import useUserInfoStore from '@/zustand/userStore'
import useApi from '@/hooks/useApi'
import FormContainer from '@/components/FormContainer'
import Message from '@/components/Message'

type FormData = {
  name?: string
  email?: string
  address?: string
  bio?: string
  mobile?: string
  password?: string
  confirmPassword?: string
}

const Page = () => {
  const router = useRouter()
  const params = useSearchParams().get('next')

  const { userInfo } = useUserInfoStore((state) => state)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const postApi = useApi({
    key: ['register'],
    method: 'POST',
    url: `auth/register`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      // const { id, email, menu, routes, token, name, mobile, role, image } =
      //   postApi.data
      // updateUserInfo({
      //   id,
      //   email,
      //   menu,
      //   routes,
      //   token,
      //   name,
      //   mobile,
      //   role,
      //   image,
      // })
      router.push('/auth/verify')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo.id && router.push((params as string) || '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, userInfo.id])

  const submitHandler = async (data: FormData) => {
    postApi?.mutateAsync(data)
  }

  return (
    <FormContainer title='Sign Up' margin='mt-44 mb-24'>
      {postApi?.isError && <Message variant='error' value={postApi?.error} />}

      <form onSubmit={handleSubmit(submitHandler)}>
        <InputText
          register={register}
          errors={errors}
          label='Name'
          name='name'
          placeholder='Name'
        />

        <InputEmail
          errors={errors}
          register={register}
          label='Email'
          name='email'
          placeholder='Email'
        />
        <InputText
          register={register}
          errors={errors}
          label='Address'
          name='address'
          placeholder='Address'
        />

        <InputTel
          register={register}
          errors={errors}
          label='Mobile'
          name='mobile'
          placeholder='615301507'
        />

        <InputTextArea
          register={register}
          errors={errors}
          isRequired={false}
          label='Bio'
          name='bio'
          placeholder='Tell us about yourself'
        />

        <InputPassword
          errors={errors}
          register={register}
          minLength={true}
          label='Password'
          name='password'
          placeholder='Password'
        />
        <InputPassword
          errors={errors}
          register={register}
          watch={watch}
          validate={true}
          minLength={true}
          label='Confirm Password'
          name='confirmPassword'
          placeholder='Confirm password'
        />

        <CustomSubmitButton isLoading={postApi?.isPending} label='Sign Up' />
      </form>
      <div className='flex justify-between items-center pt-3'>
        <Link href='/auth/login' className='ps-1 text-decoration-none'>
          Sign In?
        </Link>
      </div>
    </FormContainer>
  )
}

export default Page
