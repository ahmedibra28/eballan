'use client'

import { FaPaperPlane, FaCircleXmark } from 'react-icons/fa6'
import { CustomSubmitButton } from './dForms'

interface Props {
  formCleanHandler: () => void
  form: any
  isLoadingUpdate?: boolean
  isLoadingPost?: boolean
  handleSubmit: (data: any) => () => void
  submitHandler: (data: any) => void
  modal: string
  label: string
  modalSize: string
}

const FormView = ({
  formCleanHandler,
  form,
  isLoadingUpdate,
  isLoadingPost,
  handleSubmit,
  submitHandler,
  modal,
  label,
  modalSize,
}: Props) => {
  return (
    // <div
    //   className='modal fade'
    //   id={modal}
    //   data-bs-backdrop='static'
    //   data-bs-keyboard='false'
    //   tabIndex={-1}
    //   aria-labelledby={`${modal}Label`}
    //   aria-hidden='true'
    // >

    <dialog id={modal} className='modal'>
      <form
        onSubmit={handleSubmit(submitHandler)}
        method='dialog'
        className={`modal-box w-11/12 ${modalSize}`}
      >
        <div className='divider text-2xl uppercase'>{label}</div>

        <div>{form}</div>

        <div className='modal-action'>
          <button
            onClick={() => {
              // @ts-ignore
              window[modal].close()
              formCleanHandler()
            }}
            type='button'
            className='btn btn-error text-white'
          >
            <FaCircleXmark className='mb-0.5 text-white' /> Close
          </button>

          <CustomSubmitButton
            isLoading={isLoadingPost || isLoadingUpdate}
            label='Submit'
            type='submit'
            classStyle='btn btn-primary opacity-1 rounded-md'
          />
        </div>
      </form>
    </dialog>
  )
}

export default FormView
