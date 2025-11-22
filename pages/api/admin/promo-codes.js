import dbConnect from '../../../../lib/database'
import { requireAuth } from '../../../../lib/auth'
import PromoCode from '../../../../models/PromoCode'
import User from '../../../../models/User'

export default async function handler(req, res) {
  try {
    const user = await requireAuth(req)
    await dbConnect()

    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    switch (req.method) {
      case 'GET':
        const promoCodes = await PromoCode.find({})
          .populate('createdBy', 'username firstName lastName')
          .populate('usedBy', 'username firstName lastName')
          .sort({ createdAt: -1 })
        res.status(200).json(promoCodes)
        break

      case 'POST':
        const { code, description, duration, expiresAt } = req.body
        
        const existingCode = await PromoCode.findOne({ code: code.toUpperCase() })
        if (existingCode) {
          return res.status(400).json({ error: 'Promo code already exists' })
        }

        const promoCode = new PromoCode({
          code: code.toUpperCase(),
          description,
          duration,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          createdBy: user._id
        })

        await promoCode.save()
        
        const populatedCode = await PromoCode.findById(promoCode._id)
          .populate('createdBy', 'username firstName lastName')

        res.status(201).json(populatedCode)
        break

      case 'DELETE':
        const { id } = req.body
        await PromoCode.findByIdAndDelete(id)
        res.status(200).json({ message: 'Promo code deleted' })
        break

      default:
        res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}