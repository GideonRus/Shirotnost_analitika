import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET

export function generateToken(user) {
  return jwt.sign(
    { 
      userId: user._id,
      telegramId: user.telegramId 
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function requireAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Authentication required')
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw new Error('Invalid token')
  }

  const user = await User.findById(decoded.userId)
  if (!user) {
    throw new Error('User not found')
  }

  // Check subscription
  const now = new Date()
  if (user.subscription === 'trial' && user.trialEnds < now) {
    user.subscription = 'expired'
    await user.save()
  } else if (user.subscriptionEnds && user.subscriptionEnds < now) {
    user.subscription = 'expired'
    await user.save()
  }

  return user
}