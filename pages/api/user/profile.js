import dbConnect from '../../../lib/database'
import { requireAuth } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await requireAuth(req)
    
    res.status(200).json({
      id: user._id,
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      subscription: user.subscription,
      trialEnds: user.trialEnds,
      subscriptionEnds: user.subscriptionEnds,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}