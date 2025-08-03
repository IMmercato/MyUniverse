import { useEffect, useRef } from "react"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";

const Chess = () => {
    const mountRef = useRef(null)

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })

        renderer.setClearColor(0x000000, 0)

        mountRef.current.appendChild(renderer.domElement)
        
        const updateRendererSize = () => {
            const width = mountRef.current.clientWidth
            const height = mountRef.current.clientHeight
            renderer.setSize(width, height)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        };
        
        updateRendererSize()

        // Chess board
        const boardSize = 3
        const squareSize = 1

        for (let x = 0; x < boardSize; x++) {
            for (let y = 0; y < boardSize; y++) {
                const color = (x + y) % 2 === 0 ? 0xffffff : 0x000000
                const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize)
                const material = new THREE.MeshBasicMaterial({ color })
                const square = new THREE.Mesh(geometry, material)
                square.position.set(x - 1, 0, y - 1)
                scene.add(square)
            }
        }

        const createKnight = () => {
            const bodyGeometry = new THREE.BoxGeometry(0.5, 1, 0.5)
            const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
            body.position.y = 0.5

            const neckGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8)
            const neckMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const neck = new THREE.Mesh(neckGeometry, neckMaterial)
            neck.position.set(0, 1.25, 0)
            neck.rotation.x = Math.PI / 2

            const headGeometry = new THREE.SphereGeometry(0.2, 8, 8)
            const headMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const head = new THREE.Mesh(headGeometry, headMaterial)
            head.position.set(0, 1.75, 0)

            const maneGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8)
            const maneMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const mane = new THREE.Mesh(maneGeometry, maneMaterial)
            mane.position.set(0, 1.5, 0)
            mane.rotation.x = Math.PI / 2

            const knight = new THREE.Group()
            knight.add(body)
            knight.add(neck)
            knight.add(head)
            knight.add(mane)

            return knight
        };

        const knight = createKnight()
        scene.add(knight)

        // Knight movement logic
        let knightX = 1
        let knightY = 0
        knight.position.set(0, 0, 0)

        const knightMoves = [
            [2, 1], [1, 2], [-1, 2], [-2, 1],
            [-2, -1], [-1, -2], [1, -2], [2, -1]
        ]

        function isValidMove(x, y) {
            return x >= 0 && x < boardSize && y >= 0 && y < boardSize
        }

        function randomValidMove(x, y) {
            const valid = knightMoves.filter(([dx, dy]) => isValidMove(x + dx, y + dy))
            if (valid.length === 0) return [0, 0]
            return valid[Math.floor(Math.random() * valid.length)]
        }

        function animateKnight() {
            const [dx, dy] = randomValidMove(knightX, knightY)
            knightX += dx
            knightY += dy
            knight.position.set(knightX - 1, 0.25, knightY - 1)
            setTimeout(animateKnight, 800)
        }
        animateKnight()

        // Camera position
        camera.position.set(0, 5, 5)
        camera.lookAt(0, 0, 0)

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        };
        animate()

        // Handle window resize
        const handleResize = () => {
            updateRendererSize()
        };
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [])

    return <div id="chess" ref={mountRef} style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '0' }} />
}

export default Chess