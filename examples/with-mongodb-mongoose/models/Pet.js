import axios from 'axios'
import mongoose from 'mongoose'

/* PetSchema will correspond to a collection in your MongoDB database. */
const PetSchema = new mongoose.Schema({
  name: {
    /* The name of this pet */

    type: String,
    required: [true, 'Please provide a name for this pet.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  owner_name: {
    /* The owner of this pet */

    type: String,
    required: [true, "Please provide the pet owner's name"],
    maxlength: [60, "Owner's Name cannot be more than 60 characters"],
  },
  species: {
    /* The species of your pet */

    type: String,
    required: [true, 'Please specify the species of your pet.'],
    maxlength: [40, 'Species specified cannot be more than 40 characters'],
  },
  age: {
    /* Pet's age, if applicable */

    type: Number,
  },
  poddy_trained: {
    /* Boolean poddy_trained value, if applicable */

    type: Boolean,
  },
  diet: {
    /* List of dietary needs, if applicable */

    type: Array,
  },
  image_url: {
    /* Url to pet image */

    required: [true, 'Please provide an image url for this pet.'],
    type: String,
  },
  likes: {
    /* List of things your pet likes to do */

    type: Array,
  },
  dislikes: {
    /* List of things your pet does not like to do */

    type: Array,
  },

  $vector: {
    type: [Number],
    validate: v => v == null || v.length === 1536,
    default: () => undefined,
  }
}, { collectionOptions: { vector: { size: 1536, function: 'cosine' } } })

PetSchema.pre('save', async function() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) {
    throw new Error(
      'Please define the OPENAI_API_KEY environment variable inside .env.local'
    )
  }

  const properties = [
    'name',
    'owner_name',
    'species',
    'diet',
    'likes',
    'dislikes'
  ]
  const input = properties.map(p => `${p}: ${this[p]}`).join('\n')
  const embedding = await axios({
    method: 'POST',
    url: 'https://api.openai.com/v1/embeddings',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    data: {
      model: 'text-embedding-ada-002',
      input,
    }
  }).then(res => res.data.data[0].embedding)

  console.log('Vector', embedding)

  this.$vector = embedding
})

export default mongoose.models.Pet || mongoose.model('Pet', PetSchema)
