import { useState } from 'react'

export default function Portfolio({ assets, onUpdate, subscription }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAsset, setNewAsset] = useState({
    type: 'stock',
    ticker: '',
    name: '',
    quantity: '',
    averagePrice: ''
  })

  const handleAddAsset = async (e) => {
    e.preventDefault()
    if (subscription === 'expired') {
      alert('Необходима активная подписка')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/portfolio/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAsset)
      })

      if (response.ok) {
        setShowAddModal(false)
        setNewAsset({ type: 'stock', ticker: '', name: '', quantity: '', averagePrice: '' })
        onUpdate()
      }
    } catch (error) {
      console.error('Error adding asset:', error)
    }
  }

  const totalValue = assets.reduce((sum, asset) => sum + (asset.quantity * asset.averagePrice), 0)

  return (
    <div>
      {/* Статистика портфеля */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
          <div className="text-cyan-400 text-sm mb-1">Общая стоимость</div>
          <div className="text-2xl font-bold text-white">{totalValue.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-green-400 text-sm mb-1">Активы</div>
          <div className="text-2xl font-bold text-white">{assets.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="text-purple-400 text-sm mb-1">Акции</div>
          <div className="text-2xl font-bold text-white">
            {assets.filter(a => a.type === 'stock').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="text-orange-400 text-sm mb-1">Облигации</div>
          <div className="text-2xl font-bold text-white">
            {assets.filter(a => a.type === 'bond').length}
          </div>
        </div>
      </div>

      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Инвестиционный портфель</h2>
          <p className="text-gray-400 text-sm">Управление вашими активами</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={subscription === 'expired'}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Добавить актив</span>
        </button>
      </div>

      {/* Таблица активов */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Портфель пуст</h3>
            <p className="text-gray-400 mb-4">Добавьте ваши первые активы для отслеживания</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Добавить актив
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Актив</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Тип</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Количество</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Средняя цена</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <tr key={asset._id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          asset.type === 'stock' ? 'bg-cyan-400' : 
                          asset.type === 'bond' ? 'bg-orange-400' : 'bg-purple-400'
                        }`}></div>
                        <div>
                          <div className="font-medium text-white">{asset.ticker}</div>
                          <div className="text-gray-400 text-sm">{asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        asset.type === 'stock' ? 'bg-cyan-500/20 text-cyan-400' : 
                        asset.type === 'bond' ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {asset.type === 'stock' ? 'АКЦИЯ' : 
                         asset.type === 'bond' ? 'ОБЛИГАЦИЯ' : 'ETF'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white">{asset.quantity}</td>
                    <td className="py-4 px-6 text-white">{asset.averagePrice} ₽</td>
                    <td className="py-4 px-6 text-white font-semibold">
                      {(asset.quantity * asset.averagePrice).toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно добавления актива */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Добавить актив</h3>
            </div>
            
            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Тип актива</label>
                <select
                  value={newAsset.type}
                  onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="stock">Акция</option>
                  <option value="bond">Облигация</option>
                  <option value="etf">ETF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Тикер</label>
                <input
                  type="text"
                  required
                  value={newAsset.ticker}
                  onChange={e => setNewAsset({...newAsset, ticker: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="SBER"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Название</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Сбербанк"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Количество</label>
                  <input
                    type="number"
                    required
                    value={newAsset.quantity}
                    onChange={e => setNewAsset({...newAsset, quantity: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Цена</label>
                  <input
                    type="number"
                    required
                    value={newAsset.averagePrice}
                    onChange={e => setNewAsset({...newAsset, averagePrice: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}