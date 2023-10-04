import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HoC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import {
  Spinner,
  Pagination,
  Message,
  Confirm,
  Search,
  Meta,
} from '../../components'
import {
  DynamicFormProps,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../../utils/dForms'
import FormView from '../../components/FormView'
import { FaPenAlt, FaTrash } from 'react-icons/fa'
import apiHook from '../../api'
import { IAirline } from '../../models/Airline'

const Airlines = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['airlines'],
    method: 'GET',
    url: `airlines?page=${page}&q=${q}&limit=${25}&admin=true`,
  })?.get

  const postApi = apiHook({
    key: ['airlines'],
    method: 'POST',
    url: `airlines`,
  })?.post

  const updateApi = apiHook({
    key: ['airlines'],
    method: 'PUT',
    url: `airlines`,
  })?.put

  const deleteApi = apiHook({
    key: ['airlines'],
    method: 'DELETE',
    url: `airlines`,
  })?.deleteObj

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (postApi?.isSuccess || updateApi?.isSuccess || deleteApi?.isSuccess) {
      formCleanHandler()
      getApi?.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postApi?.isSuccess, updateApi?.isSuccess, deleteApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: IAirline) => {
    setId(item._id)
    setValue('name', item?.name)
    setValue('api', item?.api)
    setValue('adultCommission', item?.adultCommission)
    setValue('childCommission', item?.childCommission)
    setValue('infantCommission', item?.infantCommission)
    setValue('status', item?.status)
    setValue('username', item?.username)
    setValue('password', item?.password)
    setValue('logo', item?.logo)
    setEdit(true)
  }

  const deleteHandler = (id: any) => {
    confirmAlert(Confirm(() => deleteApi?.mutateAsync(id)))
  }

  const name = 'Airlines List'
  const label = 'Airline'
  const modal = 'airline'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const submitHandler = (data: Omit<IAirline, '_id'>) => {
    edit
      ? updateApi?.mutateAsync({
          _id: id,
          ...data,
        })
      : postApi?.mutateAsync(data)
  }

  const form = [
    <div key={0} className="col-lg-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
      } as DynamicFormProps)}
    </div>,

    <div key={2} className="col-lg-6 col-12">
      {inputText({
        register,
        errors,
        label: 'API',
        name: 'api',
        placeholder: 'API',
      } as DynamicFormProps)}
    </div>,
    <div key={3} className="col-lg-6 col-12">
      {inputNumber({
        register,
        errors,
        label: 'Adult commission',
        name: 'adultCommission',
        placeholder: 'Adult commission',
      } as DynamicFormProps)}
    </div>,
    <div key={3} className="col-lg-6 col-12">
      {inputNumber({
        register,
        errors,
        label: 'Child commission',
        name: 'childCommission',
        placeholder: 'Child commission',
      } as DynamicFormProps)}
    </div>,
    <div key={3} className="col-lg-6 col-12">
      {inputNumber({
        register,
        errors,
        label: 'Infant commission',
        name: 'infantCommission',
        placeholder: 'Infant commission',
      } as DynamicFormProps)}
    </div>,
    <div key={4} className="col-lg-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Logo',
        name: 'logo',
        isRequired: false,
        placeholder: 'Enter logo',
      } as DynamicFormProps)}
    </div>,
    <div key={4} className="col-lg-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Username',
        name: 'username',
        isRequired: false,
        placeholder: 'Enter username',
      } as DynamicFormProps)}
    </div>,
    <div key={4} className="col-lg-6 col-12">
      {inputText({
        register,
        errors,
        label: 'Password',
        name: 'password',
        isRequired: false,
        placeholder: 'Enter password',
      } as DynamicFormProps)}
    </div>,
    <div key={1} className="col-lg-6 col-12">
      {staticInputSelect({
        register,
        errors,
        label: 'Status',
        name: 'status',
        placeholder: 'Status',
        data: [{ name: 'active' }, { name: 'inactive' }],
      } as DynamicFormProps)}
    </div>,
  ]

  const modalSize = 'modal-md'

  return (
    <>
      <Meta title="Airlines" />

      {deleteApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been deleted successfully.`}
        />
      )}
      {deleteApi?.isError && (
        <Message variant="danger" value={deleteApi?.error} />
      )}
      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been updated successfully.`}
        />
      )}
      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}
      {postApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been Created successfully.`}
        />
      )}
      {postApi?.isError && <Message variant="danger" value={postApi?.error} />}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isLoading}
        isLoadingPost={postApi?.isLoading}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        modalSize={modalSize}
      />

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>
            <button
              className="btn btn-outline-primary btn-sm shadow my-2"
              data-bs-toggle="modal"
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
            <div className="col-auto">
              <Search
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Name</th>
                <th>API</th>
                <th>Adult Commission</th>
                <th>Child Commission</th>
                <th>Infant Commission</th>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IAirline, i: number) => (
                <tr key={i}>
                  <td>{item?.name}</td>
                  <td>{item?.api}</td>
                  <td>{item?.adultCommission}</td>
                  <td>{item?.childCommission}</td>
                  <td>{item?.infantCommission}</td>
                  <td>{item?.username}</td>
                  <td>{item?.status}</td>

                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary btn-sm rounded-pill"
                        onClick={() => editHandler(item)}
                        data-bs-toggle="modal"
                        data-bs-target={`#${modal}`}
                      >
                        <FaPenAlt />
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-1 rounded-pill"
                        onClick={() => deleteHandler(item._id)}
                        disabled={deleteApi?.isLoading}
                      >
                        {deleteApi?.isLoading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <span>
                            <FaTrash />
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Airlines)), {
  ssr: false,
})
