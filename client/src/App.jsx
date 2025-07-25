import { useState, useEffect, useRef } from 'react'
import { createDraggable } from 'animejs'
import axios from 'axios'
import './App.css'
import lescream from './assets/lebron-scream.svg'
import lastnight from './assets/lastnight.jpg'
import leferrari from './assets/leferrari.webp'
import music from './assets/ben.mp3'

function App() {
  const [cards, setCards] = useState([])
  const [selected, setSelected] = useState(null)
  const [openWindow, setOpenWindow] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const winRef = useRef(null)
  const musicRef = useRef(new Audio(music))

  useEffect(() => {
    axios.get('http://localhost:8080/api/yes')
      .then(res => setCards(res.data))
  }, [])

  useEffect(() => {
    musicRef.current.loop = true
    musicRef.current.volume = 0.5
    musicRef.current.muted = isMuted
    const playAudio = () => {
      musicRef.current.play().catch(e => console.warn('AutoPlay blocked: ', e))
      window.removeEventListener('click', playAudio)
    }
    window.addEventListener('click', playAudio)
    return () => {
      window.removeEventListener('click', playAudio)
    }
  }, [isMuted])

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  useEffect(() => {
    if (!openWindow || !winRef.current) return

    const draggable = createDraggable(winRef.current, {
      trigger: winRef.current.querySelector('.actions'),
      container: document.body,
      dragSpeed: 1
    })

    draggable.setX(100)
    draggable.setY(100)

    return () => {
      if (draggable && typeof draggable.destroy === 'function') {
        draggable.destroy()
      }
    }
  }, [openWindow])

  const handleCardClick = idx => {
    setSelected(curr => (curr === idx ? null : idx))
  }

  const toggleWindow = () => setOpenWindow(v => !v)
  const closeWindow = () => setOpenWindow(false)

  return (
    <>
      <div className="desktop">
        <button onClick={toggleMute} className='music'>
          {isMuted ? (<i className='material-icons'>volume_off</i>) : (<i className='material-icons'>volume_up</i>)}
        </button>
        <div className="folder" style={{ top: 20, left: 50 }} onClick={toggleWindow}>
          <i className="material-icons">folder</i>
          <p>Pics</p>
        </div>
        <div className="folder" style={{ top: 80, right: 20 }}>
          <i className="material-icons">folder</i>
          <p>Memory</p>
        </div>
      </div>
      <div className="deck">
        {cards.map((card, i) => {
          const spread = 7
          const angle = `${(i - cards.length / 2) * spread}deg`
          return (
            <div
              key={i}
              className={`card ${selected === i ? 'expanded' : 'minimized'}`}
              onClick={() => handleCardClick(i)}
              style={{ '--angle': angle }}
            >
              <div className="nav">
                <div className="rarity">{card.rarity}</div>
                <h1>{card.name}</h1>
                <div className="power">
                  <h6>PS</h6><h1>{card.ps}</h1>
                </div>
                <i className="material-icons">sports_basketball</i>
              </div>
              <div className="player">
                <img src={lescream} alt={card.name} className="logo" />
              </div>
              <div className="description">
                <p>{card.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      {selected !== null && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()}>
            <div className="card" style={{ ['--angle']: '0deg' }}>
              <div className="nav">
                <div className="rarity">{cards[selected].rarity}</div>
                <h1>{cards[selected].name}</h1>
                <div className="power">
                  <h6>PS</h6><h1>{cards[selected].ps}</h1>
                </div>
                <i className="material-icons">sports_basketball</i>
              </div>
              <div className="player">
                <img src={lescream} alt={cards[selected].name} className="logo" />
              </div>
              <div className="description">
                <p>{cards[selected].description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {openWindow && (
        <div ref={winRef} className="window">
          <div className="actions">
            <i className="material-icons">minimize</i>
            <i className="material-icons">ad</i>
            <div className="close" onClick={closeWindow}>
              <i className="material-icons">close</i>
            </div>
          </div>
          <div className="content">
            <div><img src={lastnight} alt="" /><p>Last Night</p></div>
            <div><img src={leferrari} alt="" /><p>'24</p></div>
            <div><img src={lescream} alt="" /><p>Le-Scream</p></div>
            <div><img src={lastnight} alt="" /><p>Friends</p></div>
          </div>
        </div>
      )}
    </>
  )
}

export default App