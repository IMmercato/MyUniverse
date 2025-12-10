import { useState, useRef, useEffect } from 'react'
import './Note.css'

const Note = ({ onClose }) => {
    const [content, setContent] = useState('')
    const [fileName, setFileName] = useState('untitled.im')
    const [showFileMenu, setShowFileMenu] = useState(false)
    const [showEditMenu, setShowEditMenu] = useState(false)
    const [showHelpMenu, setShowHelpMenu] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const textareaRef = useRef(null)

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

    useEffect(() => {
        const timer = setTimeout(() => {
            if (content && !isSaved) {
                handleAutoSave()
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [content, isSaved])

    const handleAutoSave = () => {
        localStorage.setItem('notepad-content', content)
        localStorage.setItem('notepad-filename', fileName)
        setIsSaved(true)
    }

    const handleSave = () => {
        setShowSaveDialog(true)
        setShowFileMenu(false)
    }

    const handleNew = () => {
        if (!isSaved) {
            if (window.confirm('You have unsaved changes. Continue?')) {
                setContent('')
                setFileName('untitled.im')
                setIsSaved(true)
                localStorage.removeItem('notepad-content')
                localStorage.removeItem('notepad-filename')
            }
        } else {
            setContent('')
            setFileName('utitled.im')
            localStorage.removeItem('notepad-content')
            localStorage.removeItem('notepad-filename')
        }
        setShowFileMenu(false)
    }

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
        setShowFileMenu(false)
    }

    const handleCut = () => {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)

        navigator.clipboard.writeText(selectedText)
        setContent(content.substring(0, start) + content.substring(end))
        setIsSaved(false)
        setShowEditMenu(false)
    }

    const handleCopy = () => {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)

        navigator.clipboard.writeText(selectedText)
        setShowEditMenu(false)
    }

    const handlePaste = async () => {
        const text = await navigator.clipboard.readText()
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd

        setContent(content.substring(0, start) + text + content.substring(end))
        setIsSaved(false)
        setShowEditMenu(false)
    }

    const handleSelectAll = () => {
        textareaRef.current.select()
        setShowEditMenu(false)
    }

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
                            <div className="menu-option" onClick={handleNew}>
                                <span>New</span>
                                <span className="shortcut">Ctrl+N</span>
                            </div>
                            <div className="menu-option" onClick={handleSave}>
                                <span>Save</span>
                                <span className="shortcut">Ctrl+S</span>
                            </div>
                            <div className="menu-option" onClick={handleDownload}>
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
                            <div className="menu-option" onClick={handleCut}>
                                <span>Cut</span>
                                <span className="shortcut">Ctrl+X</span>
                            </div>
                            <div className="menu-option" onClick={handleCopy}>
                                <span>Copy</span>
                                <span className="shortcut">Ctrl+C</span>
                            </div>
                            <div className="menu-option" onClick={handlePaste}>
                                <span>Paste</span>
                                <span className="shortcut">Ctrl+V</span>
                            </div>
                            <div className="menu-divider"></div>
                            <div className="menu-option" onClick={handleSelectAll}>
                                <span>Select All</span>
                                <span className="shortcut">Ctrl+A</span>
                            </div>
                        </div>
                    )}
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
        </div>
    )
}

export default Note