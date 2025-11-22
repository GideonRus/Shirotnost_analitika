import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [])

  const handleTelegramAuth = () => {
    // Мок-авторизация для демо
    const mockUser = {
      id: Date.now(),
      username: 'demo_user',
      first_name: 'Demo'
    }
    
    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: `user=${JSON.stringify(mockUser)}`
      })
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    })
  }

  return (
    <>
      <Head>
        <title>Широта | Инвестиционный портфель</title>
        <meta name="description" content="Технологичная платформа для отслеживания инвестиций" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Анимированный фон */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative z-10">
          {/* Навигация */}
          <nav className="px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xl font-bold text-white tracking-wider">ШИРОТА</span>
              </div>
              <div className="text-sm text-gray-400">
                v1.0 · <span className="text-cyan-400">online</span>
              </div>
            </div>
          </nav>

          {/* Основной контент */}
          <div className="flex items-center justify-center min-h-[90vh] px-4">
            <div className="max-w-4xl w-full">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-3 mb-6">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-cyan-400 text-sm font-mono tracking-wider">ИНВЕСТИЦИОННАЯ ПЛАТФОРМА</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                  ШИРОТА
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Технологичная платформа для анализа и отслеживания инвестиционного портфеля. 
                  <span className="text-cyan-400"> Реальные данные. Умная аналитика.</span>
                </p>
              </div>

              {/* Карты возможностей */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Портфель</h3>
                  <p className="text-gray-400 text-sm">Отслеживание акций, облигаций и ETF в реальном времени</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Дивиденды & Купоны</h3>
                  <p className="text-gray-400 text-sm">Прогнозирование и учет выплат с календарем событий</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Аналитика</h3>
                  <p className="text-gray-400 text-sm">Глубокая аналитика портфеля с AI-рекомендациями</p>
                </div>
              </div>

              {/* Кнопка входа */}
              <div className="text-center">
                <button
                  onClick={handleTelegramAuth}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                  <span className="relative z-10 flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.139c-.205-.103-2.262-.974-4.212-1.794-1.5-.639-1.689-.75-1.877-.75-.156 0-.341.075-.341.225 0 .206.431.309 1.125.619 1.688.703 2.531 1.05 2.819 1.2.431.24.634.405.634.66 0 .375-.431.54-.834.36-.244-.113-1.35-.6-2.456-1.069-2.119-.919-2.55-1.125-3.131-1.125-.431 0-1.125.194-1.125.36 0 .211.244.315.75.525.431.18 1.05.45 1.35.555.431.154.675.225.675.435 0 .24-.244.36-.675.24-.375-.12-1.35-.45-2.25-.75-.825-.27-1.65-.54-1.65-1.05 0-.36.3-.69.9-.9 2.4-.96 5.4-1.65 7.65-1.65.675 0 1.125.09 1.125.36 0 .211-.225.33-.675.495z"/>
                    </svg>
                    Войти через Telegram
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Информация о подписке */}
                <div className="mt-8 p-6 bg-gray-800/30 backdrop-blur-lg border border-gray-700 rounded-xl max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>30 дней пробного периода</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-white font-bold text-lg">200₽</div>
                      <div className="text-gray-400 text-xs">в месяц</div>
                    </div>
                    <div className="border-l border-gray-600">
                      <div className="text-white font-bold text-lg">1 500₽</div>
                      <div className="text-gray-400 text-xs">в год</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Футер */}
          <footer className="border-t border-gray-800 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-white font-bold tracking-wider">ШИРОТА</span>
                </div>
                <div className="text-gray-400 text-sm">
                  © 2024 Широта · Инвестиционная платформа
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}