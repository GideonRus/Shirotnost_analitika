import dbConnect from '../../../lib/database'
import User from '../../../models/User'
import { generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { initData } = req.body
    
    // В реальном приложении нужно верифицировать данные от Telegram
    // Для демо используем упрощенную версию
    const urlParams = new URLSearchParams(initData)
    const userData = JSON.parse(urlParams.get('user'))
    
    let user = await User.findOne({ telegramId: userData.id.toString() })
    
    if (!user) {
      user = new User({
        telegramId: userData.id.toString(),
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        subscription: 'trial',
        trialEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
      await user.save()
    }

    const token = generateToken(user)
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        subscription: user.subscription,
        trialEnds: user.trialEnds,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}