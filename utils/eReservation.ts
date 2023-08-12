export interface ReservationProp {
  reservationNo: string
  departureCity: string
  departureDate: string
  departureTime: string
  departureCityCode: string
  departureAirport: string

  arrivalCity: string
  arrivalDate: string
  arrivalTime: string
  arrivalCityCode: string
  arrivalAirport: string

  airline: string

  paymentMobile: string
  paymentMethod: string
  createdAt: string

  passengers: {
    passengerType?: string
    passengerTitle?: string
    name?: string
    sex?: string
  }[]
}

export const eReservation = ({
  reservationNo,
  departureCity,
  departureDate,
  departureTime,
  departureCityCode,
  departureAirport,
  arrivalCity,
  arrivalDate,
  arrivalTime,
  arrivalCityCode,
  arrivalAirport,
  airline,
  paymentMobile,
  paymentMethod,
  createdAt,
  passengers,
}: ReservationProp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reservation Ticket</title>
    </head>
    <body
      style="
        color: rgb(89, 89, 89);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      "
    >
      <div
        class="container"
        style="max-width: 720px; margin-left: auto; margin-right: auto"
      >
        <img
          src="https://raw.githubusercontent.com/ahmedibradotcom/eballan/main/public/logo.png"
          alt=""
          class="img-fluid"
          style="width: 120px; padding-top: 10px; padding-bottom: 10px"
        />
  
        <div
          class="box border mb-20"
          style="
            width: 100%;
            height: auto;
            padding: 10px;
            border: 1px solid #111;
            margin-bottom: 20px;
          "
        >
          <div
            class="flex mb-20"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: row;
              margin-bottom: 30px;
            "
          >
            <div>
              <div
                style="display: flex; align-items: center; color: green"
                class="text-success"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewbox="0 0 512 512"
                >
                  <path
                    fill="green"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                  ></path>
                </svg>
                <label
                  class="text-success ml-5"
                  style="color: green; margin-left: 5px"
                >
                  Your booking is confirmed
                </label>
              </div>
              <label
                class="text-primary italic text-sm"
                style="font-style: italic; color: #5e17eb; font-size: 0.8rem"
                >Wishing you a happy journey
              </label>
            </div>
            <div>
              <strong class="text-primary" style="color: #5e17eb"
                >${reservationNo}</strong
              >
              <br />
              <label> Booking reference</label>
            </div>
          </div>
  
          <div class="passenger">
            <table style="width: 100%; border-collapse: collapse">
              <thead>
                <tr>
                  <th
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                      background-color: #f2f2f2;
                    "
                  >
                    Passenger Type
                  </th>
                  <th
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                      background-color: #f2f2f2;
                    "
                  >
                    Title
                  </th>
                  <th
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                      background-color: #f2f2f2;
                    "
                  >
                    Name
                  </th>
                  <th
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                      background-color: #f2f2f2;
                    "
                  >
                    Sex
                  </th>
                </tr>
              </thead>
              <tbody>
                ${passengers
                  ?.map(
                    (item, i) =>
                      `
                <tr key={!${i}}>
                  <td
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    ${item?.passengerType}
                  </td>
                  <td
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    ${item?.passengerTitle}
                  </td>
                  <td
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    ${item?.name}
                  </td>
                  <td
                    style="
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #ddd;
                    "
                  >
                    ${item?.sex}
                  </td>
                </tr>
                
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
  
        <div
          class="box border bg-primary text-white border-bottom-none"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: auto;
            padding: 10px;
            border: 1px solid #111;
            background-color: #5e17eb;
            color: white;
            border-bottom: none;
          "
        >
          <div style="display: flex; align-items: center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewbox="0 0 640 512"
            >
              <path
                fill="white"
                d="M381 114.9L186.1 41.8c-16.7-6.2-35.2-5.3-51.1 2.7L89.1 67.4C78 73 77.2 88.5 87.6 95.2l146.9 94.5L136 240 77.8 214.1c-8.7-3.9-18.8-3.7-27.3 .6L18.3 230.8c-9.3 4.7-11.8 16.8-5 24.7l73.1 85.3c6.1 7.1 15 11.2 24.3 11.2H248.4c5 0 9.9-1.2 14.3-3.4L535.6 212.2c46.5-23.3 82.5-63.3 100.8-112C645.9 75 627.2 48 600.2 48H542.8c-20.2 0-40.2 4.8-58.2 14L381 114.9zM0 480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32z"
              ></path>
            </svg>
            <label class="ml-5" style="margin-left: 5px"
              >Departure from <strong>${departureCity}</strong> (${airline})
            </label>
          </div>
  
          <div style="display: flex; align-items: center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 640 512"
            >
              <path
                fill="white"
                d="M.3 166.9L0 68C0 57.7 9.5 50.1 19.5 52.3l35.6 7.9c10.6 2.3 19.2 9.9 23 20L96 128l127.3 37.6L181.8 20.4C178.9 10.2 186.6 0 197.2 0h40.1c11.6 0 22.2 6.2 27.9 16.3l109 193.8 107.2 31.7c15.9 4.7 30.8 12.5 43.7 22.8l34.4 27.6c24 19.2 18.1 57.3-10.7 68.2c-41.2 15.6-86.2 18.1-128.8 7L121.7 289.8c-11.1-2.9-21.2-8.7-29.3-16.9L9.5 189.4c-5.9-6-9.3-14-9.3-22.5zM32 448H608c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32zm96-80a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm128-16a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
              />
            </svg>
            <label class="ml-5" style="margin-left: 5px"
              >Arrival to <strong>${arrivalCity}</strong> (${airline})
            </label>
          </div>
        </div>
        <div
          class="box border mb-20"
          style="
            width: 100%;
            height: auto;
            padding: 10px;
            border: 1px solid #111;
            margin-bottom: 20px;
          "
        >
          <div
            class="flex mb-20"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: row;
              margin-bottom: 30px;
            "
          >
            <div>
              <label>${departureDate}</label><br />
              <label><strong>${departureTime}</strong><br /> </label
              ><label><strong>${departureCityCode}</strong><br /> </label
              ><label class="text-sm" style="font-size: 0.8rem"
                >${departureAirport}</label
              >
            </div>
            <div class="text-right" style="text-align: right">
              <label>${arrivalDate}</label><br />
              <label><strong>${arrivalTime}</strong><br /> </label
              ><label><strong>${arrivalCityCode}</strong><br /> </label
              ><label class="text-sm" style="font-size: 0.8rem"
                >${arrivalAirport}</label
              >
            </div>
          </div>
        </div>
  
        <div
          class="box mb-20"
          style="width: 100%; height: auto; padding: 10px; margin-bottom: 30px"
        >
          <label> <strong>Flight Info:</strong> </label> <br />
          <label> <strong>Flight Rules:</strong> </label> <br />
          <p>
            Rules Flight 1: Passengers must report for check in three hours before
            flight departure Passengers failing to report for check in on time
            will not be accepted for travel and will forfeit their bookings
          </p>
          <p>
            Change booking fee will charge $10 Cancellation fee $10 No show $30
            Ticket valid for three-month Baggage Allowance is 30kg For All
            international flights and 15kg for all Local If less than 24 hours
            before departure, the ticket cannot be cancelled or changed
          </p>
        </div>
  
        <div
          class="box mt-20 mb-20 border"
          style="
            width: 100%;
            height: auto;
            padding: 10px;
            border: 1px solid #111;
            margin-top: 30px;
            margin-bottom: 30px;
          "
        >
          <label>Payment reference: <strong>${paymentMobile}</strong><br /> </label
          ><label>Payment method: <strong>${paymentMethod}</strong><br /> </label
          ><label>Booked ${createdAt} </label>
        </div>
  
        <div
          class="box text-right"
          style="width: 100%; height: auto; padding: 10px; text-align: right"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/640px-QR_code_for_mobile_English_Wikipedia.svg.png"
            alt="qrcode"
            class="img-fluid"
            style="width: 80px"
          />
        </div>
  
        <div class="box" style="width: 100%; height: auto; padding: 10px">
          <label><strong>Contact Us:</strong><br /> </label
          ><label>WhatsApp: <strong>+251 123456789</strong><br /> </label
          ><label
            >Email: <a href="mailto:info@eballan.com">info@eballan.com</a
            ><br /> </label
          ><label
            >Website: <a href="https://eballan.com">https://eballan.com</a>
          </label>
        </div>
      </div>
    </body>
  </html>
  
    `
}
