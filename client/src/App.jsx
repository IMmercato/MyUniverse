import { useState, useEffect } from 'react'
import './App.css'
import lescream from "./assets/lebron-scream.svg"
import axios from "axios"

function App() {
  const [array, setArray] = useState([])

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/yes")
    setArray(response.data)
    console.log(response.data)
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
    <div className='desktop'>
      <div>
        <i className='material-icons'>folder</i>
      </div>
    </div>
      {
        array.map((item, index) => (
          <div key={index} className='card'>
            <div className='nav'>
              <div className='rarity'>{item.rarity}</div>
              <h1>{item.name}</h1>
              <div className='power'><h6>PS</h6><h1>{item.ps}</h1></div>
              <i className="material-icons">sports_basketball</i>
            </div>
            <br />
            <div className='player'>
              <img src={lescream} alt="uaremysunshine" className='logo'/>
            </div>
            <div>
              <p>{item.description}</p>
            </div>
          </div>
        ))
      }
    </>
  )
}

export default App