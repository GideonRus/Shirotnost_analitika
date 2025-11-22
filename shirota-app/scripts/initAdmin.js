import mongoose from 'mongoose'
import User from '../models/User.js'
import PromoCode from '../models/PromoCode.js'

const MONGODB_URI = process.env.MONGODB_URI

async function initAdmin() {
  if (!MONGODB_URI) {
    console.error('Please define MONGODB_URI environment variable')
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Создаем администратора (замените на ваш Telegram ID)
    const adminUser = await User.findOneAndUpdate(
      { telegramId: 'https://t.me/Yar_chin_skiy' }, // ЗАМЕНИТЕ НА ВАШ REAL TELEGRAM ID
      {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
        subscription: 'forever'
      },
      { upsert: true, new: true }
    )

    console.log('Admin user created/updated:', adminUser)

    // Создаем промокод для вечной подписки
    const foreverPromo = await PromoCode.findOneAndUpdate(
      { code: 'FOREVER123' },
      {
        description: 'Special forever subscription for the owner',
        duration: 0, // 0 = forever
        createdBy: adminUser._id
      },
      { upsert: true, new: true }
    )

    console.log('Forever promo code created:', foreverPromo.code)

    // Создаем несколько тестовых промокодов
    const samplePromoCodes = [
      { code: 'FREE1MONTH', duration: 1, description: '1 month free subscription' },
      { code: 'FREE3MONTHS', duration: 3, description: '3 months free subscription' },
      { code: 'FREE6MONTHS', duration: 6, description: '6 months free subscription' }
    ]

    for (const promo of samplePromoCodes) {
      await PromoCode.findOneAndUpdate(
        { code: promo.code },
        {
          ...promo,
          createdBy: adminUser._id
        },
        { upsert: true, new: true }
      )
      console.log(`Promo code created: ${promo.code}`)
    }

    console.log('Initialization completed!')
    process.exit(0)
  } catch (error) {
    console.error('Initialization error:', error)
    process.exit(1)
  }
}

initAdmin()