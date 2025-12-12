import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DigiBallProps {
    isIdle: boolean;
}

const PARTICLE_COUNT = 90;

// [Effect] Explosion Particles (Keep existing logic)
const ExplosionParticles = ({ active, position }: { active: boolean; position: THREE.Vector3 }) => {
    const groupRef = useRef<THREE.Group>(null);
    const particles = useMemo(() => {
        return new Array(PARTICLE_COUNT).fill(0).map(() => ({
            pos: new THREE.Vector3(0, 0, 0),
            vel: new THREE.Vector3(
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5
            ),
            color: Math.random() > 0.5 ? '#FFD700' : '#FFFFFF',
            scale: Math.random() * 0.8 + 0.2,
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
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
                p.life = 1.0;
            });
            const timer = setTimeout(() => setIsVisible(false), 1000);
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
                    <icosahedronGeometry args={[0.5, 0]} />
                    <meshBasicMaterial color={p.color} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
};

// =============================================================================
// DIGIBALL COMPONENT
// =============================================================================

type BallState = 'SPAWNING' | 'DECIDING' | 'MOVING' | 'HOVERING' | 'TELEPORT_OUT' | 'TELEPORT_IN';

const DigiBall = ({ isIdle }: DigiBallProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const sphereMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

    // Global State
    const [exploding, setExploding] = useState(false);
    const [lastPos, setLastPos] = useState(new THREE.Vector3(0, 0, 30));
    const wasIdle = useRef(isIdle);

    // Movement State Machine
    const state = useRef<BallState>('SPAWNING');
    const stateTimer = useRef(0);

    // Movement Logic Refs
    const currentPos = useRef(new THREE.Vector3(0, 0, 30));
    const targetPos = useRef(new THREE.Vector3(0, 0, 30));
    const startPos = useRef(new THREE.Vector3(0, 0, 30));
    const controlPoint = useRef(new THREE.Vector3(0, 0, 30)); // For Bezier

    // Animation Refs
    const moveDuration = useRef(2.0);
    const moveProgress = useRef(0);
    const hoverBaseY = useRef(0); // Base Z height for hovering

    // Constants
    const BOUNDARY_RADIUS = 35; // Increased range
    const FLY_HEIGHT_MIN = 25;
    const FLY_HEIGHT_MAX = 45;

    // Helper: Random Position in Cylinder
    const getRandomPosition = () => {
        const r = BOUNDARY_RADIUS * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = FLY_HEIGHT_MIN + Math.random() * (FLY_HEIGHT_MAX - FLY_HEIGHT_MIN);
        return new THREE.Vector3(x, y, z);
    };

    // Helper: Select Next State
    const pickNextState = (): BallState => {
        const rand = Math.random();
        if (rand < 0.05) return 'TELEPORT_OUT'; // 5% Chance Teleport (Reduced from 20%)
        if (rand < 0.45) return 'HOVERING';     // 40% Chance Hover
        return 'MOVING';                       // 55% Chance Move
    };

    // Handle System Idle Changes (Appearance/Explosion)
    useEffect(() => {
        if (wasIdle.current && !isIdle) {
            // User Became Active -> Explode & Hide
            if (groupRef.current) {
                setLastPos(groupRef.current.position.clone());
            }
            setExploding(true);
            setTimeout(() => setExploding(false), 1000);

            // Reset Internal State
            state.current = 'SPAWNING';
        } else if (!wasIdle.current && isIdle) {
            // User Became Idle -> Appear
            state.current = 'SPAWNING';
            // Start near centerish or random
            currentPos.current = new THREE.Vector3(0, 0, 30);
            if (groupRef.current) groupRef.current.position.copy(currentPos.current);
        }
        wasIdle.current = isIdle;
    }, [isIdle]);

    useFrame((threeState, delta) => {
        if (!groupRef.current) return;

        // 1. System Visibility Logic (Global Scale)
        const targetGlobalScale = isIdle ? 1 : 0;
        const currentGlobalScale = groupRef.current.scale.x;
        const lerpRate = isIdle ? 0.05 : 0.3;
        let nextGlobalScale = THREE.MathUtils.lerp(currentGlobalScale, targetGlobalScale, lerpRate);

        if (isIdle) {
            // Ensure visible when active
            if (nextGlobalScale > 0.01) {
                groupRef.current.visible = true;
            }

            // =========================================================
            // STATE MACHINE LOOP
            // =========================================================

            switch (state.current) {
                case 'SPAWNING':
                    // Just a transitional state to ensure we start full scale
                    nextGlobalScale = THREE.MathUtils.lerp(currentGlobalScale, 1.0, 0.05);
                    if (Math.abs(nextGlobalScale - 1) < 0.01) {
                        state.current = 'DECIDING';
                    }
                    break;

                case 'DECIDING':
                    const next = pickNextState();
                    state.current = next;
                    stateTimer.current = 0;

                    if (next === 'MOVING') {
                        // Setup Bezier Move
                        startPos.current.copy(currentPos.current);
                        targetPos.current = getRandomPosition();

                        // Calculate Control Point (Midpoint + Random Offset)
                        const mid = new THREE.Vector3().addVectors(startPos.current, targetPos.current).multiplyScalar(0.5);
                        const offset = new THREE.Vector3(
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 30,
                            (Math.random() - 0.5) * 10
                        );
                        controlPoint.current.addVectors(mid, offset);

                        // Variable Speed: 1.5s (Fast) to 4.5s (Slow)
                        moveDuration.current = 1.5 + Math.random() * 3.0;
                        moveProgress.current = 0;
                    }
                    else if (next === 'HOVERING') {
                        // Setup Hover
                        hoverBaseY.current = currentPos.current.z;
                        moveDuration.current = 3.0 + Math.random() * 3.0; // Hover for 3~6s
                    }
                    // TELEPORT_OUT needs no setup
                    break;

                case 'MOVING':
                    moveProgress.current += delta / moveDuration.current;
                    if (moveProgress.current >= 1) {
                        state.current = 'DECIDING';
                        currentPos.current.copy(targetPos.current);
                    } else {
                        // Quadratic Bezier: (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
                        const t = moveProgress.current;

                        // SmoothStep for ease-in-out
                        const easeT = t * t * (3 - 2 * t);

                        const p0 = startPos.current;
                        const p1 = controlPoint.current;
                        const p2 = targetPos.current;

                        const x = (1 - easeT) * (1 - easeT) * p0.x + 2 * (1 - easeT) * easeT * p1.x + easeT * easeT * p2.x;
                        const y = (1 - easeT) * (1 - easeT) * p0.y + 2 * (1 - easeT) * easeT * p1.y + easeT * easeT * p2.y;
                        const z = (1 - easeT) * (1 - easeT) * p0.z + 2 * (1 - easeT) * easeT * p1.z + easeT * easeT * p2.z;

                        currentPos.current.set(x, y, z);
                    }
                    break;

                case 'HOVERING':
                    stateTimer.current += delta;
                    if (stateTimer.current > moveDuration.current) {
                        state.current = 'DECIDING';
                    } else {
                        // Bobbing Motion
                        const bobOffset = Math.sin(threeState.clock.getElapsedTime() * 2) * 2;
                        currentPos.current.setZ(hoverBaseY.current + bobOffset);
                    }
                    break;

                case 'TELEPORT_OUT':
                    // Shrink to 0
                    nextGlobalScale = THREE.MathUtils.lerp(currentGlobalScale, 0, 0.1);
                    if (nextGlobalScale < 0.05) {
                        // Position Reset
                        currentPos.current = getRandomPosition();
                        groupRef.current.position.copy(currentPos.current);
                        state.current = 'TELEPORT_IN';
                    }
                    break;

                case 'TELEPORT_IN':
                    // Grow to 1
                    nextGlobalScale = THREE.MathUtils.lerp(currentGlobalScale, 1, 0.1);
                    if (Math.abs(nextGlobalScale - 1) < 0.01) {
                        state.current = 'DECIDING';
                    }
                    break;
            }
        } else {
            // !isIdle scale down logic
            if (nextGlobalScale < 0.01) {
                groupRef.current.visible = false;
            } else {
                groupRef.current.visible = true;
            }
        }

        // Apply Transforms
        groupRef.current.scale.setScalar(nextGlobalScale);
        groupRef.current.position.copy(currentPos.current);

        // Slow Rotation
        groupRef.current.rotation.x += delta * 0.2;
        groupRef.current.rotation.y += delta * 0.3;

        // Color Animation (Rainbow HSL)
        if (sphereMatRef.current) {
            const t = threeState.clock.getElapsedTime();
            const hue = (t * 0.1) % 1;
            sphereMatRef.current.color.setHSL(hue, 1.0, 0.5);
            sphereMatRef.current.emissive.setHSL(hue, 1.0, 0.2);
        }
    });

    return (
        <>
            <group ref={groupRef}>
                {/* [DigiBall Sphere] */}
                <mesh>
                    <sphereGeometry args={[2.5, 64, 64]} />
                    <meshPhysicalMaterial
                        ref={sphereMatRef}
                        roughness={0.1}
                        metalness={0.2}
                        transmission={0.1}
                        thickness={1}
                        clearcoat={1}
                        clearcoatRoughness={0}
                    />
                </mesh>
            </group>

            {/* Explosion Effect (Triggered on Exit) */}
            <ExplosionParticles active={exploding} position={lastPos} />
        </>
    );
};

export default DigiBall;
