import React from 'react'

import Search from './Search'

const Header = () => {
  return (
    <div className="bg-primary headerBox pt-1">
      <div className="headerBG">
        <div className="d-flex flex-column justify-content-center align-items-start h-100">
          <Search showTitle={true} />
        </div>
      </div>
    </div>
  )
}

export default Header
