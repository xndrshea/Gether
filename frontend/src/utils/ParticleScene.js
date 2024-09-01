import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Particles = ({ count = 333, mouse }) => {
    const mesh = useRef();
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.0005 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.20) {
                color = new THREE.Color(0x0000FF); // Blue (20%)
            } else if (colorChoice < 0.70) {
                color = new THREE.Color(0x000000); // Black (50%)
            } else {
                color = new THREE.Color(0xFFFFFF); // White (30%)
            }
            
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0, color });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particleGeometry = useMemo(() => {
        const geometry = new THREE.DodecahedronGeometry(0.7, 0); // Particle size
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        colors.fill(1);  // Set all colors to white initially
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geometry;
    }, []);

    useEffect(() => {
        if (mesh.current) {
            const instancedMesh = mesh.current;
            particles.forEach((particle, i) => {
                dummy.position.set(particle.xFactor, particle.yFactor, particle.zFactor);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
                instancedMesh.setColorAt(i, particle.color);
            });
            instancedMesh.instanceMatrix.needsUpdate = true;
            instancedMesh.instanceColor.needsUpdate = true;
        }
    }, [particles]);

    useFrame(() => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;

            particle.mx += (mouse.current[0] - particle.mx) * 0.01;
            particle.my += (mouse.current[1] * -1 - particle.my) * 0.01;

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[particleGeometry, null, count]}>
            <meshBasicMaterial vertexColors />
        </instancedMesh>
    );
};

const Scene = ({ mouse }) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 75 }}
            style={{ width: '100vw', height: '100%' }}
            gl={{ preserveDrawingBuffer: true, alpha: true }}
        >
            <color attach="background" args={['#1a1a1a']} />
            <Particles mouse={mouse} />
            <OrbitControls />
        </Canvas>
    );
};

export default Scene;