const express = require('express')
const serverless = require('serverless-http')
const { MongoClient } = require('mongodb')

const app = express()
app.use(express.json())

let client
async function getDb() {
  if (!client) {
    const uri = process.env.MONGODB_URI || ''
    if (!uri) {
      console.warn('getDb: MONGODB_URI not set; returning null DB')
      return null
    }
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db()
}

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from backend' }))

app.get('/api/items', async (req, res) => {
  try {
    const db = await getDb()
    if (!db) {
      // Graceful fallback when DB is not configured or connection failed
      console.warn('/api/items: DB not available, returning empty items')
      return res.json({ items: [], warning: 'DB_NOT_CONFIGURED' })
    }
    const items = await db.collection('items').find({}).limit(10).toArray()
    res.json({ items })
  } catch (err) {
    console.error('Error in /api/items:', err && err.stack ? err.stack : err)
    res.status(500).json({ error: err.message || 'INTERNAL_SERVER_ERROR' })
  }
})

// health-check for Vercel/monitoring
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

if (require.main === module) {
  const port = process.env.PORT || 4000
  const server = app.listen(port, () => console.log('Backend listening on', port))
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the process using that port or set a different PORT environment variable.`)
      console.error('On Windows: run `netstat -ano | findstr :' + port + '` then `taskkill /PID <pid> /F`')
      process.exit(1)
    }
    console.error('Server error:', err && err.stack ? err.stack : err)
    process.exit(1)
  })
}

// log unhandled errors so Vercel logs show why a function crashed
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err && err.stack ? err.stack : err)
})

module.exports.handler = serverless(app)
