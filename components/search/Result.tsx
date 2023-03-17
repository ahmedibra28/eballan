import Image from 'next/image'
import React from 'react'
import { FaArrowAltCircleLeft, FaArrowRight, FaShareAlt } from 'react-icons/fa'

const Result = () => {
  return (
    <div className="card border-0 rounded-2 shadow mb-2">
      <div className="card-body">
        <div className="row">
          <div className="col-lg-3 col-12 my-auto text-center">
            <Image src="/favicon.png" alt="airplane" width={50} height={50} />{' '}
            <br />
            <br />
            <span className="fw-bold text-uppercase">Mandeeq Air</span>
          </div>
          <div className="col-lg-6 col-12 border border-bottom-0 border-top-0 my-auto">
            <div className="d-flex justify-content-around align-items-center">
              <div className="text-center">
                <span className="fw-bold"> 15:20:00</span> <br />
                <span className="">MGQ</span>
              </div>
              <div className="text-center">
                <FaArrowRight className="me-3" />
                <span className="">Direct</span>
                <FaArrowRight className="ms-3" />
              </div>
              <div className="text-center">
                <span className="fw-bold"> 16:20:00</span> <br />
                <span className="">DOB</span>
              </div>
              <div className="text-center">
                <span className="fw-light"> 1 hour</span> <br />
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-12 text-center">
            <FaShareAlt className="text-warning float-end" /> <br />
            <button className="btn btn-light text-uppercase my-2">
              <span className="fs-1">$170.00</span>
            </button>
            <br />
            <button className="btn btn-primary text-uppercase">Select</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Result
