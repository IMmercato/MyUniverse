import React, { useState, useEffect } from 'react';
import './Crash.css';
import qr from '../assets/frame.png'

const errorMessages = [
  "Runtime Error 302: System Failure",
  "Memory Access Violation",
  "KERNEL_DATA_INPAGE_ERROR",
  "CRITICAL_PROCESS_DIED",
  "SYSTEM_THREAD_EXCEPTION_NOT_HANDLED",
  "PAGE_FAULT_IN_NONPAGED_AREA",
  "IRQL_NOT_LESS_OR_EQUAL",
  "VIDEO_TDR_FAILURE",
  "UNEXPECTED_STORE_EXCEPTION",
  "DPC_WATCHDOG_VIOLATION",
  "Application Error 0xc0000005",
  "Stack Overflow at 0x00000000",
  "DLL Initialization Failed",
  "Hardware Malfunction",
  "NTFS File System Error",
  "Win32k.sys Blue Screen",
  "Bad Pool Caller",
  "Driver IRQL Not Less Or Equal",
  "System Service Exception",
  "Cache Manager Error"
];

const Crash = ({ onComplete }) => {
  const [errorWindows, setErrorWindows] = useState([]);
  const [showBSOD, setShowBSOD] = useState(false);

  const createErrorWindow = () => {
    const id = Date.now() + Math.random();
    const message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 200);
    
    return {
      id,
      message,
      x,
      y,
      zIndex: 10000 + Math.floor(Math.random() * 1000),
      closing: false
    };
  };

  useEffect(() => {
    // Generate error windows at increasing rate
    let interval = 300;
    const errorInterval = setInterval(() => {
      setErrorWindows(prev => [...prev, createErrorWindow()]);
      interval = Math.max(50, interval * 0.9); // Accelerate window spawning
    }, interval);

    // Show BSOD after 5 seconds
    const bsodTimeout = setTimeout(() => {
      clearInterval(errorInterval);
      setShowBSOD(true);
      setTimeout(onComplete, 5000);
    }, 5000);

    return () => {
      clearInterval(errorInterval);
      clearTimeout(bsodTimeout);
    };
  }, [onComplete]);

  const handleClose = (id) => {
    setErrorWindows(prev => 
      prev.map(window => 
        window.id === id ? { ...window, closing: true } : window
      )
    );
    setTimeout(() => {
      setErrorWindows(prev => prev.filter(window => window.id !== id));
    }, 300);
  };

  if (showBSOD) {
    return (
      <div className="bsod">
        <div className="bsod-content">
          <h1>:(</h1>
          <h2>Your PC ran into a problem and needs to restart.</h2>
          <p>We're just collecting some error info, and then we'll restart for you.</p>
          <p className="percentage">0% complete</p>
          <div className="qr-code">
            <div className="qr-placeholder">
                <img src={qr} alt="qrcode" />
            </div>
            <div className="qr-text">
              <p>For more information about this issue and possible fixes, visit nothing!</p>
              <p>Stop code: CRITICAL_PROCESS_DIED</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="windows-crash-overlay">
      {errorWindows.map(window => (
        <div 
          key={window.id}
          className={`error-window ${window.closing ? 'closing' : ''}`}
          style={{ 
            left: `${window.x}px`,
            top: `${window.y}px`,
            zIndex: window.zIndex
          }}
        >
          <div className="error-header">
            <span className="error-icon">⚠️</span>
            <span className="error-title">Windows - System Error</span>
            <button 
              className="error-close"
              onClick={() => handleClose(window.id)}
            >
              ✕
            </button>
          </div>
          <div className="error-body">
            <p>{window.message}</p>
            <div className="error-buttons">
              <button onClick={() => handleClose(window.id)}>OK</button>
              <button onClick={() => handleClose(window.id)}>Cancel</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Crash;