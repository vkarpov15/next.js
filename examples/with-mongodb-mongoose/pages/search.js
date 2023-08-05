import Link from 'next/link'
import { useState } from 'react'

const Search = ({}) => {
  const [state, setState] = useState({ searchText: '', pets: [] })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, pets: [] })
    const res = await fetch(`/api/pets/search?input=${encodeURIComponent(state.searchText)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
    setState({ ...state, pets: res.data })
  }

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h3>Describe your ideal pet</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="searchText"
            value={state.searchText}
            onChange={handleChange}>
          </input>
          <button type="submit">Search</button>
        </form>
      </div>
      <div>
      {state.pets.map((pet) => (
        <div key={pet._id}>
          <div className="card">
            <img src={pet.image_url} />
            <h5 className="pet-name">{pet.name}</h5>
            <div className="main-content">
              <p className="pet-name">{pet.name}</p>
              <p className="owner">Owner: {pet.owner_name}</p>

              {/* Extra Pet Info: Likes and Dislikes */}
              <div className="likes info">
                <p className="label">Likes</p>
                <ul>
                  {pet.likes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>
              <div className="dislikes info">
                <p className="label">Dislikes</p>
                <ul>
                  {pet.dislikes.map((data, index) => (
                    <li key={index}>{data} </li>
                  ))}
                </ul>
              </div>

              <div className="btn-container">
                <Link href="/[id]/edit" as={`/${pet._id}/edit`} legacyBehavior>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href="/[id]" as={`/${pet._id}`} legacyBehavior>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default Search
