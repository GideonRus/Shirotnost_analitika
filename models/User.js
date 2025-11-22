import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  subscription: {
    type: String,
    enum: ['trial', 'monthly', 'yearly', 'expired', 'forever'],
    default: 'trial'
  },
  trialEnds: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  },
  subscriptionEnds: Date,
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)