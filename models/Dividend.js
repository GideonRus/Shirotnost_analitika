import mongoose from 'mongoose'

const DividendSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountPerShare: Number,
  recordDate: Date,
  paymentDate: Date,
  status: {
    type: String,
    enum: ['expected', 'paid'],
    default: 'expected'
  },
  currency: {
    type: String,
    default: 'RUB'
  }
})

export default mongoose.models.Dividend || mongoose.model('Dividend', DividendSchema)