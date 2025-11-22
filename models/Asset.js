import mongoose from 'mongoose'

const AssetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['stock', 'bond', 'etf'],
    required: true
  },
  ticker: {
    type: String,
    required: true
  },
  name: String,
  quantity: {
    type: Number,
    required: true
  },
  averagePrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'RUB'
  },
  sector: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema)