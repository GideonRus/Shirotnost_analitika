import { useState } from 'react'

export default function PromoActivation({ onActivate }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const activatePromoCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/promo/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setCode('')
        if (onActivate) {
          onActivate()
        }
      } else {
        setMessage(data.error)
      }
    } catch (error) {
      setMessage('Error activating promo code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-3">Активировать промокод</h3>
      <form onSubmit={activatePromoCode} className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Введите промокод"
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all font-medium"
        >
          {loading ? 'Активация...' : 'Активировать'}
        </button>
      </form>
      {message && (
        <div className={`mt-3 text-sm ${
          message.includes('activated') ? 'text-green-400' : 'text-red-400'
        }`}>
          {message}
        </div>
      )}
      <div className="mt-3 text-xs text-gray-400">
        Доступные промокоды: FREE1MONTH, FREE3MONTHS, FREE6MONTHS, FOREVER123
      </div>
    </div>
  )
}