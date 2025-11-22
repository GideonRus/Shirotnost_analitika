import { useState } from 'react'

export default function Subscription({ user, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (plan) => {
    setLoading(true)
    try {
      const response = await fetch('/api/subscription/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan })
      })
      
      const data = await response.json()
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank')
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (user.subscription !== 'expired' && user.subscription !== 'trial') {
    return null
  }

  const daysLeft = user.subscription === 'trial' 
    ? Math.ceil((new Date(user.trialEnds) - new Date()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-yellow-400">
          {user.subscription === 'trial' ? `Пробный период: ${daysLeft} дней осталось` : 'Подписка истекла'}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-yellow-400">Требуется действие</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">Месячная подписка</h4>
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">ПОПУЛЯРНО</span>
          </div>
          <p className="text-2xl font-bold text-white mb-2">200 ₽</p>
          <p className="text-sm text-gray-400 mb-4">в месяц</p>
          <ul className="text-sm text-gray-400 space-y-2 mb-4">
            <li>• Полный доступ к портфелю</li>
            <li>• Отслеживание дивидендов и купонов</li>
            <li>• Расширенная аналитика</li>
          </ul>
          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all font-medium"
          >
            {loading ? 'Обработка...' : 'Оформить подписку'}
          </button>
        </div>
        
        <div className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">ВЫГОДНО</span>
          </div>
          <h4 className="font-semibold text-white mb-4">Годовая подписка</h4>
          <p className="text-2xl font-bold text-white mb-2">1 500 ₽</p>
          <p className="text-sm text-gray-400 mb-1">экономьте 300 ₽ в год</p>
          <p className="text-sm text-cyan-400 mb-4">≈ 125 ₽ в месяц</p>
          <ul className="text-sm text-gray-400 space-y-2 mb-4">
            <li>• Все функции месячной подписки</li>
            <li>• Приоритетная поддержка</li>
            <li>• Дополнительные отчеты</li>
          </ul>
          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all font-medium"
          >
            {loading ? 'Обработка...' : 'Выбрать годовой план'}
          </button>
        </div>
      </div>
    </div>
  )
}