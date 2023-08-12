import Link from 'next/link'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

export interface StepProp {
  id: number
  title: string
  active: boolean
  link: string
  completed: boolean
}

const Steps = ({ steps }: { steps: StepProp[] }) => {
  return (
    <div className="row gy-3">
      {steps?.map((step) => (
        <div
          key={step.id}
          className="col mx-auto d-flex justify-content-start align-items-center"
        >
          <span
            className={`border border-warning ${
              step.active ? 'bg-warning text-light' : ''
            } ${
              step.completed ? 'bg-warning text-light' : ''
            } rounded-pill d-flex justify-content-center align-items-center me-2`}
            style={{ minWidth: 30, minHeight: 30 }}
          >
            {step.completed ? (
              <FaCheckCircle className="text-light" />
            ) : (
              <span className="text-center">{step.id}</span>
            )}
          </span>
          <span className="text-nowrap">
            <Link href={step.link} className="text-decoration-none text-muted">
              {step.title}
            </Link>
          </span>
          <span className="w-100 border ms-2" />
        </div>
      ))}
    </div>
  )
}

export default Steps
