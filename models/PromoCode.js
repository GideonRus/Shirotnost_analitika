import mongoose from 'mongoose'

const PromoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  duration: {
    type: Number, // months, 0 = forever
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date
})

export default mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema)