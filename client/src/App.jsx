import { useState, useEffect } from 'react'
import './App.css'
import lescream from "./assets/lebron-scream.svg"
import lastnight from "./assets/lastnight.jpg"
import leferrari from "./assets/leferrari.webp"
import axios from "axios"

function App() {
  const [array, setArray] = useState([])
  const [selectedCardIndex, setSelectedCardIndex] = useState(null)
  const [openWindow, setOpenWindow] = useState(false)
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/yes")
    setArray(response.data);
    console.log(response.data)
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  const handleCard = (index) => {
    setSelectedCardIndex(selectedCardIndex === index ? null : index)
  }

  const toggleWindow = () => {
    setOpenWindow(prevState => !prevState)
  }
  const closeWindow = () => {
    setOpenWindow(false)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setOffset({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    })
  }
  const handleMouseMove = (e) => {
    if (isDragging) {
      setWindowPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      })
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <>
      <div className='desktop'>
        <div className='folder' style={{ top: '20px', left: '50px' }} onClick={toggleWindow}>
          <i className='material-icons'>folder</i>
          <p>Pics</p>
        </div>
        <div className="folder" style={{ top: '80px', right: '20px' }}>
          <i className="material-icons">folder</i>
          <p>Memory</p>
        </div>
      </div>
      <div className='deck'>
        {
          array.map((item, index) => {
            const spread = 7
            const angle = `${(index - array.length / 2) * spread}deg`
            return (
              <div key={index} className={`card ${selectedCardIndex === index ? 'expanded' : 'minimized'}`} onClick={() => handleCard(index)} style={{ '--angle': angle }}>
                <div className='nav'>
                  <div className='rarity'>{item.rarity}</div>
                  <h1>{item.name}</h1>
                  <div className='power'><h6>PS</h6><h1>{item.ps}</h1></div>
                  <i className="material-icons">sports_basketball</i>
                </div>
                <br />
                <div className='player'>
                  <img src={lescream} alt="uaremysunshine" className='logo' />
                </div>
                <div className='description'>
                  <p>{item.description}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      {openWindow && (
        <div className='window' style={{ left: windowPosition.x, top: windowPosition.y }} onMouseDown={handleMouseDown}>
          <div className='actions'>
            <div>
              <i className='material-icons'>minimize</i>
            </div>
            <div>
              <i className='material-icons'>ad</i>
            </div>
            <div className='close' onClick={closeWindow}> {/* Close button */}
              <i className='material-icons'>close</i>
            </div>
          </div>
          <div className='content'>
            <div>
              <img src={lastnight} alt="MyFriends" />
              <p>Last Night</p>
            </div>
            <div>
              <img src={leferrari} alt="Le-Ferrari" />
              <p>'24</p>
            </div>
            <div>
              <img src={lescream} alt="Le-Scream" />
              <p>Le-Scream</p>
            </div>
            <div>
              <img src={lastnight} alt="last" />
              <p>Friends</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default App