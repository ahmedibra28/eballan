import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FormContainer, Message } from '../../components'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import apiHook from '../../api'
import { userInfo } from '../../api/api'
import {
  DynamicFormProps,
  inputEmail,
  inputPassword,
  inputText,
} from '../../utils/dForms'

const Register = () => {
  const router = useRouter()
  const pathName = router.query.next || '/'
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const postApi = apiHook({
    key: ['register'],
    method: 'POST',
    url: `auth/register`,
  })?.post

  useEffect(() => {
    if (postApi?.isSuccess) {
      typeof window !== undefined &&
        localStorage.setItem('userInfo', JSON.stringify(postApi?.data))
      router.push(pathName as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess])

  useEffect(() => {
    userInfo() && userInfo().userInfo && router.push(pathName as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const submitHandler = async (data: {
    name: string
    email?: string
    password?: string
  }) => {
    postApi?.mutateAsync(data)
  }

  return (
    <FormContainer>
      <Head>
        <title>Login</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <h3 className="fw-light font-monospace text-center">Sign In</h3>
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(submitHandler)}>
        {inputText({
          register,
          errors,
          label: 'Name',
          name: 'name',
          placeholder: 'Name',
        } as DynamicFormProps)}

        {inputEmail({
          register,
          errors,
          label: 'Email',
          name: 'email',
          placeholder: 'Email',
        } as DynamicFormProps)}
        {inputPassword({
          register,
          errors,
          label: 'Password',
          name: 'password',
          placeholder: 'Password',
        } as DynamicFormProps)}
        {inputPassword({
          register,
          errors,
          validate: true,
          minLength: true,
          watch,
          label: 'Confirm Password',
          name: 'confirmPassword',
          placeholder: 'Confirm Password',
        } as DynamicFormProps)}
        <button
          type="submit"
          className="btn btn-primary form-control "
          disabled={postApi?.isLoading}
        >
          {postApi?.isLoading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            'Register'
          )}
        </button>
      </form>
      <div className="row pt-3">
        <div className="col">
          You have already an account?
          <Link
            href={`/auth/login?next=${pathName}`}
            className="ps-1 text-decoration-none"
          >
            Login
          </Link>
        </div>
      </div>
    </FormContainer>
  )
}

export default Register
