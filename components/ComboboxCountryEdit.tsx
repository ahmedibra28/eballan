'use client'

import { Fragment, useMemo, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { FaCheck, FaChevronDown } from 'react-icons/fa6'
import { ICountry } from '@/types'
import { Capitalize } from '@/lib/capitalize'

export default function ComboboxCountryEdit({
  countries,
  selected,
  setSelected,
  placeholder,
  name,
  countryError,
}: {
  countries: ICountry[]
  selected: ICountry
  setSelected: (country: ICountry) => void
  placeholder: string
  countryError?: string | null
  name?: string
}) {
  const people = useMemo(() => countries, [countries])

  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) =>
          person?.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className='relative z-20'>
        <label className='label' htmlFor={name}>
          {name}
        </label>
        <div className='relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-my-primary flex items-center px-1 border border-gray-300 h-12 rounded-none'>
          <Combobox.Input
            autoComplete='off'
            className='w-full border-none py-2 pl-2 pr-10 leading-5 text-gray-900 focus:ring-0 rounded-none outline-none'
            displayValue={(person: { name: string }) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <FaChevronDown
              className='h-2.5 w-2.5 text-gray-900 font-bold'
              aria-hidden='true'
            />
          </Combobox.Button>
        </div>
        <div className='-mt-[3px]'>
          {countryError && <span className='text-red-500'>{countryError}</span>}
        </div>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black/5 focus:outline-none'>
            {filteredPeople.length === 0 && query !== '' ? (
              <div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
                Nothing found.
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-my-primary text-white' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person?.name} <br />
                        {Capitalize(person.name)} ({person.isoCode})
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-my-primary'
                          }`}
                        >
                          <FaCheck className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}
