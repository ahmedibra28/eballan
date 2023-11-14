export interface IUser {
  id?: string
  email: string
  name: string
  image?: string | null
  mobile?: number | null
  address?: string | null
  bio?: string | null
  password: string
  confirmed?: boolean
  blocked?: boolean
  resetPasswordToken?: string | null
  resetPasswordExpire?: bigint | number | null
  createdAt?: Date | string
  updatedAt?: Date | string
  roleId: number
  role: IRole
}

export interface IRole {
  id?: string
  name: string
  type: string
  description?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  users?: IUser[]
  permissions?: IPermission[]
  clientPermissions?: IClientPermission[]
}

export interface IPermission {
  id?: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  route: string
  description?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  role?: IRole
}

export interface IClientPermission {
  id?: string
  name: string
  sort: number
  menu: string
  path: string
  description?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  role?: IRole
}

export interface ICity {
  id: number
  name: string
  code: string
  countryId: number
  countryName: string
  isActive: boolean
  isAssigned: boolean
}

export interface IAirline {
  id: string
  name: string
  api: string
  adultCommission: number
  childCommission: number
  infantCommission: number
  logo: string
  username: string
  password: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  updatedAt: Date
  createdById: string
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
    adultNumberOfSeatsAvailable: number
    childNumberOfSeatsAvailable: number
  }
  airline: {
    key: string
    name: string
    logo: string
  }
  adult: number
  child: number
  infant: number
}

export interface ISearchFlight {
  date: string
  adult: number
  child: number
  infant: number
  fromId: number
  toId: number
}

export interface IPassengerTitle {
  id: number
  description: 'MRS' | 'MR' | 'CHD' | 'INF'
  isActive: boolean
}

export interface IPassengerType {
  id: number
  type: 'Adult' | 'Child' | 'Infant'
  ageLimit: number
  isActive: boolean
}

export interface ICountry {
  id: number
  name: string
  isoCode: string
  friendlyName: string
  isoCode3: string
  isActive: boolean
  isAssigned: boolean
}

export interface IPassenger {
  adult: {
    passengerTitle: string
    firstName: string
    secondName: string
    lastName: string
    country: string
    countryId: number
    sex: string
    dob: string
    id: string
  }[]
  child: {
    passengerTitle: string
    firstName: string
    secondName: string
    lastName: string
    country: string
    countryId: number
    sex: string
    dob: string
    id: string
  }[]
  infant: {
    passengerTitle: string
    firstName: string
    secondName: string
    lastName: string
    country: string
    countryId: number
    sex: string
    dob: string
    id: string
  }[]
  contact: {
    email: string
    phone: string
  }
}

export type IInsertToDB = {
  passengers: {
    passengerTitle: string
    firstName: string
    secondName: string
    lastName: string
    country: string
    countryId: number
    sex: string
    dob: string
    id: string
    passengerType: string
  }[]
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
    adultNumberOfSeatsAvailable: number
    childNumberOfSeatsAvailable: number
    airlineId: string
  }
  adult: number
  child: number
  infant: number
  phone: string
  paymentMethod: string
  reservationId: number
  pnrNumber: string
  status: string
  createdById: string
  dealerCode?: string
}

export type IPdf = {
  id: string
  reservationId: number
  pnrNumber: string
  status: string
  adult: number
  child: number
  infant: number
  phone: string
  paymentMethod: string
  flightId: string
  flight: {
    id: string
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
    adultNumberOfSeatsAvailable: number
    childNumberOfSeatsAvailable: number
    airlineId: string
    airline: {
      name: string
      logo: string
      api: string
      id: string
    }
  }
  passengers: {
    id: string
    passengerTitle: string
    firstName: string
    secondName: string
    lastName: string
    country: string
    countryId: number
    sex: string
    dob: string
    passengerType: string
  }[]
  prices: {
    id: string
    passenger: string
    commission: number
    fare: number
    baggageWeight: number
    handCarryWeight: number
    totalPrice: number
  }[]
  createdAt?: Date
  createdById?: string
  createdBy?: {
    id: string
    name: string
    image?: string
  }
}
