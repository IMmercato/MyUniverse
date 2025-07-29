import { useState, useEffect, useRef } from 'react'
import { createDraggable } from 'animejs'
import axios from 'axios'
import './App.css'
import lescream from './assets/lebron-scream.svg'
import lastnight from './assets/lastnight.jpg'
import leferrari from './assets/leferrari.webp'
import knight from './assets/knight.svg'
import music from './assets/ben.mp3'
import Terminal from './components/Terminal'
import Chess from './components/Chess'

const imageMapping = {
  "lastnight": lastnight,
  "lescream": lescream,
  "leferrari": leferrari
};

function App() {
  const [cards, setCards] = useState([])
  const [selected, setSelected] = useState(null)
  const [folderContent, setFolderContent] = useState(null)
  const [openWindow, setOpenWindow] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const winRef = useRef(null)
  const musicRef = useRef(new Audio(music))

  useEffect(() => {
    axios.get('http://localhost:8080/api/yes')
      .then(res => setCards(res.data))
  }, [])

  const fetchFolderContent = (folder) => {
    axios.get('http://localhost:8080/api/window')
      .then(res => {
        setFolderContent(res.data[folder])
      })
      .catch(err => console.err(err))
  }

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

  const toggleWindow = (folder) => {
    fetchFolderContent(folder)
    setOpenWindow(v => !v)
  }
  const closeWindow = () => setOpenWindow(false)
  const toggleTerminal = () => {
    setShowTerminal(prev => !prev)
  }

  return (
    <>
      <div className="desktop">
        <button onClick={toggleMute} className='music'>
          {isMuted ? (<i className='material-icons'>volume_off</i>) : (<i className='material-icons'>volume_up</i>)}
        </button>
        <div className="folder" style={{ top: '1%', left: '2%' }} onClick={() => toggleWindow('Pics')}>
          <i className="material-icons">folder</i>
          <p>Pics</p>
        </div>
        <div className="folder" style={{ top: '10%', right: '2%' }} onClick={() => toggleWindow('Memory')}>
          <i className="material-icons">folder</i>
          <p>Memory</p>
        </div>
        <img src={knight} alt="Knight" style={{ left: '25%', top: '10%', position: 'absolute' }} />
        <div className="folder" style={{ left: '2%', top: '20%' }} onClick={() => toggleTerminal()}>
          <i className='material-icons'>terminal</i>
          <p>CMD</p>
        </div>
        {showTerminal &&
        <div className="window" style={{ left: '50%', top: '50%' }}>
          <div className="actions">
            <i className="material-icons">minimize</i>
            <i className="material-icons">ad</i>
            <div className="close">
              <i className="material-icons">close</i>
            </div>
          </div>
          <Terminal />
        </div>
        }
        <div className="chess">
          <Chess />
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
      {openWindow && folderContent && (
        <div ref={winRef} className="window">
          <div className="actions">
            <i className="material-icons">minimize</i>
            <i className="material-icons">ad</i>
            <div className="close" onClick={closeWindow}>
              <i className="material-icons">close</i>
            </div>
          </div>
          <div className="content">
            {Array.isArray(folderContent) ? (
              folderContent.map((item, index) => (
                <div key={index}>
                  <img src={imageMapping[item.pic]} alt={item.pic} />
                  <p>{item.name}</p>
                </div>
              ))
            ) : (
              <p>{folderContent.error}</p>
            )
            }
          </div>
        </div>
      )}
    </>
  )
}

export default App