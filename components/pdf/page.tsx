'use client'

import React from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from '@react-pdf/renderer'
import { IPdf } from '@/types'
import DateTime from '@/lib/dateTime'

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Bold.ttf', 700: true },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    fontSize: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1px solid #000',
  },
  subheader: {
    marginBottom: 5,
  },
  table: {
    marginBottom: 5,
    marginTop: 5,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid #bfbfbf',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    borderBottom: '1px solid #bfbfbf',
  },
  tableCell: {
    display: 'flex',
    flexDirection: 'column',
    width: '25%',
    border: '1px solid #bfbfbf',
    borderTop: 'none',
    borderBottom: 'none',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  bold: { fontFamily: 'Open Sans', fontWeight: 700 },
  uppercase: { textTransform: 'uppercase' },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
  },
  flexBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export const tempData = {
  id: 'z-4R4uMItVkfgN-VWV2Js',
  reservationId: 90689,
  pnrNumber: 'AMFC05',
  status: 'BOOKED',
  adult: 1,
  child: 0,
  infant: 1,
  phone: '615301507',
  paymentMethod: 'hormuud',
  flightId: 'wIu7xMdvTIzEPjPFHSr0Y',
  flight: {
    id: 'wIu7xMdvTIzEPjPFHSr0Y',
    segmentNumber: 1,
    ticketTypeId: 1,
    flightRouteId: 6520,
    flightScheduleId: 4637,
    departureDate: '2023-11-29 08:30:00',
    arrivalDate: '2023-11-29 09:45:00',
    fromCityName: 'Mogadishu',
    toCityName: 'Kismayo',
    fromAirportName: 'Aden Adde International Airport ',
    toAirportName: 'Kismayo Airport',
    fromCityCode: 'MGQ',
    toCityCode: 'KMU',
    fromCountryName: 'SOMALIA',
    toCountryName: 'SOMALIA',
    fromCountryId: 196,
    toCountryId: 196,
    fromCountryIsoCode3: 'SOM',
    toCountryIsoCode3: 'SOM',
    adultNumberOfSeatsAvailable: 54,
    childNumberOfSeatsAvailable: 54,
    airlineId: 'Gg_g7AOAVu4tTZV8DfY_W',
    airline: {
      name: 'Maandeeq Airline',
      logo: 'https://play-lh.googleusercontent.com/LvTFglVj7TKUmB-Z687GuF-3cNQZOTNGTOYRmwWRe1rcTOwCi28OYkasItcbRpgCeg',
      api: 'maandeeqair',
      id: 'Gg_g7AOAVu4tTZV8DfY_W',
    },
  },
  passengers: [
    {
      id: 'WAzcKfwseXAQqJdKUKyvZ',
      passengerTitle: '1',
      firstName: 'Abukar',
      secondName: 'Abdulahi',
      lastName: 'Mohamed',
      country: 'ETHIOPIA',
      countryId: 68,
      sex: 'Male',
      dob: '1995-10-10',
      passengerType: 'Adult',
      reservationId: 'z-4R4uMItVkfgN-VWV2Js',
    },
    {
      id: 'JLo4E5mCbICmNKReR1qyC',
      passengerTitle: '4',
      firstName: 'Ahmed',
      secondName: 'Samow',
      lastName: 'Mohamed',
      country: 'SOMALIA',
      countryId: 196,
      sex: 'Male',
      dob: '2023-05-05',
      passengerType: 'Infant',
      reservationId: 'z-4R4uMItVkfgN-VWV2Js',
    },
  ],
  prices: [
    {
      id: '_jM9iKYh1saSfkKUPC6_3',
      passenger: 'Adult',
      commission: 20,
      fare: 120,
      baggageWeight: 25,
      handCarryWeight: 7,
      totalPrice: 140,
      reservationId: 'z-4R4uMItVkfgN-VWV2Js',
    },
    {
      id: 'e-NOkxUn_-aME6pKnibga',
      passenger: 'Infant',
      commission: 0,
      fare: 20,
      baggageWeight: 25,
      handCarryWeight: 7,
      totalPrice: 20,
      reservationId: 'z-4R4uMItVkfgN-VWV2Js',
    },
  ],
}

const COLOR = {
  primary: `#5e17eb`,
  secondary: `#ffa500`,
}

const getTitle = (n: string) => {
  if (n === '1') {
    return 'Mr. '
  } else if (n === '2') {
    return 'Mrs. '
  } else if (n === '3') {
    return 'Chd. '
  } else if (n === '4') {
    return 'Inf. '
  } else return ''
}

export default function PdfGenerator({ data }: { data: IPdf }) {
  // data = tempData

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View
          style={{
            width: 181,
            height: 42,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Image
            src={window.location.origin + '/ticket-logo.jpg'}
            style={{ width: 181, height: 42 }}
            // @ts-ignore
            alt='default'
          />
        </View>

        <View style={styles.section}>
          <View style={{ marginBottom: 50 }}>
            <View style={styles.flexBetween}>
              <Text style={styles.flex}>
                <Image
                  src={window.location.origin + '/circle.png'}
                  style={{ width: 8, height: 8 }}
                  // @ts-ignore
                  alt='default'
                />

                <Text style={{ color: 'green' }}>
                  {' '}
                  Your booking is confirmed
                </Text>
              </Text>
              <Text
                style={{
                  color: COLOR.primary,
                  fontFamily: 'Open Sans',
                  fontWeight: 700,
                }}
              >
                {data?.reservationId} - {data?.pnrNumber}
              </Text>
            </View>
            <View style={styles.flexBetween}>
              <Text>Wishing you a happy journey</Text>
              <Text>Booking reference</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text
                  style={{
                    ...styles.subheader,
                    ...styles.bold,
                    ...styles.uppercase,
                  }}
                >
                  Passenger Type
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text
                  style={{
                    ...styles.subheader,
                    ...styles.bold,
                    ...styles.uppercase,
                  }}
                >
                  Name
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text
                  style={{
                    ...styles.subheader,
                    ...styles.bold,
                    ...styles.uppercase,
                  }}
                >
                  Nationality
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text
                  style={{
                    ...styles.subheader,
                    ...styles.bold,
                    ...styles.uppercase,
                  }}
                >
                  Sex
                </Text>
              </View>
            </View>
            {data?.passengers?.map((item, i: number) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text>{item?.passengerType}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {getTitle(item?.passengerTitle)} {item?.firstName}{' '}
                    {item?.secondName} {item?.lastName}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item?.country}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item?.sex}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottom: '1px solid black',
                marginBottom: 10,
              }}
            >
              <Text style={styles.flex}>
                <Image
                  src={window.location.origin + '/from.png'}
                  style={{ width: 10, height: 10 }}
                  // @ts-ignore
                  alt='default'
                />{' '}
                Departure from
                <Text style={styles.bold}> {data?.flight?.fromCityName} </Text>(
                {data?.flight?.airline?.name})
              </Text>
              <Text style={styles.flex}>
                <Image
                  src={window.location.origin + '/to.png'}
                  style={{ width: 10, height: 10 }}
                  // @ts-ignore
                  alt='default'
                />{' '}
                Arrival to
                <Text style={styles.bold}> {data?.flight?.toCityName} </Text>(
                {data?.flight?.airline?.name})
              </Text>
            </View>

            <View style={styles.flexBetween}>
              <Text style={styles.flex}>
                <Text style={styles.bold}>
                  {' '}
                  {DateTime(data?.flight?.departureDate).format(
                    'DD MMM YYYY HH:mm'
                  )}{' '}
                </Text>
              </Text>
              <Text style={styles.flex}>
                <Text style={styles.bold}>
                  {' '}
                  {DateTime(data?.flight?.arrivalDate).format(
                    'DD MMM YYYY HH:mm'
                  )}{' '}
                </Text>
              </Text>
            </View>

            <View style={styles.flexBetween}>
              <Text style={styles.flex}>
                <Text style={styles.bold}> {data?.flight?.fromCityCode} </Text>
              </Text>
              <Text style={styles.flex}>
                <Text style={styles.bold}> {data?.flight?.toCityCode} </Text>
              </Text>
            </View>

            <View style={styles.flexBetween}>
              <Text style={styles.flex}>
                <Text> {data?.flight?.fromAirportName} </Text>
              </Text>
              <Text style={styles.flex}>
                <Text> {data?.flight?.toAirportName} </Text>
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            padding: 10,
          }}
        >
          <Text style={styles.bold}>Flight Info:</Text>
          <Text>
            Rules Flight 1: Passengers must report for check in three hours
            before flight departure Passengers failing to report for check in on
            time will not be accepted for travel and will forfeit their bookings
          </Text>
          <Text>
            Change booking fee will charge $10 Cancellation fee $10 No show $30
            Ticket valid for three-month Baggage Allowance is 30kg For All
            international flights and 15kg for all Local If less than 24 hours
            before departure, the ticket cannot be cancelled or changed
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.flex}>
            <Text>Payment reference:</Text>
            <Text style={styles.bold}>{data?.phone}</Text>
          </View>
          <View style={styles.flex}>
            <Text>Payment method:</Text>
            <Text style={styles.bold}>{data?.paymentMethod}</Text>
          </View>
          <View style={styles.flex}>
            <Text>Booked:</Text>
            <Text style={styles.bold}>
              {DateTime(data?.createdAt).format('DD MMM YYYY HH:mm')}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={window.location.origin + '/qrcode.png'}
            style={{ width: 70, height: 70 }}
            // @ts-ignore
            alt='default'
          />
        </View>
      </Page>
    </Document>
  )
}
