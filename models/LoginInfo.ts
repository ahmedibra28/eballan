import { Schema, model, models } from 'mongoose'

export interface ILoginInfo {
  _id: Schema.Types.ObjectId
  accessToken: string
  accessTokenExpiry: Date
  refreshToken: string
  createdAt?: Date
}

const loginInfoSchema = new Schema<ILoginInfo>(
  {
    accessToken: { type: String, required: true },
    accessTokenExpiry: { type: Date, required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
)

const LoginInfo = models.LoginInfo || model('LoginInfo', loginInfoSchema)

export default LoginInfo
