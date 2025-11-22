/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    YOOMONEY_WALLET: process.env.YOOMONEY_WALLET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  }
}

module.exports = nextConfig