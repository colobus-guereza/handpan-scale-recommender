
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CyberBoatProps {
    isIdle: boolean;
}

const PARTICLE_COUNT = 90;

const ExplosionParticles = ({ active, position }: { active: boolean; position: THREE.Vector3 }) => {
    const groupRef = useRef<THREE.Group>(null);
    // Store particle data: [x, y, z, vx, vy, vz, life]
    // UseRef to persist data across renders without triggering re-renders
    const particles = useMemo(() => {
        return new Array(PARTICLE_COUNT).fill(0).map(() => ({
            pos: new THREE.Vector3(0, 0, 0),
            vel: new THREE.Vector3(
                (Math.random() - 0.5) * 1.5, // Random X velocity
                (Math.random() - 0.5) * 1.5, // Random Y velocity
                (Math.random() - 0.5) * 1.5  // Random Z velocity
            ),
            color: Math.random() > 0.5 ? '#FFD700' : '#CCFF00', // Gold or Lime Green (Harmonics)
            scale: Math.random() * 0.8 + 0.2, // Random size
            life: 1.0 // 1.0 to 0.0
        }));
    }, []);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (active) {
            setIsVisible(true);
            // Reset particles to center
            particles.forEach(p => {
                p.pos.copy(position); // Start at boat position
                // Spread velocity outwards
                p.vel.set(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                p.life = 1.0;
            });

            // Hide after animation duration
            const timer = setTimeout(() => setIsVisible(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [active, position, particles]);

    useFrame((state, delta) => {
        if (!isVisible || !groupRef.current) return;

        // Custom manual update of particle meshes
        groupRef.current.children.forEach((child, i) => {
            const p = particles[i];
            if (p.life > 0) {
                p.pos.add(p.vel.clone().multiplyScalar(delta * 10)); // Move
                p.life -= delta * 1.5; // Decay

                child.position.copy(p.pos);
                child.scale.setScalar(p.scale * p.life); // Shrink
                (child as THREE.Mesh).visible = true;
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
                    <icosahedronGeometry args={[0.5, 0]} /> {/* Small geometric particles */}
                    <meshBasicMaterial color={p.color} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
};

const CyberBoat = ({ isIdle }: CyberBoatProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const boatRef = useRef<THREE.Group>(null);

    // 상태: 현재 목표 지점 (Target Position)
    const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0));

    // Explosion State
    const [exploding, setExploding] = useState(false);
    const [lastPos, setLastPos] = useState(new THREE.Vector3(0, 0, 30));
    const wasIdle = useRef(isIdle);

    // Trigger Explosion on Exit
    useEffect(() => {
        if (wasIdle.current && !isIdle) {
            // Transition from Idle -> Active (Exit)
            if (groupRef.current) {
                setLastPos(groupRef.current.position.clone());
            }
            setExploding(true);
            setTimeout(() => setExploding(false), 1000);
        }
        wasIdle.current = isIdle;
    }, [isIdle]);

    const BOUNDARY_RADIUS = 15;
    const SPEED = 0.02;
    const FLY_HEIGHT = 30;

    const generateNewTarget = () => {
        const r = BOUNDARY_RADIUS * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;

        // Digipan View: X-Y Plane is horizontal
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        return new THREE.Vector3(x, y, 0);
    };

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // 1. [등장/퇴장] 스케일 애니메이션 (Lerp) -> "Fade Out" effectively via Scale
        const targetScale = isIdle ? 1 : 0;
        const currentScale = groupRef.current.scale.x;
        const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);

        if (nextScale < 0.01) {
            groupRef.current.visible = false;
            // No return here to allow explosion to be rendered independently if needed, 
            // but explosion handles itself in separate component
        } else {
            groupRef.current.visible = true;
        }
        groupRef.current.scale.set(nextScale, nextScale, nextScale);


        // 2. [자유 비행 로직]
        const currentPos = groupRef.current.position.clone();
        currentPos.z = 0;
        const dist = Math.sqrt(
            Math.pow(currentPos.x - target.x, 2) +
            Math.pow(currentPos.y - target.y, 2)
        );

        if (dist < 3) {
            setTarget(generateNewTarget());
        }

        const nextX = THREE.MathUtils.lerp(groupRef.current.position.x, target.x, SPEED);
        const nextY = THREE.MathUtils.lerp(groupRef.current.position.y, target.y, SPEED);

        const t = state.clock.getElapsedTime();
        const nextZ = FLY_HEIGHT + Math.sin(t * 2) * 2.25;

        groupRef.current.position.set(nextX, nextY, nextZ);


        // 3. [방향 전환]
        if (boatRef.current) {
            const lookTarget = new THREE.Vector3(target.x, target.y, nextZ);
            groupRef.current.lookAt(lookTarget);
            groupRef.current.up.set(0, 0, 1);
            groupRef.current.lookAt(target.x, target.y, nextZ);

            boatRef.current.rotation.z = Math.sin(t * 3) * 0.1;
            boatRef.current.rotation.x = Math.sin(t * 2) * 0.05;
        }
    });

    return (
        <>
            <group ref={groupRef} position={[0, 0, FLY_HEIGHT]}>
                {/* 돗단배 모델 그룹 */}
                <group ref={boatRef}>

                    {/* [선체 - Hull] Brilliant Gold Theme */}
                    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <coneGeometry args={[4.5, 2.25, 4]} />
                        <meshStandardMaterial
                            color="#FFD700" // Pure Brilliant Gold
                            emissive="#FF8C00" // Dark Orange Gold Glow
                            emissiveIntensity={0.8}
                            roughness={0.1} // Very shiny
                            metalness={1.0} // Full metal
                            flatShading={true}
                        />
                    </mesh>

                    {/* [돛 - Sail] Golden Light Panel */}
                    <mesh position={[0, 5.25, 1.5]} rotation={[-0.2, 0, 0]}>
                        <boxGeometry args={[0.3, 9, 6]} />
                        <meshPhysicalMaterial
                            color="#FFFFE0" // Light Yellow Gold
                            transparent
                            opacity={0.8}
                            emissive="#FFD700" // Gold Glow
                            emissiveIntensity={1.2}
                            roughness={0}
                            transmission={0.2}
                            thickness={1}
                        />
                    </mesh>

                    {/* [후미등] Intense Gold/Orange */}
                    <pointLight position={[0, 3, 4.5]} distance={22.5} intensity={3} color="#FF4500" />
                </group>

                {/* 바닥에 비치는 황금 강물결 오라 */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -22.5, 0]}>
                    <ringGeometry args={[1.5, 4.5, 32]} />
                    <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
                </mesh>
            </group>

            {/* Particle Explosion on Exit - Rendered in World Space (outside groupRef which scales down) */}
            <ExplosionParticles active={exploding} position={lastPos} />
        </>
    );
};

export default CyberBoat;
