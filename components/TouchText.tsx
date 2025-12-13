import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface TouchTextProps {
    isIdle: boolean;
}

const SEQUENCE = [
    { text: 'Ready', duration: 5000 },
    { text: 'Set', duration: 4000 },
    { text: 'Touch!', duration: 2000 }
];

// Color Themes
const THEMES: Record<string, { color: string; emissive: string }> = {
    'Ready': { color: '#2ecc71', emissive: '#006400' }, // Green (Emerald)
    'Set': { color: '#FFFF00', emissive: '#FFD700' },   // 채도 높은 노란색 (Yellow)
    'Touch!': { color: '#FF0000', emissive: '#CC0000' } // 채도 높은 빨강색 (Red)
};

// [Effect] Explosion Particles (Reused from CyberBoat)
const ExplosionParticles = ({ active, position }: { active: boolean; position: THREE.Vector3 }) => {
    const groupRef = useRef<THREE.Group>(null);
    const PARTICLE_COUNT = 150;
    const particles = useMemo(() => {
        return new Array(PARTICLE_COUNT).fill(0).map(() => ({
            pos: new THREE.Vector3(0, 0, 0),
            vel: new THREE.Vector3(
                (Math.random() - 0.5) * 3, // Faster expansion (1.5 -> 3)
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
            ),
            color: Math.random() > 0.5 ? '#FFD700' : '#FFFFFF', // Gold & White
            scale: Math.random() * 1.5 + 0.5, // Bigger particles (0.5~2.0)
            life: 1.0
        }));
    }, []);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (active) {
            setIsVisible(true);
            particles.forEach(p => {
                p.pos.copy(position);
                p.vel.set(
                    (Math.random() - 0.5) * 4, // More explosive spread
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                );
                p.life = 1.0 + Math.random() * 0.5; // Random life duration
            });
            const timer = setTimeout(() => setIsVisible(false), 1500); // Longer visibility
            return () => clearTimeout(timer);
        }
    }, [active, position, particles]);

    useFrame((state, delta) => {
        if (!isVisible || !groupRef.current) return;
        groupRef.current.children.forEach((child, i) => {
            const p = particles[i];
            if (p.life > 0) {
                p.pos.add(p.vel.clone().multiplyScalar(delta * 10));
                p.life -= delta * 1.5;
                child.position.copy(p.pos);
                child.scale.setScalar(p.scale * p.life);
                (child as THREE.Mesh).visible = true;
                // Add rotation for dynamic feel
                child.rotation.x += delta * 2;
                child.rotation.y += delta * 2;
            } else {
                (child as THREE.Mesh).visible = false;
            }
        });
    });

    if (!isVisible) return null;

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <mesh key={i}>
                    <icosahedronGeometry args={[0.6, 0]} /> {/* Adjusted size to 0.6 as requested */}
                    <meshBasicMaterial color={p.color} transparent opacity={0.9} />
                </mesh>
            ))}
        </group>
    );
};

const TouchText = ({ isIdle }: TouchTextProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

    // Global State
    const [exploding, setExploding] = useState(false);
    const [lastPos, setLastPos] = useState(new THREE.Vector3(0, 0, 30));

    // Sequential Text Cycling
    const [stepIndex, setStepIndex] = useState(0);
    const currentText = SEQUENCE[stepIndex].text;
    const wasIdle = useRef(isIdle);

    useEffect(() => {
        const step = SEQUENCE[stepIndex];
        const timeoutId = setTimeout(() => {
            setStepIndex((prev) => (prev + 1) % SEQUENCE.length);
        }, step.duration);

        return () => clearTimeout(timeoutId);
    }, [stepIndex]);

    // Initial Position (Center, Floating above)
    // DigiBall Fly Height Min is 25. Let's put Text around 30.
    const initialPos = new THREE.Vector3(0, 0, 30);

    // Handle System Idle Changes
    useEffect(() => {
        if (wasIdle.current && !isIdle) {
            // User Became Active -> Explode & Hide
            if (groupRef.current) {
                setLastPos(groupRef.current.position.clone());
            }
            setExploding(true);
            setTimeout(() => setExploding(false), 1000);
        } else if (!wasIdle.current && isIdle) {
            // User Became Idle (Text Reappears) -> Reset to Start
            setStepIndex(0);
        }
        wasIdle.current = isIdle;
    }, [isIdle]);

    const theme = THEMES[currentText] || THEMES['Touch!'];

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Visibility Logic
        const targetGlobalScale = isIdle ? 1 : 0;
        const currentGlobalScale = groupRef.current.scale.x;
        const lerpRate = isIdle ? 0.05 : 0.3;
        const nextGlobalScale = THREE.MathUtils.lerp(currentGlobalScale, targetGlobalScale, lerpRate);

        if (isIdle) {
            if (nextGlobalScale > 0.01) groupRef.current.visible = true;
        } else {
            if (nextGlobalScale < 0.01) groupRef.current.visible = false;
        }

        // Breathing Effect (Organic Scale Oscillation)
        const time = state.clock.getElapsedTime();
        const breathSpeed = 2.0;
        const breathAmp = 0.01; // Reduced from 0.02 to 0.01 for subtler breathing
        const breath = 1.0 + Math.sin(time * breathSpeed) * breathAmp;

        // Apply Transforms
        groupRef.current.scale.setScalar(nextGlobalScale * breath);

        // Bobbing Motion (Hovering)
        const bobOffset = Math.sin(time * 2) * 2;
        groupRef.current.position.set(
            initialPos.x,
            initialPos.y,
            initialPos.z + bobOffset
        );

        // Color Animation (Pulse Intensity only, keep Hue fixed)
        if (materialRef.current) {
            const pulseSpeed = 3.0;
            const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;

            // Lerp color slightly for gradient feel or aliveness
            const baseColor = new THREE.Color(theme.color);
            const targetEmissive = new THREE.Color(theme.emissive);

            // Pulse emissive intensity
            const finalEmissiveIntensity = 0.5 + pulse * 0.5;

            materialRef.current.color.copy(baseColor);
            materialRef.current.emissive.copy(targetEmissive);
            materialRef.current.emissiveIntensity = finalEmissiveIntensity;
        }
    });

    return (
        <>
            <group ref={groupRef} position={[initialPos.x, initialPos.y, initialPos.z]}>
                <Center key={currentText}>
                    <Text3D
                        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                        size={12}
                        height={2}
                        curveSegments={12}
                        bevelEnabled
                        bevelThickness={0.5}
                        bevelSize={0.3}
                        bevelOffset={0}
                        bevelSegments={5}
                    >
                        {currentText}
                        <meshPhysicalMaterial
                            ref={materialRef}
                            roughness={0.2}
                            metalness={0.1}
                            transmission={0.0} // Removed transmission for more solid color pop
                            thickness={1}
                            clearcoat={0.5}
                            clearcoatRoughness={0.1}
                        />
                    </Text3D>
                </Center>
            </group>

            {/* Explosion Effect */}
            <ExplosionParticles active={exploding} position={lastPos} />
        </>
    );
};

export default TouchText;
