import { useState, useEffect } from 'react'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    description: '',
    duration: 1,
    expiresAt: ''
  })

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else {
      fetchPromoCodes()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPromoCodes = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/promo-codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setPromoCodes(data)
    } catch (error) {
      console.error('Error fetching promo codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPromoCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPromoCode)
      })

      if (response.ok) {
        const data = await response.json()
        setPromoCodes([data, ...promoCodes])
        setNewPromoCode({
          code: '',
          description: '',
          duration: 1,
          expiresAt: ''
        })
        alert('Промокод успешно создан!')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error creating promo code:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePromoCode = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот промокод?')) return

    try {
      const token = localStorage.getItem('token')
      await fetch('/api/admin/promo-codes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })
      
      setPromoCodes(promoCodes.filter(code => code._id !== id))
    } catch (error) {
      console.error('Error deleting promo code:', error)
    }
  }

  const updateUserSubscription = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, updates })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map(user => 
          user._id === userId ? updatedUser : user
        ))
        alert('Пользователь успешно обновлен!')
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-400">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-xl">
      <div className="border-b border-gray-700">
        <nav className="flex">
          <button
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'users' 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
          <button
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'promoCodes' 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('promoCodes')}
          >
            Промокоды
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'users' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Управление пользователями</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Пользователь</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Подписка</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Статус</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-400">@{user.username}</div>
                          <div className="text-xs text-gray-500">ID: {user.telegramId}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscription === 'forever' ? 'bg-green-500/20 text-green-400' :
                          user.subscription === 'monthly' ? 'bg-blue-500/20 text-blue-400' :
                          user.subscription === 'yearly' ? 'bg-purple-500/20 text-purple-400' :
                          user.subscription === 'trial' ? 'bg-cyan-500/20 text-cyan-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {user.subscription === 'forever' ? 'ВЕЧНО' :
                           user.subscription === 'monthly' ? 'МЕСЯЦ' :
                           user.subscription === 'yearly' ? 'ГОД' :
                           user.subscription === 'trial' ? 'ПРОБНЫЙ' :
                           'ИСТЕК'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.subscription === 'trial' && user.trialEnds && (
                          <div className="text-sm text-gray-400">
                            До: {new Date(user.trialEnds).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                        {user.subscriptionEnds && (
                          <div className="text-sm text-gray-400">
                            До: {new Date(user.subscriptionEnds).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                        {user.isAdmin && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                            АДМИН
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          className="text-sm bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:border-cyan-500 focus:outline-none"
                          value={user.subscription}
                          onChange={(e) => updateUserSubscription(user._id, { 
                            subscription: e.target.value 
                          })}
                        >
                          <option value="trial">Пробный</option>
                          <option value="monthly">Месячная</option>
                          <option value="yearly">Годовая</option>
                          <option value="forever">Вечная</option>
                          <option value="expired">Истекшая</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'promoCodes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Управление промокодами</h3>
            </div>

            {/* Форма создания промокодов */}
            <form onSubmit={createPromoCode} className="bg-gray-700/30 border border-gray-600 rounded-xl p-6 mb-6">
              <h4 className="font-medium text-white mb-4">Создать новый промокод</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Код *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPromoCode.code}
                    onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value})}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="SUMMER2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Длительность (месяцы) *
                  </label>
                  <select
                    required
                    value={newPromoCode.duration}
                    onChange={(e) => setNewPromoCode({...newPromoCode, duration: parseInt(e.target.value)})}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value={1}>1 месяц</option>
                    <option value={3}>3 месяца</option>
                    <option value={6}>6 месяцев</option>
                    <option value={0}>Вечно</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Описание
                  </label>
                  <input
                    type="text"
                    value={newPromoCode.description}
                    onChange={(e) => setNewPromoCode({...newPromoCode, description: e.target.value})}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Летняя акция 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Истекает (опционально)
                  </label>
                  <input
                    type="date"
                    value={newPromoCode.expiresAt}
                    onChange={(e) => setNewPromoCode({...newPromoCode, expiresAt: e.target.value})}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition-colors"
              >
                Создать промокод
              </button>
            </form>

            {/* Список промокодов */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Код</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Длительность</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Статус</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Использован</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {promoCodes.map(promoCode => (
                    <tr key={promoCode._id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-white">{promoCode.code}</div>
                        {promoCode.description && (
                          <div className="text-sm text-gray-400">{promoCode.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {promoCode.duration === 0 ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                            Вечно
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded-full">
                            {promoCode.duration} месяцев
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {promoCode.used ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                            Использован
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                            Активен
                          </span>
                        )}
                        {promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date() && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full ml-1">
                            Истек
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {promoCode.usedBy ? (
                          <div>
                            <div className="text-sm text-white">
                              {promoCode.usedBy.firstName} {promoCode.usedBy.lastName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(promoCode.usedAt).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Не использован</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {!promoCode.used && (
                          <button
                            onClick={() => deletePromoCode(promoCode._id)}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                          >
                            Удалить
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}