import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Subscription from '../components/Subscription'
import Portfolio from '../components/Portfolio'
import AdminPanel from '../components/AdminPanel'
import PromoActivation from '../components/PromoActivation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [assets, setAssets] = useState([])
  const [activeTab, setActiveTab] = useState('portfolio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    fetchUser()
    fetchAssets()
  }, [])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/portfolio/assets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const assetsData = await response.json()
      setAssets(assetsData)
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Загрузка платформы...</div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'portfolio', name: 'Портфель', icon: '📊' },
    { id: 'dividends', name: 'Дивиденды', icon: '💰' },
    { id: 'coupons', name: 'Купоны', icon: '🎫' },
    { id: 'analytics', name: 'Аналитика', icon: '🔍' }
  ]

  if (user.isAdmin) {
    tabs.push({ id: 'admin', name: 'Админ', icon: '⚡' })
  }

  return (
    <>
      <Head>
        <title>Широта | Панель управления</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-gray-100">
        {/* Sidebar для мобильных */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xl font-bold tracking-wider">ШИРОТА</span>
                </div>
              </div>
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <div className="flex">
          {/* Sidebar для десктопа */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-1 min-h-0 bg-gray-800 border-r border-gray-700">
              <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xl font-bold tracking-wider">ШИРОТА</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto py-4">
                <nav className="flex-1 px-4 space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Статус пользователя */}
                <div className="px-4 py-4 border-t border-gray-700">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Статус</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.subscription === 'forever' ? 'bg-green-500/20 text-green-400' :
                        user.subscription === 'trial' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.subscription === 'forever' ? 'ВЕЧНО' :
                         user.subscription === 'trial' ? 'ПРОБНЫЙ' :
                         user.subscription.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-white font-medium">@{user.username}</div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token')
                        router.push('/')
                      }}
                      className="w-full mt-3 text-xs text-gray-400 hover:text-white text-center py-2 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                    >
                      Выйти из системы
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden text-gray-400 hover:text-white mr-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {tabs.find(tab => tab.id === activeTab)?.name}
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4">
                  {user.isAdmin && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full border border-red-500/30">
                      АДМИНИСТРАТОР
                    </span>
                  )}
                  <div className="hidden md:flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-400">online</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Контент */}
            <main className="flex-1 overflow-auto bg-gray-900/50">
              <div className="p-6">
                {/* Промокод и подписка */}
                {!user.isAdmin && user.subscription !== 'forever' && (
                  <>
                    <PromoActivation onActivate={fetchUser} />
                    <Subscription user={user} onUpdate={fetchUser} />
                  </>
                )}

                {user.subscription === 'forever' && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold">
                        🎉 АКТИВИРОВАНА ВЕЧНАЯ ПОДПИСКА!
                      </span>
                    </div>
                  </div>
                )}

                {/* Основной контент вкладок */}
                <div className="bg-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
                  <div className="p-6">
                    {activeTab === 'portfolio' && (
                      <Portfolio 
                        assets={assets} 
                        onUpdate={fetchAssets}
                        subscription={user.subscription}
                      />
                    )}
                    {activeTab === 'dividends' && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Дивиденды</h3>
                        <p className="text-gray-400">Раздел в разработке</p>
                      </div>
                    )}
                    {activeTab === 'coupons' && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎫</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Купоны</h3>
                        <p className="text-gray-400">Раздел в разработке</p>
                      </div>
                    )}
                    {activeTab === 'analytics' && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Аналитика</h3>
                        <p className="text-gray-400">Раздел в разработке</p>
                      </div>
                    )}
                    {activeTab === 'admin' && <AdminPanel />}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}