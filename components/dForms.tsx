'use client'

import classNames from 'classnames'
import { memo, useRef, useState } from 'react'

export interface DynamicFormProps {
  register: any
  placeholder?: string
  errors: any
  name: string
  label?: string
  isRequired?: boolean
  validate?: boolean
  minLength?: boolean
  watch?: any
  data?: any
  value?: string
  format?: any
  hasLabel?: boolean
  max?: number
  setSearch?: (e: string) => void
  setValue?: (e: string, v2: string) => void
  setFile?: (e: any) => void
  edit?: boolean
  multiple?: boolean

  items?: string[]
  item?: string
  onChange?: (val: string) => void
  dropdownValue?: string
  customFormat?: any
  disabled?: boolean
  className?: string
  iconLeft?: any
  iconRight?: any
}

const Autocomplete = (props: DynamicFormProps) => {
  const {
    items = [],
    value,
    onChange,
    register,
    placeholder = 'Type something..',
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
    setValue,
    // setSearch,
    // format,
    edit = true,
    item: itemProp,
    dropdownValue = '',
    customFormat = '',
    className = '',
    iconLeft,
    iconRight,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <div
        // use classnames here to easily toggle dropdown open
        className={classNames({
          'dropdown w-full': true,
          'dropdown-open': open,
        })}
        ref={ref}
      >
        <div
          className={`flex items-center bg-white ${
            iconLeft ? 'pl-2 rounded-xl' : ''
          } ${iconRight ? '' : 'pr-2'}`}
        >
          {iconLeft && iconLeft}
          <input
            autoComplete='off'
            {...register(
              name,
              isRequired && { required: `${label} is required` }
            )}
            type='text'
            className={`p-3 rounded-none outline-none w-full ${className}`}
            value={value}
            // @ts-ignore
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            tabIndex={0}
          />
          {iconRight && iconRight}
        </div>

        {/* add this part */}
        {items?.length > 0 && (
          <div className='dropdown-content bg-base-200 top-14 z-10 max-h-96 overflow-auto flex-col rounded-md'>
            <ul
              className='menu menu-compact '
              // use ref to calculate the width of parent
              style={{ width: ref.current?.clientWidth }}
            >
              {items?.map((item, index) => {
                return (
                  <li
                    key={index}
                    tabIndex={index + 1}
                    onClick={() => {
                      // @ts-ignore
                      onChange(item[itemProp])
                      setOpen(false)
                      // @ts-ignore
                      setValue(name, item[itemProp])

                      if (dropdownValue === 'departure-date') {
                        // @ts-ignore
                        setValue(`fromId`, item?.id)
                      }
                      if (dropdownValue === 'arrival-date') {
                        // @ts-ignore
                        setValue(`toId`, item?.id)
                      }
                      if (dropdownValue === 'country') {
                        // @ts-ignore
                        setValue(
                          `countryId${name.split('country')[1]}`,
                          item?.id
                        )
                      }
                      if (dropdownValue === 'countryEdit') {
                        // @ts-ignore
                        setValue(`countryId`, item?.id)
                      }
                    }}
                    className='border-b border-b-base-content/10 w-full'
                  >
                    {customFormat ? (
                      customFormat(item)
                    ) : (
                      // @ts-ignore
                      <button type='button'>{item[itemProp]}</button>
                    )}
                  </li>
                )
              })}
            </ul>
            {/* add this part */}
          </div>
        )}

        {errors && errors[name] && (
          <span className='text-secondary text-sm mt-1'>
            {errors[name].message}
          </span>
        )}
      </div>
    </>
  )
}
// export as memo but not as default
const m = memo(Autocomplete)
export { m as Autocomplete }

export const InputText = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputTel = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='tel'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputTextArea = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <textarea
        rows='5'
        cols='30'
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputNumber = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
    max = 100000000000,
    disabled = false,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        {...register(name, isRequired && { required: `${label} is required` })}
        type='number'
        step={0.00001}
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
        max={max}
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputEmail = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    label,
    name,
    hasLabel = true,
    isRequired = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}

      <input
        {...register(name, {
          required: isRequired ? `${label} is required` : null,
          pattern: {
            value: /\S+@\S+\.+\S+/,
            message: 'Entered value does not match email format',
          },
        })}
        type='email'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputPassword = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    watch,
    name,
    label,
    validate = false,
    isRequired = true,
    minLength = false,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, {
          required: isRequired ? `${label} is required` : null,
          minLength: minLength
            ? {
                value: 6,
                message: 'Password must have at least 6 characters',
              }
            : null,
          validate: validate
            ? (value: any) =>
                value === watch().password || 'The passwords do not match'
            : null,
        })}
        type='password'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const DynamicInputSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    data,
    isRequired = true,
    value,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      >
        <option value=''>--- {placeholder} ---</option>
        {data &&
          data.map((d: any) => (
            <option key={d.id} value={d.id}>
              {['warehouse'].includes(name)
                ? // @ts-ignore
                  `${d?.branch?.name} - ${d[value]}`
                : // @ts-ignore
                  d[value]}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const StaticInputSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    data,
    label,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      >
        <option value=''>-------</option>
        {data &&
          data.map((d: { id: string; name: string }) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
      </select>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputCheckBox = (args: DynamicFormProps) => {
  const { register, errors, name, label, isRequired = true } = args

  return (
    <div className='form-control w-full'>
      <label
        className='label cursor-pointer flex justify-start items-center'
        htmlFor={name}
      >
        <input
          className='checkbox checkbox-primary checkbox-sm'
          type='checkbox'
          id={name}
          {...register(
            name,
            isRequired && { required: `${label} is required` }
          )}
        />

        <span className='label-text ml-2'>{label}</span>
      </label>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputMultipleCheckBox = (args: DynamicFormProps) => {
  const { register, errors, name, data, label, isRequired = true } = args

  return (
    <div className='form-control w-full'>
      <div className='row g-1 mb-3 flex flex-wrap flex-col justify-start'>
        {data &&
          data.map((d: any) => (
            <div key={d.id} className='w-full'>
              <label
                className='label cursor-pointer flex justify-start items-center'
                htmlFor={`flexCheck${d.id}`}
              >
                <input
                  {...register(
                    name,
                    isRequired && { required: `${label} is required` }
                  )}
                  className='checkbox checkbox-primary checkbox-sm'
                  type='checkbox'
                  value={d.id}
                  id={`flexCheck${d.id}`}
                />

                <span className='label-text ml-2'>{d.name}</span>
              </label>
            </div>
          ))}
      </div>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputFile = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    isRequired = true,
    label,
    setFile,
    hasLabel = true,
    multiple = false,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        multiple={multiple}
        {...register(name, isRequired && { required: `${label} is required` })}
        type='file'
        placeholder={placeholder}
        className='file-input file-input-ghost rounded-none border border-gray-300 w-full'
        id='formFile'
        // @ts-ignore
        onChange={(e: any) =>
          // @ts-ignore
          setFile(multiple ? e.target.files : e.target.files[0])
        }
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputDate = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    isRequired = true,
    hasLabel = true,
    className = 'input rounded-none border border-gray-300 w-full',
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...register(name, isRequired && { required: `${label} is required` })}
        type='date'
        placeholder={placeholder}
        className={className}
      />
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const InputAutoCompleteSelect = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    data,
    label,
    isRequired = true,
  } = args

  return (
    <div className='form-control w-full'>
      <label className='label' htmlFor='exampleDataList'>
        {label}
      </label>
      <input
        list='datalistOptions'
        autoComplete='off'
        id='exampleDataList'
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      />
      <datalist id='datalistOptions'>
        <option value=''>-------------</option>
        {data &&
          data.map((d: { id: string; name: string }) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
      </datalist>

      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const DynamicInputSelectNumber = (args: DynamicFormProps) => {
  const {
    register,
    placeholder,
    errors,
    name,
    label,
    data,
    isRequired = true,
    hasLabel = true,
  } = args

  return (
    <div className='form-control w-full'>
      {hasLabel && (
        <label className='label' htmlFor={name}>
          {label}
        </label>
      )}
      <select
        {...register(name, isRequired && { required: `${label} is required` })}
        type='text'
        placeholder={placeholder}
        className='input rounded-none border border-gray-300 w-full'
      >
        <option value=''>-------</option>

        {[...(Array(data).keys() as any)].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
      {errors && errors[name] && (
        <span className='text-secondary text-sm mt-1'>
          {errors[name].message}
        </span>
      )}
    </div>
  )
}

export const CustomSubmitButton = ({
  type = 'submit',
  classStyle = 'btn btn-primary opacity-1 rounded-none mt-5 w-full',
  isLoading = false,
  label = 'Submit',
  spinner = 'loading loading-spinner',
  iconLeft = '',
  ...args
}) => {
  return (
    <button
      {...args}
      type={type as any}
      className={classStyle}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className='flex items-center gap-2'>
          <span className={spinner}></span>
          loading...
        </span>
      ) : (
        <>
          {iconLeft}
          {label}
        </>
      )}
    </button>
  )
}

export const ButtonCircle = ({
  type = 'button',
  classStyle = 'btn btn-sm w-12 h-12 btn-primary rounded-full',
  isLoading = false,
  disabled = false,
  label = '',
  spinner = 'loading loading-spinner',
  onClick = () => {},
  icon,
  args,
}: {
  icon: any
  type?: string
  classStyle?: string
  isLoading?: boolean
  disabled?: boolean
  label?: string
  spinner?: string
  onClick?: () => void
  args?: any
}) => {
  return (
    <button
      {...args}
      type={type as any}
      className={`btn btn-sm ${classStyle}`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <span className='flex items-center gap-2'>
          <span className={spinner}></span>
          loading...
        </span>
      ) : (
        <>
          {icon && icon}
          {label && label}
        </>
      )}
    </button>
  )
}
