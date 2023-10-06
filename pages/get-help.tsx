import React from 'react'
import { FormContainer } from '../components'

const GetHelp = () => {
  return (
    <FormContainer>
      <h3 className="fw-bold text-primary font-monospace text-center">
        Get Help
      </h3>
      <hr />
      <div className="p-5">
        <div className="btn-group d-flex justify-content-around align-items-center gap-2">
          <a
            target="_blank"
            href="https://wa.me/252611598011?text=Help me with flight booking&source=&data=&app_absent="
            className="btn btn-primary"
          >
            WhatsApp
          </a>

          <a
            target="_blank"
            href="mailto:info@eballan.com"
            className="btn btn-outline-primary"
          >
            info@eballan.com
          </a>
        </div>
      </div>
    </FormContainer>
  )
}

export default GetHelp
