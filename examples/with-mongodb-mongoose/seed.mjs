import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import dbConnect from './lib/dbConnect.js'
import Pet from './models/Pet.js'

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.env.local')
})

await dbConnect()

await Pet.deleteMany()
await Pet.create([
  {
    name: 'Pooka',
    owner_name: 'Val',
    species: 'Yorkie',
    age: 15,
    diet: 'Cardiac food',
    image_url: 'https://a-z-animals.com/media/2022/05/yorkie.jpg',
    likes: 'Sleeping',
    dislikes: 'Long walks'
  },
  {
    name: 'Kona',
    owner_name: 'Val',
    species: 'Aussiedoodle',
    age: 4,
    diet: 'Primal beef nuggets... he\'s a very picky eater',
    image_url: 'https://www.dailypaws.com/thmb/v5Siqy-zNW5CtCBLPsQNPqdkpyU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/aussiedoodle-soccer-ball-288214999-2000-465a9c2d3368452a868c070a479820da.jpg',
    likes: 'Running around and playing fetch',
    dislikes: 'When strangers walk in the door'
  }
])

console.log('Created 2 pets')

process.exit(0)