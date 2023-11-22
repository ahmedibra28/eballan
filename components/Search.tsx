'use client'
import { FormEvent } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'

interface Props {
  q: string
  setQ: (value: string) => void
  placeholder: string
  searchHandler: (e: FormEvent) => void
  type?: string
}

const Search = ({
  q,
  setQ,
  placeholder,
  searchHandler,
  type = 'text',
}: Props) => {
  return (
    <form onSubmit={searchHandler}>
      <div className='form-control'>
        <label className='input-group flex flex-row'>
          <input
            className='input rounded-none border border-gray-300 w-full focus:outline-none'
            type={type}
            placeholder={placeholder}
            aria-label='Search'
            onChange={(e) => setQ(e.target.value)}
            value={q}
          />
          <button
            type='submit'
            className='btn btn-outline btn-ghost rounded-none border border-l-0 border-gray-300'
          >
            <FaMagnifyingGlass />
          </button>
        </label>
      </div>
    </form>
  )
}

export default Search
