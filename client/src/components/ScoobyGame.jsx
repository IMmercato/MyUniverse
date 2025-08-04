import { useEffect, useRef, useState } from 'react'
import './ScoobyGame.css'

const ScoobyGame = ({ onClose }) => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [distance, setDistance] = useState(0)
  const [showGameOverScreen, setShowGameOverScreen] = useState(false)
  
  // Game assets
  const assets = {
    background: 'https://wallpapers.com/images/hd/gotham-city-t0brxa61aqv13nrf.jpg',
    platform: 'https://cdn.staticneo.com/w/mario/thumb/6/63/Brick_Block.png/120px-Brick_Block.png',
    scoobyShaggy: 'https://immagini-b1484.web.app/Scooby&Shaggy.png',
    bond: 'https://www.vhv.rs/dpng/d/501-5015311_sean-connery-james-bond-clip-arts-james-bond.png',
    collectible: 'https://img1.pnghut.com/0/25/2/GKiF3q5qrP/super-mario-bros-new-u-coin-luigi-2.jpg'
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')
    canvas.width = 800
    canvas.height = 500

    // Game objects
    const gameState = {
      duo: { x: 100, y: 320, width: 100, height: 100, speed: 5, velocityY: 0, isOnGround: false, jumpPower: 12 },
      bond: { x: 50, y: 320, width: 50, height: 90, speed: 1.5, velocityY: 0, isOnGround: false },
      camera: { x: 0 }, // Camera for infinite scrolling
      platforms: [
        { x: 0, y: 400, width: 200, height: 20 },
        { x: 250, y: 350, width: 150, height: 20 },
        { x: 450, y: 300, width: 150, height: 20 },
        { x: 650, y: 250, width: 150, height: 20 }
      ],
      collectibles: [
        { x: 300, y: 320, width: 30, height: 30, collected: false },
        { x: 500, y: 270, width: 30, height: 30, collected: false },
        { x: 700, y: 220, width: 30, height: 30, collected: false }
      ],
      gravity: 0.8,
      keys: {},
      nextPlatformX: 850, // Next platform generation position
      nextCollectibleX: 900,
      gameOverTimer: 0,
      caught: false
    };

    // Load images
    const images = {};
    Object.keys(assets).forEach(key => {
      images[key] = new Image()
      images[key].src = assets[key]
    });

    // Event listeners
    const handleKeyDown = (e) => {
      gameState.keys[e.key] = true
      if (e.key === ' ' && gameState.duo.isOnGround) {
        gameState.duo.velocityY = -gameState.duo.jumpPower
        gameState.duo.isOnGround = false
      }
    };

    const handleKeyUp = (e) => {
      gameState.keys[e.key] = false
    };

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (!gameState.caught) {
        // Generate new platforms and collectibles
        generateWorld(gameState)
        
        // Update camera to follow duo
        updateCamera(gameState)
      } else {
        // Even when caught, update distance one final time
        setDistance(Math.floor(gameState.duo.x / 10))
      }
      
      // Draw background
      ctx.drawImage(images.background, -gameState.camera.x * 0.5, 0, canvas.width * 2, canvas.height)
      
      // Update characters
      updateCharacters(gameState)
      checkCollisions(gameState)
      
      // Update distance in real time
      setDistance(Math.floor(gameState.duo.x / 10))
      
      drawGameObjects(ctx, gameState, images)
      
      // Handle game over sequence
      if (gameState.caught) {
        handleGameOverSequence(gameState, ctx, canvas)
      }

      if (!gameOver || !showGameOverScreen) {
        requestAnimationFrame(gameLoop)
      } else {
        drawFinalGameOverScreen(ctx, canvas)
      }
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    };
  }, [gameOver, showGameOverScreen])

  // Generate infinite world
  const generateWorld = (state) => {
    // Remove platforms that are too far behind
    state.platforms = state.platforms.filter(plat => plat.x > state.camera.x - 200)
    state.collectibles = state.collectibles.filter(item => item.x > state.camera.x - 200)
    
    // Generate new platforms ahead
    while (state.nextPlatformX < state.camera.x + 1200) {
      const lastPlatform = state.platforms[state.platforms.length - 1]
      const minY = 200
      const maxY = 420
      
      // Create reachable platform
      const newY = lastPlatform ? 
        Math.max(minY, Math.min(maxY, lastPlatform.y + (Math.random() - 0.5) * 100)) :
        350
      
      const platformWidth = 120 + Math.random() * 80 // 120-200 width
      const gap = 150 + Math.random() * 100 // 150-250 gap
      
      state.platforms.push({
        x: state.nextPlatformX,
        y: newY,
        width: platformWidth,
        height: 20
      })
      
      state.nextPlatformX += platformWidth + gap
    }
    
    // Generate collectibles
    while (state.nextCollectibleX < state.camera.x + 1200) {
      const nearbyPlatform = state.platforms.find(plat => 
        Math.abs(plat.x - state.nextCollectibleX) < 100
      )
      
      if (nearbyPlatform && Math.random() < 0.7) { // 70% chance
        state.collectibles.push({
          x: nearbyPlatform.x + nearbyPlatform.width / 2 - 15,
          y: nearbyPlatform.y - 40,
          width: 30,
          height: 30,
          collected: false
        })
      }
      
      state.nextCollectibleX += 200 + Math.random() * 100
    }
  }

  // Update camera to follow duo
  const updateCamera = (state) => {
    const targetCameraX = state.duo.x - 300 // Keep duo slightly left of center
    state.camera.x = Math.max(0, targetCameraX) // Don't go backwards
  }

  // Game functions
  const updateCharacters = (state) => {
    // Stop movement if caught
    if (state.caught) return
    
    // Duo movement - ONLY RIGHT, no left movement
    if (state.keys['ArrowRight'] && state.duo.x < state.camera.x + 1000) {
      state.duo.x += state.duo.speed
    }
    // Remove left movement completely - no more ArrowLeft
    
    // Apply gravity to Duo
    state.duo.velocityY += state.gravity
    state.duo.y += state.duo.velocityY
    
    // Check platform collision for Duo
    state.duo.isOnGround = false
    state.platforms.forEach(plat => {
      if (state.duo.x + state.duo.width > plat.x && 
          state.duo.x < plat.x + plat.width &&
          state.duo.y + state.duo.height > plat.y && 
          state.duo.y + state.duo.height < plat.y + plat.height + 10 &&
          state.duo.velocityY >= 0) {
        state.duo.y = plat.y - state.duo.height
        state.duo.velocityY = 0
        state.duo.isOnGround = true
      }
    })

    // Bond follows behind them (always tries to get closer)
    const distanceToDuo = state.duo.x - state.bond.x
    
    if (Math.abs(distanceToDuo) > 80) { // Keep some distance
      if (distanceToDuo > 0) {
        state.bond.x += state.bond.speed // Move right to follow
      }
      // Remove left movement for Bond too - only follows forward
    }
    
    // Apply gravity to Bond
    state.bond.velocityY += state.gravity
    state.bond.y += state.bond.velocityY
    
    // Check platform collision for Bond
    state.bond.isOnGround = false
    state.platforms.forEach(plat => {
      if (state.bond.x + state.bond.width > plat.x && 
          state.bond.x < plat.x + plat.width &&
          state.bond.y + state.bond.height > plat.y && 
          state.bond.y + state.bond.height < plat.y + plat.height + 10 &&
          state.bond.velocityY >= 0) {
        state.bond.y = plat.y - state.bond.height
        state.bond.velocityY = 0
        state.bond.isOnGround = true
      }
    })
    
    // Make Bond jump occasionally to follow them
    if (state.bond.isOnGround && distanceToDuo > 120 && Math.random() < 0.015) {
      state.bond.velocityY = -10
      state.bond.isOnGround = false
    }
    
    // Prevent characters from falling off screen
    [state.duo, state.bond].forEach(char => {
      if (char.y > 500) {
        // Find nearest platform to respawn on
        const nearestPlatform = state.platforms
          .filter(plat => plat.x > char.x - 100 && plat.x < char.x + 100)
          .sort((a, b) => Math.abs(a.x - char.x) - Math.abs(b.x - char.x))[0]
        
        if (nearestPlatform) {
          char.y = nearestPlatform.y - char.height
          char.x = nearestPlatform.x + nearestPlatform.width / 2 - char.width / 2
        } else {
          char.y = 320
          char.x = Math.max(state.camera.x, char.x)
        }
        char.velocityY = 0
      }
    })
  };

  const checkCollisions = (state) => {
    // Bond catches the duo
    if (
      !state.caught &&
      state.duo.x < state.bond.x + state.bond.width &&
      state.duo.x + state.duo.width > state.bond.x &&
      state.duo.y < state.bond.y + state.bond.height &&
      state.duo.y + state.duo.height > state.bond.y
    ) {
      state.caught = true
      state.gameOverTimer = 0
    }

    // Collect Scooby Snacks
    if (!state.caught) {
      state.collectibles.forEach((item, index) => {
        if (
          !item.collected &&
          state.duo.x < item.x + item.width &&
          state.duo.x + state.duo.width > item.x &&
          state.duo.y < item.y + item.height &&
          state.duo.y + state.duo.height > item.y
        ) {
          item.collected = true
          setScore(prev => prev + 100)
        }
      })
    }
  };

  const drawGameObjects = (ctx, state, images) => {
    // Save context for camera transform
    ctx.save()
    ctx.translate(-state.camera.x, 0)
    
    // Draw platforms
    state.platforms.forEach(plat => {
      ctx.drawImage(images.platform, plat.x, plat.y, plat.width, plat.height)
    })

    // Draw collectibles
    state.collectibles.forEach(item => {
      if (!item.collected) {
        ctx.drawImage(images.collectible, item.x, item.y, item.width, item.height)
      }
    })

    // Draw characters
    ctx.drawImage(images.scoobyShaggy, state.duo.x, state.duo.y, state.duo.width, state.duo.height)
    ctx.drawImage(images.bond, state.bond.x, state.bond.y, state.bond.width, state.bond.height)
    
    // Restore context
    ctx.restore()

    // Draw UI (score) - not affected by camera
    ctx.fillStyle = 'white'
    ctx.font = '20px Arial'
    ctx.fillText(`Score: ${score}`, 20, 30)
    ctx.fillText(`Distance: ${distance}m`, 20, 60)
  };

  // Handle the game over sequence with timing
  const handleGameOverSequence = (state, ctx, canvas) => {
    state.gameOverTimer += 16 // Assuming 60fps, add ~16ms per frame
    
    // Show "CAUGHT!" message for first 2 seconds
    if (state.gameOverTimer < 2000) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'white'
      ctx.font = 'bold 60px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('CAUGHT!', canvas.width/2, canvas.height/2)
      
      // Add some dramatic effect
      const shake = Math.sin(state.gameOverTimer * 0.05) * 5
      ctx.translate(shake, 0)
    } else {
      // After 2 seconds, show the full game over screen
      setGameOver(true)
      setShowGameOverScreen(true)
    }
  }

  // Final game over screen with score and restart option
  const drawFinalGameOverScreen = (ctx, canvas) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#ff4444'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 80)
    
    ctx.fillStyle = 'white'
    ctx.font = '28px Arial'
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 - 20)
    ctx.fillText(`Distance Traveled: ${distance}m`, canvas.width/2, canvas.height/2 + 20)
    
    ctx.fillStyle = '#00ff88'
    ctx.font = 'bold 24px Arial'
    ctx.fillText('Click to Play Again', canvas.width/2, canvas.height/2 + 80)
    
    ctx.fillStyle = '#aaaaaa'
    ctx.font = '18px Arial'
    ctx.fillText('James Bond caught you!', canvas.width/2, canvas.height/2 + 120)
  };

  // Reset game function
  const resetGame = () => {
    setGameOver(false)
    setShowGameOverScreen(false)
    setScore(0)
    setDistance(0)
  };

  return (
    <div className="game-container">
      <button className="close-game" onClick={onClose}>✕</button>
      <canvas 
        ref={canvasRef} 
        onClick={() => {
          if (showGameOverScreen) {
            resetGame()
          }
        }}
      />
    </div>
  );
};

export default ScoobyGame