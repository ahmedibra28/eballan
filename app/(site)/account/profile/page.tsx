'use client'
import useAuthorization from '@/hooks/useAuthorization'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

import Image from 'next/image'
import useApi from '@/hooks/useApi'
import Message from '@/components/Message'
import Spinner from '@/components/Spinner'
import {
  CustomSubmitButton,
  InputCheckBox,
  InputNumber,
  InputPassword,
  InputTel,
  InputText,
  InputTextArea,
} from '@/components/dForms'
import useUserInfoStore from '@/zustand/userStore'
import Upload from '@/components/Upload'
import Link from 'next/link'

const Profile = () => {
  const [fileLink, setFileLink] = React.useState<string[]>([])
  const [fileLinkDocument, setFileLinkDocument] = React.useState<string[]>([])

  const path = useAuthorization()
  const router = useRouter()

  const { userInfo, updateUserInfo } = useUserInfoStore((state) => state)

  useEffect(() => {
    if (path) {
      router.push(path)
    }
  }, [path, router])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  const getApi = useApi({
    key: ['profiles'],
    method: 'GET',
    url: `profile`,
  })?.get
  const updateApi = useApi({
    key: ['profiles'],
    method: 'PUT',
    url: `profile`,
  })?.put

  useEffect(() => {
    if (updateApi?.isSuccess) {
      getApi?.refetch()
      const { name, mobile, image } = updateApi?.data
      updateUserInfo({
        ...userInfo,
        name,
        mobile,
        image,
      })
      setFileLink([])
      setFileLinkDocument([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateApi?.isSuccess])

  useEffect(() => {
    setValue('name', !getApi?.isPending ? getApi?.data?.name : '')
    setValue('address', !getApi?.isPending ? getApi?.data?.address : '')
    setValue('mobile', !getApi?.isPending ? getApi?.data?.mobile : '')
    setValue('bio', !getApi?.isPending ? getApi?.data?.bio : '')
    if (userInfo.role === 'AGENCY') {
      setValue('company', !getApi?.isPending ? getApi?.data?.company : '')
      setValue('bankName', !getApi?.isPending ? getApi?.data?.bankName : '')
      setValue(
        'bankAccount',
        !getApi?.isPending ? getApi?.data?.bankAccount : ''
      )
      setValue(
        'policyConfirmed',
        !getApi?.isPending ? getApi?.data?.policyConfirmed : ''
      )
      setFileLink(!getApi?.isPending ? [getApi?.data?.image] : [])
      setFileLinkDocument(
        !getApi?.isPending ? [getApi?.data?.verificationDocument] : []
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApi?.isPending, setValue])

  const submitHandler = (data: any) => {
    updateApi?.mutateAsync({
      ...data,
      id: getApi?.data?.id,
      image: fileLink ? fileLink[0] : getApi?.data?.image,
      verificationDocument: fileLinkDocument
        ? fileLinkDocument[0]
        : getApi?.data?.verificationDocument,
    })
  }

  return (
    <Fragment>
      {updateApi?.isError && (
        <Message variant='error' value={updateApi?.error} />
      )}

      {getApi?.isError && <Message variant='error' value={getApi?.error} />}
      {updateApi?.isSuccess && (
        <Message variant='success' value={updateApi?.data?.message} />
      )}

      {getApi?.isPending && <Spinner />}

      <div className='bg-opacity-60 max-w-4xl mx-auto bg-white p-4 md:p-8'>
        <div className='divider text-3xl uppercase text-primary'>
          {userInfo.name}
        </div>
        <div className='text-center mb-10'>
          <div className='badge badge-neutral'>
            <span> {userInfo.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          {getApi?.data?.image && (
            <div className='avatar text-center flex justify-center'>
              <div className='w-32 mask mask-hexagon'>
                <Image
                  src={getApi?.data?.image}
                  alt='avatar'
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          <div className='flex flex-row flex-wrap gap-2'>
            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputText
                register={register}
                errors={errors}
                label='Name'
                name='name'
                placeholder='Name'
              />
            </div>
            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputText
                register={register}
                errors={errors}
                label='Address'
                name='address'
                placeholder='Address'
              />
            </div>

            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputTel
                register={register}
                errors={errors}
                label='Mobile'
                name='mobile'
                placeholder='615301507'
              />
            </div>

            {userInfo?.role === 'AGENCY' && (
              <>
                <div className='w-full md:w-[48%] lg:w-[32%]'>
                  <InputText
                    register={register}
                    errors={errors}
                    label='Company Name'
                    name='company'
                    placeholder='Company name'
                    isRequired={false}
                  />
                </div>
                <div className='w-full md:w-[48%] lg:w-[32%]'>
                  <InputText
                    register={register}
                    errors={errors}
                    label='Bank Name'
                    name='bankName'
                    placeholder='Bank name'
                  />
                </div>
                <div className='w-full md:w-[48%] lg:w-[32%]'>
                  <InputNumber
                    register={register}
                    errors={errors}
                    label='Bank Account'
                    name='bankAccount'
                    placeholder='Bank account'
                  />
                </div>
              </>
            )}

            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <InputTextArea
                register={register}
                errors={errors}
                label='Bio'
                name='bio'
                placeholder='Tell us about yourself'
              />
            </div>

            <div className='w-full md:w-[48%] lg:w-[32%]'>
              <Upload
                label={userInfo?.role === 'AGENCY' ? 'Logo' : 'Image'}
                setFileLink={setFileLink}
                fileLink={fileLink}
                fileType='image'
              />

              {fileLink.length > 0 && (
                <div className='avatar text-center flex justify-center items-end mt-2'>
                  <div className='w-12 mask mask-squircle'>
                    <Image
                      src={fileLink?.[0]}
                      alt='avatar'
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {userInfo?.role === 'AGENCY' && (
              <>
                <div className='w-full md:w-[48%] lg:w-[32%]'>
                  <Upload
                    label='Verification Document'
                    setFileLink={setFileLinkDocument}
                    fileLink={fileLinkDocument}
                    fileType='document'
                  />

                  {fileLinkDocument.length > 0 && (
                    <div className='w-full'>
                      <a className='underline' href={fileLinkDocument?.[0]}>
                        Verification Document
                      </a>
                    </div>
                  )}
                </div>

                <div className='flex justify-start flex-wrap flex-col w-full gap-2'>
                  <p className='text-xs ml-3'>
                    <ol className='list-decimal'>
                      <li>
                        eBallan.com reserves the authority to terminate your
                        account access at any given time.
                      </li>
                      <li>
                        A 20% commission will be allocated to the dealer staff.
                        This commission will be deducted from the agency&apos;s
                        total commission.
                      </li>
                    </ol>
                  </p>
                  <Link href='/terms-of-use' className='text-sm underline'>
                    <span>Terms of use</span>
                  </Link>

                  <div className='w-full'>
                    <InputCheckBox
                      isRequired={false}
                      register={register}
                      errors={errors}
                      label='I agree with the terms and conditions'
                      name='policyConfirmed'
                    />
                  </div>
                </div>
              </>
            )}

            <div className='flex justify-start flex-wrap flex-row w-full gap-2'>
              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <InputPassword
                  register={register}
                  errors={errors}
                  label='Password'
                  name='password'
                  minLength={true}
                  isRequired={false}
                  placeholder="Leave blank if you don't want to change"
                />
              </div>
              <div className='w-full md:w-[48%] lg:w-[32%]'>
                <InputPassword
                  register={register}
                  errors={errors}
                  label='Confirm Password'
                  name='confirmPassword'
                  minLength={true}
                  isRequired={false}
                  validate={true}
                  placeholder='Confirm Password'
                  watch={watch}
                />
              </div>
            </div>
          </div>

          <div className='w-full md:w-[48%] lg:w-[32%]'>
            <CustomSubmitButton
              isLoading={updateApi?.isPending || false}
              label='Update'
            />
          </div>
        </form>
      </div>
    </Fragment>
  )
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
})
