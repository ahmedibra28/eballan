import { Schema, model, models } from 'mongoose'

export interface IAirline {
  _id: Schema.Types.ObjectId
  name: string
  api: string
  status: 'active' | 'inactive'
  adultCommission: number
  childCommission: number
  infantCommission: number
  logo?: string
  username: string
  password: string
  createdAt?: Date
}

const airlineSchema = new Schema<IAirline>(
  {
    name: { type: String, required: true },
    api: { type: String, required: true },
    adultCommission: { type: Number, required: true },
    childCommission: { type: Number, required: true },
    infantCommission: { type: Number, required: true },
    logo: {
      type: String,
      default:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      required: true,
      default: 'active',
    },
  },
  { timestamps: true }
)

const Airline = models.Airline || model('Airline', airlineSchema)

export default Airline
