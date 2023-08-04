import mongoose from 'mongoose'
import { driver } from 'stargate-mongoose'

mongoose.setDriver(driver)

const JSON_API_URI = process.env.JSON_API_URI

if (!JSON_API_URI) {
  throw new Error(
    'Please define the JSON_API_URI environment variable inside .env.local'
  )
}

const authUrl = process.env.STARGATE_AUTH_URL

if (!authUrl) {
  throw new Error(
    'Please define the STARGATE_AUTH_URL environment variable inside .env.local'
  )
}

const username = process.env.STARGATE_USERNAME

if (!username) {
  throw new Error(
    'Please define the STARGATE_USERNAME environment variable inside .env.local'
  )
}

const password = process.env.STARGATE_PASSWORD

if (!password) {
  throw new Error(
    'Please define the STARGATE_PASSWORD environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      authUrl,
      username,
      password,
    }

    cached.promise = mongoose
      .connect(JSON_API_URI, opts)
      .then(() => Promise.all(Object.values(mongoose.models).map(Model => Model.init())))
      .then((mongoose) => {
        return mongoose
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
