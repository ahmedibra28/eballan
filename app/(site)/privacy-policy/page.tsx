'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function PrivacyPolicy() {
  const [active, setActive] = React.useState('Privacy Policy')
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (searchParams.get('active')) {
      setActive('Refund Policy')
    }
  }, [searchParams])

  return (
    <div className='max-w-7xl mx-auto'>
      <nav className='mb-4'>
        <button
          onClick={() => setActive('Privacy Policy')}
          type='button'
          className={`btn btn-outline bg-gray-300 text-white ${
            active === 'Privacy Policy' ? 'bg-my-primary' : ''
          }`}
          aria-current='page'
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActive('Refund Policy')}
          type='button'
          className={`btn btn-outline bg-gray-300 text-white ${
            active === 'Refund Policy' ? 'bg-my-primary' : ''
          }`}
        >
          Refund Policy
        </button>
      </nav>

      {active === 'Privacy Policy' && (
        <div className='space-y-3'>
          <h1 className='text-2xl font-bold'>Privacy Policy</h1>
          <p>
            Effective Date: <strong>08 Aug, 2023</strong>
          </p>
          <p>
            This Privacy Policy describes how we collect, use, and disclose
            personal information when you use our online flight booking
            services. We are committed to protecting your privacy and ensuring
            the security of your personal information. Please read this policy
            carefully to understand how we handle your information.
          </p>
          <h4>Information We Collect:</h4>
          <p className='fst-italic'>
            We may collect the following types of personal information:
          </p>

          <ul>
            <li>
              <strong> Contact Information: </strong> Name, address, email
              address, and telephone number.
            </li>
            <li>
              <strong>Booking Information:</strong> Flight preferences, travel
              companion details, passport information, and payment details.
            </li>
            <li>
              <strong>Communication Information: </strong> Any correspondence we
              have with you, including emails and chat logs.
            </li>
            <li>
              <strong> Device Information: </strong> Information about the
              device you use to access our services, such as IP address, browser
              type, and operating system.
            </li>
          </ul>

          <h4>Use of Personal Information:</h4>
          <p className='fst-italic'>
            We use the collected information for the following purposes:
          </p>

          <ul>
            <li>
              <strong>Processing Reservations: </strong> To facilitate flight
              bookings, manage reservations, and provide customer support.
            </li>
            <li>
              <strong>Communication: </strong> To respond to your inquiries,
              send booking confirmations, and provide important updates
              regarding your travel.
            </li>
            <li>
              <strong>Personalization: </strong> To tailor our services to meet
              your preferences and improve your experience.
            </li>
            <li>
              <strong>Marketing: </strong> With your consent, we may send
              promotional offers, newsletters, and other marketing materials.
            </li>
            <li>
              <strong>Legal Compliance: </strong> To comply with applicable
              laws, regulations, and legal processes.
            </li>
          </ul>

          <h4>Information Sharing:</h4>
          <p className='fst-italic'>
            We may share your personal information with third parties under the
            following circumstances:
          </p>

          <ul>
            <li>
              <strong>Service Providers: </strong> We may engage trusted
              third-party service providers to perform various functions on our
              behalf, such as payment processing and customer support. These
              providers have limited access to personal information necessary to
              perform their tasks.{' '}
            </li>
            <li>
              <strong>Business Partners: </strong> We may share your information
              with our business partners to offer you relevant products,
              services, or promotions.
            </li>
            <li>
              <strong>Legal Requirements: </strong> We may disclose personal
              information if required by law, court order, or government
              request.
            </li>
            <li>
              <strong>Safety and Security: </strong> We may share information to
              protect our rights, property, and safety, as well as the rights,
              property, and safety of our users and others.
            </li>
          </ul>

          <h4> Protect payment details:</h4>
          <p className='fst-italic'>
            Certainly! When it comes to protecting payment details, we take
            several measures to ensure the security of your financial
            information. Here are some of the key practices we implement:{' '}
          </p>

          <ul>
            <li>
              <strong>Encryption: </strong> We use industry-standard encryption
              protocols, such as Secure Socket Layer (SSL) or Transport Layer
              Security (TLS), to establish a secure connection between your
              device and our servers. This encryption helps protect your payment
              details during transmission, making it difficult for unauthorized
              parties to intercept or access the information.{' '}
            </li>

            <li>
              <strong>Payment Processors: </strong> We partner with reputable
              and trusted payment processors to handle the processing of your
              payments. These payment processors are compliant with Payment Card
              Industry Data Security Standard (PCI DSS) requirements, which are
              designed to protect the security of cardholder data.
            </li>

            <li>
              <strong>Limited Data Storage: </strong> We minimize the storage of
              sensitive payment details. Once your payment is processed, we
              securely store only the necessary information required for
              record-keeping, compliance, and customer support purposes. We
              adhere to data retention practices to ensure that payment details
              are not stored longer than necessary.
            </li>

            <li>
              <strong>Internal Access Controls: </strong> We have strict access
              controls in place to limit access to payment details within our
              organization. Only authorized personnel with a legitimate need to
              access this information, such as for customer support or billing
              purposes, are granted access. We regularly review and audit our
              internal access controls to ensure compliance and minimize the
              risk of unauthorized access.
            </li>

            <li>
              <strong>Compliance with Regulations: </strong> We comply with
              applicable laws and regulations related to the handling and
              protection of payment details. This includes compliance with
              relevant data protection and privacy laws, such as the General
              Data Protection Regulation (GDPR) where applicable, and
              industry-specific regulations. <br />
              It is important to note that while we employ these security
              measures to protect your payment details, no method of
              transmission or storage over the internet is 100% secure. However,
              we continuously review and update our security practices to
              mitigate risks and maintain the highest possible level of
              security. <br />
              We recommend reviewing our complete Privacy Policy and
              <Link className='ms-1' href='/terms-of-use'>
                Terms of Service
              </Link>{' '}
              to understand the specific details regarding payment protection
              and data security practices.
            </li>
          </ul>

          <h4>Data Security: </h4>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information from unauthorized access, loss,
            misuse, or alteration. Despite our efforts, no security system is
            completely impenetrable, and we cannot guarantee absolute security.
          </p>

          <h4>Data Retention: </h4>
          <p>
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
          </p>

          <h4>Your Rights: </h4>
          <p>
            You have certain rights regarding your personal information,
            including the right to access, correct, or delete your information.
            If you would like to exercise any of these rights, please contact us
            using the information provided below.
          </p>

          <h4>Updates to this Privacy Policy: </h4>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. We will notify you
            of any material changes by posting the updated Privacy Policy on our
            website or through other appropriate channels.
          </p>

          <h4>Contact Us: </h4>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our privacy practices, please contact us at:
            <a className='ms-1' href='mailto:info@eballan.com'>
              info@eballan.com
            </a>
          </p>
        </div>
      )}

      {active === 'Refund Policy' && (
        <div className='space-y-3'>
          <h1 className='text-2xl font-bold'>Refund Policy</h1>
          <p>
            Effective Date: <strong>08 Aug, 2023</strong>
          </p>

          <p>1.1 Change booking fee will charge $10 </p>
          <p>1.2 Cancellation fee $10 </p>
          <p>1.3 No show $30 </p>

          <p>
            1.4 Refunding the payment will take 48 hours of working time, and
            the commission of the agent cannot be refunded.
          </p>
          <p>
            1.5 If less than 24 hours before departure, the ticket cannot be
            cancelled or changed
          </p>

          <h4>Introduction </h4>
          <p>
            This Refund Policy outlines the terms and conditions governing
            refunds for online flight bookings made through our platform
            eBallan. By using our services and making flight bookings, you agree
            to comply with this policy.
          </p>

          <h4> Eligibility for Refunds</h4>
          <p>
            2.1. Cancellation by the Customer: Customers are eligible for a
            refund if they cancel their flight booking in accordance with the
            terms and conditions specified during the booking process and as
            outlined in this policy.
            <br />
            2.2. Cancellation by the Airline: In the event of flight
            cancellations or significant schedule changes initiated by the
            airline, customers may be eligible for a refund. The refund
            eligibility will be subject to the airline&apos;s refund policies
            and procedures, which vary by carrier.
          </p>

          <h4> Refund Process</h4>
          <p>
            3.1. Refund Requests: All refund requests must be submitted to our
            customer support team via the designated channels provided on our
            website or mobile application. Customers should provide the
            necessary booking details, including the booking reference number,
            passenger information, and the reason for the refund request.
            <br />
            3.2. Documentation: Customers may be required to submit supporting
            documentation, such as the airline&apos;s cancellation notice,
            medical certificates, or any other relevant documents, depending on
            the circumstances surrounding the refund request.
            <br />
            3.3. Refund Evaluation: Each refund request will be evaluated based
            on the specific circumstances and the applicable terms and
            conditions. We reserve the right to assess the eligibility for a
            refund and communicate the decision to the customer in a timely
            manner.
          </p>

          <h4> Refund Processing</h4>
          <p>
            4.1. Refund Method: Refunds will be processed using the original
            payment method used during the booking process. In certain cases,
            alternative refund methods may be offered at our discretion.
            <br />
            4.2. Timeframe: The refund processing time may vary depending on
            several factors, including but not limited to the airline&apos;s
            refund processing time, payment gateway procedures, and any
            applicable administrative requirements. We will make reasonable
            efforts to process refunds promptly and keep customers informed of
            the progress.
            <br />
            4.3. Refund Fees: In some cases, refund processing fees or
            administration charges may apply. These fees, if applicable, will be
            clearly communicated to the customer before the refund is processed.
          </p>
          <h4>Non-Refundable Items and Services</h4>
          <p>
            5.1. Non-refundable Airfares: Some airfares, particularly those
            labeled as non-refundable during the booking process, may not be
            eligible for a refund. Customers should carefully review the fare
            conditions and cancellation policies provided by the airline before
            making a booking.
            <br />
            5.2. Additional Services: Additional services, such as seat
            upgrades, travel insurance, or other ancillary products, may have
            separate refund policies and may be subject to specific terms and
            conditions. Customers should refer to the respective terms and
            conditions associated with such services.
          </p>

          <h4>Changes to the Refund Policy</h4>
          <p>
            We reserve the right to modify or update this Refund Policy at any
            time without prior notice. The revised policy will be effective upon
            posting on our website or mobile application. Customers are
            encouraged to review the refund policy periodically to stay informed
            about any changes.
          </p>
        </div>
      )}
    </div>
  )
}
