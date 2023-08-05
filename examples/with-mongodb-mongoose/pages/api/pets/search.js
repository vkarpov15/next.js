import axios from 'axios'
import dbConnect from '../../../lib/dbConnect'
import Pet from '../../../models/Pet'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export default async function handler(req, res) {
  const { query } = req

  await dbConnect()

  const embedding = await axios({
    method: 'POST',
    url: 'https://api.openai.com/v1/embeddings',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    data: {
      model: 'text-embedding-ada-002',
      input: query.input,
    }
  }).then(res => res.data.data[0].embedding)

  console.log('Search', embedding)
  const pets = await Pet.find({}).sort({ $vector: { $meta: embedding } }).limit(1)
  res.status(200).json({ success: true, data: pets })
}
