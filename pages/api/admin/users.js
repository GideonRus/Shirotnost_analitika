import dbConnect from '../../../../lib/database'
import { requireAuth } from '../../../../lib/auth'
import User from '../../../../models/User'

export default async function handler(req, res) {
  try {
    const user = await requireAuth(req)
    await dbConnect()

    // Проверяем права администратора
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    switch (req.method) {
      case 'GET':
        const users = await User.find({}).select('-__v').sort({ createdAt: -1 })
        res.status(200).json(users)
        break

      case 'PUT':
        const { userId, updates } = req.body
        const updatedUser = await User.findByIdAndUpdate(
          userId, 
          updates, 
          { new: true }
        ).select('-__v')
        res.status(200).json(updatedUser)
        break

      default:
        res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}