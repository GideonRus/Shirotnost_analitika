import mongoose from 'mongoose'

const CouponSchema = new mongoose.Schema({
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

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)