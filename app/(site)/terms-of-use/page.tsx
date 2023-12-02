import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='mx-auto max-w-7xl space-y-3 p-2'>
      <h1 className='text-2xl font-bold'>Terms of Use</h1>
      <p>
        Effective Date: <strong>08 Aug, 2023</strong>
      </p>

      <p>
        Please read these Terms of Use (&quot;Terms&quot;) carefully as they
        govern your use of our online flight booking services. By accessing or
        using our website, mobile application, or any other platform provided by
        us (collectively referred to as the &quot;Service&quot;), you agree to
        be bound by these Terms. If you do not agree with any part of these
        Terms, please do not use the Service.
      </p>

      <h4>Service Description:</h4>
      <p>
        Our Service allows users to search for and book flights, view flight
        details, manage reservations, and access related travel information. The
        availability of flights and other travel services is subject to change
        and may be provided by third-party airlines or travel providers. We
        strive to provide accurate and up-to-date information, but we do not
        guarantee the availability, accuracy, or completeness of the information
        provided.
      </p>

      <h4>User Responsibilities:</h4>
      <ul>
        <li style={{ listStyle: 'none' }}>
          <strong>2.1 Eligibility:</strong> By using the Service, you represent
          and warrant that you are at least 18 years old or have the legal
          capacity to enter into binding contracts in your jurisdiction. If you
          are using the Service on behalf of a company or organization, you
          represent and warrant that you have the authority to bind such entity
          to these Terms.
        </li>

        <li style={{ listStyle: 'none' }}>
          <strong>2.2 Account Creation: </strong>Some features of the Service
          may require you to create an account. You are responsible for
          providing accurate and complete information during the registration
          process and maintaining the confidentiality of your account
          credentials. You agree to notify us immediately of any unauthorized
          use of your account.
        </li>

        <li style={{ listStyle: 'none' }}>
          <strong> 2.3 Compliance:</strong> You agree to use the Service in
          compliance with all applicable laws, regulations, and these Terms. You
          shall not use the Service for any unlawful, fraudulent, or
          unauthorized purposes.
        </li>
      </ul>

      <h4>Intellectual Property:</h4>
      <ul>
        <li style={{ listStyle: 'none' }}>
          <strong>3.1 Ownership:</strong> The Service and its content, including
          but not limited to text, graphics, images, logos, trademarks, and
          software, are owned by us or our licensors and are protected by
          intellectual property laws.
        </li>
        <li style={{ listStyle: 'none' }}>
          <strong>3.2 Restrictions:</strong> You may use the Service solely for
          personal, non-commercial purposes in accordance with these Terms. You
          shall not modify, copy, distribute, transmit, display, perform,
          reproduce, publish, license, create derivative works from, transfer,
          or sell any information, software, products, or services obtained from
          the Service without our prior written consent.
        </li>
      </ul>

      <h4>Privacy: </h4>
      <p>
        We respect your privacy and handle your personal information in
        accordance with our Privacy Policy. By using the Service, you consent to
        our collection, use, and disclosure of your personal information as
        described in the <Link href='/privacy-policy'>Privacy Policy</Link>.
      </p>

      <h4>Limitation of Liability: </h4>
      <p>
        To the fullest extent permitted by law, we shall not be liable for any
        direct, indirect, incidental, special, consequential, or exemplary
        damages, including but not limited to damages for loss of profits,
        goodwill, data, or other intangible losses arising out of or in
        connection with your use of the Service.
      </p>

      <h4>Indemnification: </h4>
      <p>
        You agree to indemnify and hold us harmless from and against any claims,
        liabilities, damages, losses, and expenses, including reasonable
        attorney&apos;s fees, arising out of or in connection with your use of
        the Service, violation of these Terms, or infringement of any rights of
        any third party.
      </p>

      <h4>Modifications to the Service: </h4>
      <p>
        We reserve the right to modify, suspend, or discontinue the Service, in
        whole or in part, at any time and without prior notice. We shall not be
        liable to you or any third party for any such modifications,
        suspensions, or discontinuations.
      </p>

      <h4>Governing Law and Dispute Resolution: </h4>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of Somali Federal Republic. Any disputes arising out of or relating
        to these Terms or the Service shall be resolved exclusively through
        binding arbitration in accordance with the rules of the Osman Public
        Notary. The arbitration shall take place in Somalia and shall be
        conducted in the English language.
      </p>

      <h4>General: </h4>
      <p>
        These Terms constitute the entire agreement between you and us regarding
        your use of the Service and supersede any prior agreements or
        understandings. Our failure to enforce any right or provision of these
        Terms shall not be deemed a waiver of such right or provision. If any
        provision of these Terms is found to be invalid or unenforceable, the
        remaining provisions shall continue to be valid and enforceable.
      </p>

      <h4>Contact Us:</h4>
      <p>
        If you have any questions, concerns, or feedback regarding these Terms,
        please contact us at <br />
        <a href='mailto:info@eballan.com'> info@eballan.com </a> <br />
        <a href='https://www.eballan.com'> https://www.eballan.com </a>
      </p>
    </div>
  )
}
