import { useState, useRef, useEffect } from 'react'
import './Note.css'

const Note = ({ onClose }) => {
    const [content, setContent] = useState('')
    const [fileName, setFileName] = useState('untitled.im')
    const [showFileMenu, setShowFileMenu] = useState(false)
    const [showEditMenu, setShowEditMenu] = useState(false)
    const [showHelpMenu, setShowHelpMenu] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('notepad-content')
        const savedFileName = localStorage.getItem('notepad-filename')
        if (saved) {
            setContent(saved)
            setIsSaved(true)
        }
        if (savedFileName) {
            setFileName(savedFileName)
        }
    }, [])

    return (
        <div className="note-container">
            <div className="note-header">
                <div className="note-title">
                    <i className="material-icons">description</i>
                    <span>{fileName}{!isSaved ? ' *' : ''}</span>
                </div>
                <button className="note-close" onClick={onClose}>
                    <i className="material-icons">close</i>
                </button>
            </div>

            <div className="note-menubar">
                <div className="menu-item" onClick={() => {
                    setShowFileMenu(!showFileMenu)
                    setShowEditMenu(false)
                    showHelpMenu(false)
                }}>
                    File
                    {showFileMenu && (
                        <div className="dropdown-menu">
                            <div className="menu-option">
                                <span>New</span>
                                <span className="shortcut">Ctrl+N</span>
                            </div>
                            <div className="menu-option">
                                <span>Save</span>
                                <span className="shortcut">Ctrl+S</span>
                            </div>
                            <div className="menu-option">
                                <span>Download</span>
                                <span className="shortcut">Ctrl+D</span>
                            </div>
                            <div className="menu-divider"></div>
                            <div className="menu-option" onClick={onClose}>
                                <span>Exit</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="menu-item" onClick={() => {
                    setShowEditMenu(!showEditMenu)
                    setShowFileMenu(false)
                    setShowFileMenu(false)
                }}>
                    Edit
                    {showEditMenu && (
                        <div className="dropdown-menu">
                            <div className="menu-option">
                                <span>Cut</span>
                                <span className="shortcut">Ctrl+X</span>
                            </div>
                            <div className="menu-option">
                                <span>Copy</span>
                                <span className="shortcut">Ctrl+C</span>
                            </div>
                            <div className="menu-option">
                                <span>Paste</span>
                                <span className="shortcut">Ctrl+V</span>
                            </div>
                            <div className="menu-divider"></div>
                            <div className="menu-option">
                                <span>Select All</span>
                                <span className="shortcut">Ctrl+A</span>
                            </div>

                            <div className="menu-item" onClick={() => {
                                setShowHelpMenu(!showHelpMenu)
                                setShowFileMenu(false)
                                setShowEditMenu(false)
                            }}>
                                Help
                                {showHelpMenu && (
                                    <div className="dropdown-menu">
                                        <div className="menu-option">
                                            <span>About</span>
                                        </div>
                                        <div className="menu-option">
                                            <span>MyNotepad v0.0.1</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Note