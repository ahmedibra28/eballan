import { FaCheckCircle, FaUser, FaUserPlus } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='container'>
      <div className='text-center'>
        <Image src='/logo.png' alt='eBallan Logo' width={400} height={94} />
      </div>

      <div className='row mt-5 g-4'>
        <div className='col-md-5 col-12 mx-auto'>
          <div className='card shadow-lg'>
            <FaUserPlus className='mb-1 card-img-top fs-1 custom-text-primary' />
            <div className='card-body text-center'>
              <h3 className='card-title display-6'>NEW PATIENT</h3>
              <p className='card-text text-muted'>
                Fadlan dooro hadii aad tahay bukaan cusub
              </p>
              <Link href='/new-patient'>
                <a className='btn btn-primary form-control'>
                  <FaCheckCircle className='mb-1' /> CLICK
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className='col-md-5 col-12 mx-auto'>
          <div className='card shadow-lg'>
            <FaUser className='mb-1 card-img-top fs-1 custom-text-primary' />
            <div className='card-body text-center'>
              <h3 className='card-title display-6'>EXISTED PATIENT</h3>
              <p className='card-text text-muted'>
                Fadlan dooro hadii aadan ahay bukaan cusub
              </p>
              <Link href='/existing-patient'>
                <a className='btn btn-primary form-control'>
                  <FaCheckCircle className='mb-1' /> CLICK
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
