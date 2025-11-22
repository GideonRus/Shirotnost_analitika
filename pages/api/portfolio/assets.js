import dbConnect from '../../../lib/database'
import { requireAuth } from '../../../lib/auth'
import Asset from '../../../models/Asset'

export default async function handler(req, res) {
  try {
    const user = await requireAuth(req)
    await dbConnect()

    switch (req.method) {
      case 'GET':
        const assets = await Asset.find({ userId: user._id })
        res.status(200).json(assets)
        break

      case 'POST':
        if (user.subscription === 'expired') {
          return res.status(402).json({ error: 'Subscription required' })
        }

        const asset = new Asset({
          userId: user._id,
          ...req.body
        })
        await asset.save()
        res.status(201).json(asset)
        break

      default:
        res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}