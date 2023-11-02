export interface LoginAirline {
  _id: string
  name: string
  api: string
  adultCommission: number
  childCommission: number
  infantCommission: number
  logo: string
  username: string
  password: string
  status: string
  createdAt: string
  updatedAt: string
  __v: number
  accessToken: string
}

export interface IFlight {
  prices: {
    passenger: string
    commission: number
    fare: number
    baggageWeight: number
    handCarryWeight: number
    totalPrice: number
  }[]
  flight: {
    segmentNumber: number
    ticketTypeId: number
    flightRouteId: number
    flightScheduleId: number
    departureDate: string
    arrivalDate: string
    fromCityName: string
    toCityName: string
    fromAirportName: string
    toAirportName: string
    fromCityCode: string
    toCityCode: string
    fromCountryName: string
    toCountryName: string
    fromCountryId: number
    toCountryId: number
    fromCountryIsoCode3: string
    toCountryIsoCode3: string
  }
  airline: {
    key: string
    name: string
    logo: string
  }
}
