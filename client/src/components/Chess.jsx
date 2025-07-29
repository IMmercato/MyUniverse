import { useEffect } from "react"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";

const Chess = () => {
    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById("chess").appendChild(renderer.domElement)

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

        camera.position.set(0, 5, 5)
        camera.lookAt(0, 0, 0)

        function animate() {
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }
        animate()
    }, [])
    return <div id="chess"></div>
}

export default Chess