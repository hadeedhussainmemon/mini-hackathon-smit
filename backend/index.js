const express = require('express')
const serverless = require('serverless-http')
const { MongoClient } = require('mongodb')

const app = express()
app.use(express.json())

let client
async function getDb() {
  if (!client) {
    const uri = process.env.MONGODB_URI || ''
    if (!uri) return null
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db()
}

app.get('/api/hello', (req, res) => res.json({ message: 'Hello from backend' }))

app.get('/api/items', async (req, res) => {
  const db = await getDb()
  if (!db) return res.status(500).json({ error: 'MONGODB_URI not set' })
  const items = await db.collection('items').find({}).limit(10).toArray()
  res.json({ items })
})

if (require.main === module) {
  const port = process.env.PORT || 5000
  app.listen(port, () => console.log('Backend listening on', port))
}

module.exports.handler = serverless(app)
