import React from 'react'
import Search from '../home/Search'
import Result from './Result'

const SearchResult = () => {
  return (
    <div className="headerBox">
      <div className="bg-warning mt-2 container-fluid w-100 mx-auto text-center">
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
          <Search />
        </div>
      </div>
      <div className="container mt-3">
        <Result />
        <Result />
        <Result />
        <Result />
      </div>
    </div>
  )
}

export default SearchResult
