import { useState, useRef, useEffect } from 'react'
import './Browser.css'

const Browser = ({ onClose }) => {
    const [url, setUrl] = useState('https://www.google.com')
    const [isLoading, setIsLoading] = useState(false)

    const favoritesSites = [
        
    ]

    const handleNavigate = (newUrl) => {
        if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            newUrl = 'https://' + newUrl
        }

        setUrl(newUrl)
        setIsLoading(true)
    }

    return (
        <div className="browser-container">
            <div className="browser-header">
                <div className="browser-title">
                    <i className="material-icons">language</i>
                    <span>MyBrowser</span>
                </div>
                <button className="browser-close" onClick={onClose}>
                    <i className="material-icons">close</i>
                </button>
            </div>
            <div className="browser-toolbar">
                <div className="navigation-buttons">
                    <button title="Back">
                        <i className="material-icons">arrow_back</i>
                    </button>
                </div>
            </div>

            <div className="favorites-bar">
                {favoritesSites.map((site, index) => (
                    <button key={index} className="favorite-button" onClick={() => handleNavigate(site.url)} title={site.name}>
                        <span className="fav-icon">
                            <img src={site.icon} alt="icon" />
                        </span>
                        <span className="fav-name">{site.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Browser