import { useState, useRef, useEffect } from 'react'
import './Browser.css'

const Browser = ({ onClose }) => {
    const [url, setUrl] = useState('https://www.google.com')
    const [inputUrl, setInputUrl] = useState('https://www.google.com')
    const [history, setHistory] = useState(['https://www.google.com'])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const iframeRef = useRef(null)

    const favoritesSites = [
        { name: 'PH', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=fsUdFX2hHWwf5xlf&controls=0&autoplay=1', icon: 'https://image2url.com/images/1765236533640-f05d6b6d-b3c5-4ca8-a44a-b399f65daca6.svg' },
        { name: 'GutHib', url: 'https://github.com/', icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
        { name: 'localhost', url: 'http://localhost:3000', icon: 'https://cdn.iconscout.com/icon/free/png-512/free-language-icon-svg-download-png-1513808.png?f=webp&w=512' },
        { name: 'NBA', url: 'https://www.formula1.com/', icon: 'https://support.formula1.com/file-asset/F1_App_Red_Logo_White_Background?v=1' },
        { name: 'F1', url: 'https://www.nba.com/', icon: 'https://freelogopng.com/images/all_img/1692211631nba-icon.png' }
    ]

    const handleNavigate = (newUrl) => {
        if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            newUrl = 'https://' + newUrl
        }

        setUrl(newUrl)
        setInputUrl(newUrl)
        setIsLoading(true)

        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newUrl)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
    }

    const handleSumbit = (e) => {
        e.preventDefault()
        handleNavigate(inputUrl)
    }

    const handleBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setUrl(history[newIndex])
            setInputUrl(history[newIndex])
            setIsLoading(true)
        }
    }

    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setUrl(history[newIndex])
            setInputUrl(history[newIndex])
            setIsLoading(true)
        }
    }

    const handleRefresh = () => {
        setIsLoading(true)
        if (iframeRef.current) {
            iframeRef.current.src = url
        }
    }

    const handleHome = () => {
        handleNavigate('https://www.google.com')
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
                    <button onClick={handleBack} disabled={historyIndex === 0} title="Back">
                        <i className="material-icons">arrow_back</i>
                    </button>
                    <button onClick={handleForward} disabled={historyIndex === history.length -1} title="Forward">
                        <i className="material-icons">arrow_forward</i>
                    </button>
                    <button onClick={handleRefresh} title="Refresh">
                        <i className="material-icons">refresh</i>
                    </button>
                    <button onClick={handleHome} title="Home">
                        <i className="material-icons">home</i>
                    </button>
                </div>

                <form onSubmit={handleSumbit} className="url-bar">
                    <i className="material-icons url-icon">
                        {isLoading ? 'hourglass_empty' : 'lock'}
                    </i>
                    <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="Enter URL or sesrch..." className="url-input" />
                    <button type="submit" className="go">
                        <i className="material-icons">search</i>
                    </button>
                </form>
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
                        {site.icon.startsWith('http') ? (
                            <img src={site.icon} alt={site.name} className="fav-icon-img" />
                        ) : (
                            <span className="fav-icon">{site.icon}</span>
                        )}
                        <span className="fav-name">{site.name}</span>
                    </button>
                ))}
            </div>

            <div className="browser-content">
                <iframe ref={iframeRef} src={url} title="Browser Content" className="browser-iframe" onLoad={() => setIsLoading(false)} sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation" referrerPolicy="no-referrer-when-downgrade" crossOrigin="anonymous" >
                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="loading-spinner">
                                <p>Loading...</p>
                            </div>
                        </div>
                    )}
                </iframe>
            </div>

            <div className="browser-footer">
                <span className="status-text">
                    {isLoading ? 'Loading...' : 'Ready'}
                </span>
                <span className="zoom-controls">
                    <i className="material-icons">zoom_out</i>
                    <span>100%</span>
                    <i className="material-icons">zoom_in</i>
                </span>
            </div>
        </div >
    )
}

export default Browser