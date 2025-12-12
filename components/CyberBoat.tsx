import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CyberBoatProps {
    isIdle: boolean;
}

const PARTICLE_COUNT = 90;

// [이펙트] 팝 터지는 입자 효과 (기존 유지)
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
            color: Math.random() > 0.5 ? '#FFD700' : '#FFFFFF', // 골드 & 화이트
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

// [메인 컴포넌트] 구체 형상 + 초기 비행 로직
const CyberBoat = ({ isIdle }: CyberBoatProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const sphereMatRef = useRef<THREE.MeshPhysicalMaterial>(null); // 재질 제어용 Ref

    const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0));
    const [exploding, setExploding] = useState(false);
    const [lastPos, setLastPos] = useState(new THREE.Vector3(0, 0, 30));
    const wasIdle = useRef(isIdle);

    useEffect(() => {
        if (wasIdle.current && !isIdle) {
            if (groupRef.current) {
                setLastPos(groupRef.current.position.clone());
            }
            setExploding(true);
            setTimeout(() => setExploding(false), 1000);
        }
        wasIdle.current = isIdle;
    }, [isIdle]);

    // **[중요] 초기 설정값으로 복귀 (이동 범위 제한)**
    const BOUNDARY_RADIUS = 25;
    const SPEED = 0.02;
    const FLY_HEIGHT = 30;
    const Z_VARIANCE = 8;

    const generateNewTarget = () => {
        const r = BOUNDARY_RADIUS * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        // Z축 변화도 과하지 않게 초기값 유지
        const zOffset = (Math.random() - 0.5) * 2 * Z_VARIANCE;
        return new THREE.Vector3(x, y, zOffset);
    };

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // 1. [등장/퇴장] 스케일 애니메이션 (비대칭 Lerp)
        const targetScale = isIdle ? 1 : 0;
        const currentScale = groupRef.current.scale.x;

        // 등장할 땐 부드럽게(0.05), 사라질 땐 임팩트있게 빠르게(0.3)
        const lerpSpeed = isIdle ? 0.05 : 0.3;
        const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, lerpSpeed);

        if (nextScale < 0.01) {
            groupRef.current.visible = false;
        } else {
            groupRef.current.visible = true;
        }
        groupRef.current.scale.setScalar(nextScale);

        // 2. [자유 비행 로직] (사라질 때는 움직임 정지)
        // 사라지는 중(!isIdle)일 때는 위치 업데이트를 하지 않아 제자리에서 사라지게 함 (폭발 이펙트 위치 고정)
        const t = state.clock.getElapsedTime(); // t를 이 위치로 이동하여 아래 색상 애니메이션에서도 사용 가능하게 함
        if (isIdle) {
            const currentPos = groupRef.current.position.clone();

            // 거리 계산
            const dist = Math.sqrt(
                Math.pow(currentPos.x - target.x, 2) +
                Math.pow(currentPos.y - target.y, 2) +
                Math.pow(currentPos.z - (FLY_HEIGHT + target.z), 2)
            );

            if (dist < 3) {
                setTarget(generateNewTarget());
            }

            const nextX = THREE.MathUtils.lerp(currentPos.x, target.x, SPEED);
            const nextY = THREE.MathUtils.lerp(currentPos.y, target.y, SPEED);

            const targetZ = FLY_HEIGHT + target.z + Math.sin(t * 2) * 1.5;
            const nextZ = THREE.MathUtils.lerp(currentPos.z, targetZ, SPEED * 1.5);

            groupRef.current.position.set(nextX, nextY, nextZ);
        }

        // 3. [색상 애니메이션] 단일 그라디언트 컬러 순환 (HSL)
        if (sphereMatRef.current) {
            // 시간(t)에 따라 Hue(색상) 값을 0~1 사이로 순환
            // 속도 조절: t * 0.1 (숫자가 작을수록 천천히 변함)
            const hue = (t * 0.1) % 1;

            // color: 기본 색상
            sphereMatRef.current.color.setHSL(hue, 1.0, 0.5);
            // emissive: 발광 색상 (약간 더 밝게)
            sphereMatRef.current.emissive.setHSL(hue, 1.0, 0.2);
        }
    });

    return (
        <>
            <group ref={groupRef} position={[0, 0, FLY_HEIGHT]}>
                {/* [구체 - Sphere] */}
                <mesh>
                    {/* 구체 사이즈: 반지름 2.5 (핸드팬 딤플과 비슷한 느낌) */}
                    <sphereGeometry args={[2.5, 64, 64]} />
                    <meshPhysicalMaterial
                        ref={sphereMatRef}
                        roughness={0.1}   // 매끈한 표면
                        metalness={0.2}   // 약간의 금속성
                        transmission={0.1} // 약간의 유리 느낌 (선택사항)
                        thickness={1}
                        clearcoat={1}     // 코팅된 듯한 광택
                        clearcoatRoughness={0}
                    />
                </mesh>

                {/* 바닥 그림자 (단순 오라) */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -22.5, 0]}>
                    <ringGeometry args={[1.5, 4.5, 32]} />
                    <meshBasicMaterial color="#FFFFFF" transparent opacity={0.2} />
                </mesh>
            </group>

            {/* 폭발 이펙트 */}
            <ExplosionParticles active={exploding} position={lastPos} />
        </>
    );
};

export default CyberBoat;
