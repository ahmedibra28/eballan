import Image from 'next/image'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer
      className="bg-primary container-fluids mx-0"
      style={{
        minHeight: 55,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
    >
      {/* <div className="row ">
        <div className="col text-center py-1 footer font-monospace bg-light my-auto">
          Developed by{' '}
          <a target="_blank" href="https://ahmedibra.com" rel="noreferrer">
            Ahmed Ibrahim
          </a>
          <br />
          <Image src="/logo.png" width="30" height="30" alt="logo" />
        </div>
      </div> */}
      <div className="container text-light py-5">
        <div className="row mb-4">
          <div className="col-lg-6 col-12 my-auto">
            <Link href="/privacy-policy" className="text-light">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="text-light mx-4">
              Terms of Use
            </Link>

            <a
              target="_blank"
              href="https://wa.me/252611598011?text=Help me with flight booking&source=&data=&app_absent="
              className="text-light"
            >
              Get Help Through WhatsApp
            </a>
          </div>
          <div className="col-lg-6 col-12 my-auto text-end">
            <Image src="/partners/1.png" width={60} height={60} alt="logo" />
            <Image
              className="mx-4"
              src="/partners/2.png"
              width={60}
              height={60}
              alt="logo"
            />
            <Image
              className="mx-4"
              src="/partners/3.png"
              width={60}
              height={60}
              alt="logo"
            />
            <Image src="/partners/4.png" width={60} height={60} alt="logo" />
          </div>
        </div>
        <hr />
        <div className="row ">
          <div className="col-12 text-light text-center py-1 footer font-monospace my-auto">
            <span> Simple with great resource</span> <br />
            <span>
              <span className="">&copy; </span>
              <span className="text-warning">e</span>Ballan
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
