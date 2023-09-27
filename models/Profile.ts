import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IProfile {
  _id: Schema.Types.ObjectId
  name?: string
  sex?: string
  image?: string
  address?: string
  mobile?: number
  passport?: string
  bio?: string
  user: Schema.Types.ObjectId

  agent: {
    businessCategory: string
    bankAccount: string
    businessLicense: string
  }

  createdAt?: Date
}

const profileSchema = new Schema<IProfile>(
  {
    name: String,
    image: String,
    address: String,
    mobile: Number,
    bio: String,
    passport: String,
    sex: { type: String, enum: ['Male', 'Female'], default: 'Male' },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    agent: {
      businessCategory: String,
      bankAccount: String,
      businessLicense: String,
    },
  },
  { timestamps: true }
)

const Profile = models.Profile || model('Profile', profileSchema)

export default Profile
