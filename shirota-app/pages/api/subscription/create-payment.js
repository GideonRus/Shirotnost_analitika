import dbConnect from '../../../lib/database'
import { requireAuth } from '../../../lib/auth'
import User from '../../../models/User'

export default async function handler(req, res) {
  try {
    const user = await requireAuth(req)
    await dbConnect()

    const { plan } = req.body // 'monthly' or 'yearly'
    
    const prices = {
      monthly: 200,
      yearly: 1500
    }

    const paymentData = {
      receiver: process.env.YOOMONEY_WALLET,
      formcomment: `Подписка Широта: ${plan}`,
      short_dest: `Подписка Широта: ${plan}`,
      label: user._id.toString(),
      sum: prices[plan],
      quickpay_form: 'shop',
      targets: `Подписка Широта ${plan}`,
      paymentType: 'AC',
      successURL: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`
    }

    // В реальном приложении здесь будет интеграция с ЮKassa или другой платежной системой
    const paymentUrl = `https://yoomoney.ru/quickpay/confirm.xml?${new URLSearchParams(paymentData)}`

    res.status(200).json({ paymentUrl })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}