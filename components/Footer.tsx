import Image from 'next/image'
import Link from 'next/link'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const Footer = () => {
  const partners = [
    { image: '/partners/1.png' },
    { image: '/partners/2.png' },
    { image: '/partners/3.png' },
    { image: '/partners/4.png' },
  ]

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 3,
    },
    largeMobile: {
      breakpoint: { max: 768, min: 576 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 2,
    },
  }

  return (
    <>
      <div className="col-lg-4 col-md-6 col-12 my-auto mx-auto text-center">
        {/* <div className='column'> */}
        <Carousel
          responsive={responsive}
          infinite={true}
          itemClass="text-center"
          autoPlay={true}
          arrows={false}
        >
          {partners?.map((partner) => (
            <div key={partner.image} className="flex-col text-center m-2">
              <Image
                width={75}
                height={75}
                src={partner.image}
                alt={partner.image}
                className=""
              />
            </div>
          ))}
        </Carousel>
      </div>
      <footer
        className="bg-primary container-fluids mx-0"
        style={{
          minHeight: 55,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <div className="container text-light py-5">
          <div className="row mb-4">
            <div className="col-lg-6 col-12 my-auto mx-auto text-center">
              <Link href="/privacy-policy" className="text-light">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="text-light mx-4">
                Terms of Use
              </Link>

              <Link href="/get-help" className="text-light">
                Get Help
              </Link>
            </div>
          </div>
          <hr />
          <div className="row ">
            <div className="col-12 text-light text-center py-1 footer my-auto">
              <span> eBallan is a great source</span> <br />
              <span>
                <span className="">&copy; </span>
                <span className="text-warning">e</span>Ballan
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
