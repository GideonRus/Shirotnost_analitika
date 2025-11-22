import dbConnect from '../../../lib/database'
import { requireAuth } from '../../../lib/auth'
import PromoCode from '../../../models/PromoCode'
import User from '../../../models/User'

export default async function handler(req, res) {
  try {
    const user = await requireAuth(req)
    await dbConnect()

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { code } = req.body

    // Ищем промокод
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      used: false 
    })

    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found or already used' })
    }

    // Проверяем срок действия
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return res.status(400).json({ error: 'Promo code has expired' })
    }

    // Обновляем подписку пользователя
    let subscriptionEnds = new Date()
    
    if (promoCode.duration === 0) {
      // Вечная подписка
      user.subscription = 'forever'
      user.subscriptionEnds = null
    } else {
      // Временная подписка
      subscriptionEnds.setMonth(subscriptionEnds.getMonth() + promoCode.duration)
      user.subscription = 'monthly'
      user.subscriptionEnds = subscriptionEnds
    }

    // Помечаем промокод как использованный
    promoCode.used = true
    promoCode.usedBy = user._id
    promoCode.usedAt = new Date()

    await Promise.all([user.save(), promoCode.save()])

    res.status(200).json({
      message: `Promo code activated! ${promoCode.duration === 0 ? 'Forever subscription activated!' : `Extended for ${promoCode.duration} months`}`,
      subscription: user.subscription,
      subscriptionEnds: user.subscriptionEnds
    })

  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}