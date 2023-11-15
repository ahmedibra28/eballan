import { FormatNumber } from '@/components/FormatNumber'
import { ButtonCircle } from '@/components/dForms'
import DateTime from '@/lib/dateTime'
import { IPdf } from '@/types'
import {
  FaCircleCheck,
  FaCircleXmark,
  FaEllipsis,
  FaTrash,
} from 'react-icons/fa6'
import React from 'react'

type Column = {
  isLoading: boolean
  deleteHandler: (item: IPdf) => void
}

export const columns = ({ isLoading, deleteHandler }: Column) => {
  return [
    {
      header: 'Passengers',
      accessorKey: 'passengers',
      active: true,
      cell: ({ row: { original } }: { row: { original: IPdf } }) => (
        <span>{original?.passengers?.length}</span>
      ),
    },
    { header: 'Airline', accessorKey: 'flight.airline.name', active: true },
    {
      header: 'Departure Date',
      accessorKey: 'flight.departureDate',
      active: true,
      cell: ({ row: { original } }: { row: { original: IPdf } }) => (
        <span>
          {DateTime(original?.flight?.departureDate).format('DD-MM-YYYY HH:mm')}
        </span>
      ),
    },
    {
      header: 'Departure City',
      accessorKey: 'flight.fromCityName',
      active: true,
    },
    {
      header: 'Arrival City',
      accessorKey: 'flight.toCityName',
      active: true,
    },
    { header: 'Reservation ID', accessorKey: 'reservationId', active: false },
    { header: 'PNR Number', accessorKey: 'pnrNumber', active: false },
    {
      header: 'Booked By',
      accessorKey: 'createdBy.name',
      active: false,
      cell: ({ row: { original } }: { row: { original: IPdf } }) => (
        <span>
          {original?.createdBy?.name || (
            <FaCircleXmark className='text-red-500' />
          )}
        </span>
      ),
    },
    {
      header: 'Agency?',
      accessorKey: 'createdBy.role.type',
      active: true,
      cell: ({
        row: { original },
      }: {
        row: {
          original: { createdBy: { role: { type: string } } } & IPdf
        }
      }) => (
        <span>
          {original?.createdBy?.role?.type === 'AGENCY' ? (
            <FaCircleCheck className='text-green-500 ' />
          ) : (
            <FaCircleXmark className='text-red-500' />
          )}
        </span>
      ),
    },
    {
      header: 'Dealer Code',
      accessorKey: 'dealerCode',
      active: false,
      cell: ({ row: { original } }: { row: { original: IPdf } }) => (
        <span>
          {original?.dealerCode || <FaCircleXmark className='text-red-500' />}
        </span>
      ),
    },
    {
      header: 'Fare',
      accessorKey: 'fare',
      active: true,
      cell: ({ row: { original } }: { row: { original: IPdf } }) => (
        <span>
          <FormatNumber
            isCurrency={true}
            value={original?.prices?.reduce(
              (acc, cur) => acc + cur?.totalPrice,
              0
            )}
          />
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      active: true,
      cell: ({ row: { original } }: { row: { original: IPdf } }) =>
        original?.status === 'ACTIVE' ? (
          <span className='text-green-500'>{original?.status}</span>
        ) : original?.status === 'BOOKED' ? (
          <span className='text-blue-500'>{original?.status}</span>
        ) : (
          <span className='text-red-500'>{original?.status}</span>
        ),
    },
    {
      header: 'Action',
      active: true,
      cell: ({ row: { original } }: { row: { original: IPdf } }) => (
        <div className='dropdown dropdown-top dropdown-left z-30'>
          <label tabIndex={0} className='cursor-pointer'>
            <FaEllipsis className='text-2xl' />
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content menu p-2 bg-white rounded-tl-box rounded-tr-box rounded-bl-box w-28 border border-gray-200 shadow'
          >
            <li className='h-10 w-auto'>
              <ButtonCircle
                isLoading={isLoading}
                label='Delete'
                // @ts-ignore
                onClick={() => deleteHandler(original.id)}
                icon={<FaTrash className='text-white' />}
                classStyle='btn-error justify-start text-white'
              />
            </li>
          </ul>
        </div>
      ),
    },
  ]
}
