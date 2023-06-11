import React from 'react'
import {
  FaBaby,
  FaCalendarAlt,
  FaChevronDown,
  FaChild,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaMinusCircle,
  FaPlusCircle,
  FaSearch,
  FaUser,
  FaUsers,
} from 'react-icons/fa'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Search = ({
  showTitle = false,
  cities,
  onSubmit,
  fromDate,
  toDate,
  trip,
  seatType,
  noAdult,
  noChild,
  noInfant,
  originCity,
  destinationCity,
  setFromDate,
  setToDate,
  setTrip,
  setSeatType,
  setNoAdult,
  setNoChild,
  setNoInfant,
  setOriginCity,
  setDestinationCity,
}: {
  cities?: any[]
  showTitle?: boolean
  onSubmit?: (data: any) => void
  fromDate?: Date
  toDate?: Date
  trip?: string
  seatType?: string
  noAdult?: number
  noChild?: number
  noInfant?: number
  originCity?: string
  destinationCity?: string
  setFromDate?: any
  setToDate?: any
  setTrip?: any
  setSeatType?: any
  setNoAdult?: any
  setNoChild?: any
  setNoInfant?: any
  setOriginCity?: any
  setDestinationCity?: any
}) => {
  return (
    <>
      {showTitle && (
        <div className="container">
          <h6 className="fs-1 fw-bold text-white text-center">
            Nimaan Dhulmarin Dhaayo Maleh
          </h6>
        </div>
      )}

      <div className="border py-5 w-100 text-light rounded-0 position-relative my-3">
        <div className="container">
          <div className="d-flex flex-row text-light">
            {/* Trip direction */}
            <select
              onChange={(e) => setTrip(e.target.value)}
              value={trip}
              name="trip"
              className="form-select w-auto bg-transparent text-light border-0 shadow-none"
              style={{
                backgroundImage: "url('/chevron-down-solid.svg')",
              }}
            >
              <option value="One-way">One-way</option>
              <option value="Return">Return</option>
              <option disabled value="Multi-city">
                Multi-city
              </option>
            </select>

            {/* Trip type */}
            <select
              onChange={(e) => setSeatType(e.target.value)}
              value={seatType}
              name="seatType"
              className="form-select w-auto bg-transparent text-light ms-2 border-0 shadow-none"
              style={{
                backgroundImage: "url('/chevron-down-solid.svg')",
              }}
            >
              <option value="Economy">Economy</option>
              <option disabled value="Premium">
                Premium
              </option>
              <option disabled value="Business">
                Business
              </option>
              <option disabled value="First Class">
                First Class
              </option>
            </select>

            {/* Passenger */}
            <button
              type="button"
              className="btn btn-primary shadow-nonex passenger-model border-0 bg-transparent"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              <FaUsers className="mb-1" /> {/* @ts-ignore */}
              <span className="mx-3">{noAdult + noChild + noInfant}</span>
              <FaChevronDown className="mb-1" />
            </button>

            <div
              className="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex={-1}
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 customBGs text-primary">
                  <div className="modal-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <FaUser className="mb-1" />
                        <span className="fw-bold"> Adults </span>
                        <small className="italic fst-italic"> (Over 11)</small>
                      </div>
                      <div>
                        <button
                          type="button"
                          // @ts-ignore
                          onClick={() => noAdult > 0 && setNoAdult(noAdult - 1)}
                          className="btn btn-light"
                        >
                          <FaMinusCircle className="mb-1 text-primary" />
                        </button>
                        <span className="mx-2">{noAdult}</span>
                        <button
                          type="button"
                          // @ts-ignore
                          onClick={() => setNoAdult(noAdult + 1)}
                          className="btn btn-light"
                        >
                          <FaPlusCircle className="mb-1 text-primary" />
                        </button>
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <div>
                        <FaChild className="mb-1" />
                        <span className="fw-bold"> Children </span>
                        <small className="italic fst-italic"> (2 - 11)</small>
                      </div>
                      <div>
                        <button
                          type="button"
                          // @ts-ignore
                          onClick={() => noChild > 0 && setNoChild(noChild - 1)}
                          className="btn btn-light"
                        >
                          <FaMinusCircle className="mb-1 text-primary" />
                        </button>
                        <span className="mx-2">{noChild}</span>
                        <button
                          type="button"
                          // @ts-ignore
                          onClick={() => setNoChild(noChild + 1)}
                          className="btn btn-light"
                        >
                          <FaPlusCircle className="mb-1 text-primary" />
                        </button>
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <div>
                        <FaBaby className="mb-1" />
                        <span className="fw-bold"> Infants </span>
                        <small className="italic fst-italic"> (Under 2)</small>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            // @ts-ignore
                            noInfant > 0 && setNoInfant(noInfant - 1)
                          }
                          className="btn btn-light"
                        >
                          <FaMinusCircle className="mb-1 text-primary" />
                        </button>
                        <span className="mx-2">{noInfant}</span>
                        <button
                          type="button"
                          // @ts-ignore
                          onClick={() => setNoInfant(noInfant + 1)}
                          className="btn btn-light"
                        >
                          <FaPlusCircle className="mb-1 text-primary" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-warning"
                      data-bs-dismiss="modal"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gy-3">
            <div className="col-lg-3 col-6 rounded-5 bg-white">
              <div className="input-group">
                <span className="input-group-text bg-white rounded-5 border-0 shadow-none">
                  <FaMapMarkerAlt className="text-primary" />
                </span>
                <select
                  className="form-control py-3 border-0 shadow-none"
                  placeholder="Select to city"
                  name="originCity"
                  onChange={(e) => setOriginCity(e.target.value)}
                  value={originCity}
                >
                  <option value="">Select to origin city</option>
                  {cities
                    ?.filter((item) => destinationCity !== item.id?.toString())
                    ?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
                <span
                  className="input-group-text bg-white rounded-5 border-0 shadow-none"
                  id="fromDataList"
                >
                  <FaExchangeAlt className="text-primary" />
                </span>
              </div>
            </div>

            <div className="col-lg-3 col-6 rounded-5 bg-white">
              <div className="input-group">
                <span className="input-group-text bg-white rounded-5  border-0 shadow-none">
                  <FaMapMarkerAlt className="text-primary" />
                </span>
                <select
                  className="form-control py-3 border-0 shadow-none bg-transparent"
                  placeholder="Type to search..."
                  name="destinationCity"
                  onChange={(e) => setDestinationCity(e.target.value)}
                  value={destinationCity}
                >
                  <option value="">Select to destination city</option>
                  {cities
                    ?.filter((item) => originCity !== item.id?.toString())
                    ?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div
              className={`${
                trip === 'Return' ? 'col-lg-2' : 'col-lg-3'
              } col-6 rounded-5 bg-white`}
            >
              <div className="d-flex">
                <span className="input-group-text bg-white rounded-5  border-0 shadow-none">
                  <FaCalendarAlt className="text-primary" />
                </span>
                <DatePicker
                  selected={fromDate}
                  onChange={(date: Date) => setFromDate(date)}
                  minDate={new Date()}
                  showDisabledMonthNavigation
                  className="form-control py-3 border-0 shadow-none bg-transparent"
                />
              </div>
            </div>

            {trip === 'Return' && (
              <div className="col-lg-2 col-6 rounded-5 bg-white">
                <div className="d-flex">
                  <span className="input-group-text bg-white rounded-5  border-0 shadow-none">
                    <FaCalendarAlt className="text-primary" />
                  </span>
                  <DatePicker
                    selected={toDate}
                    onChange={(date: Date) => setToDate(date)}
                    minDate={new Date()}
                    showDisabledMonthNavigation
                    className="form-control py-3 border-0 shadow-none bg-transparent"
                  />
                </div>
              </div>
            )}

            <div
              className={`${
                trip === 'Return' ? 'col-lg-2 col-12' : 'col-lg-3 col-6'
              } text-end rounded-5 bg-white`}
            >
              <button
                type="button"
                onClick={() =>
                  // @ts-ignore
                  onSubmit({
                    fromDate,
                    toDate,
                    trip,
                    originCity,
                    destinationCity,
                    seatType,
                    noAdult,
                    noChild,
                    noInfant,
                  })
                }
                className="btn btn-white py-3 w-100 bg-transparent border-0 text-primary"
              >
                <FaSearch className="mb-1" /> Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
