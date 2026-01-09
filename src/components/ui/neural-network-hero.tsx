'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

// ===================== PLEXUS CONFIGURATION =====================
const PARTICLE_COUNT = 300;
const CONNECTION_DISTANCE = 1.8;
const PARTICLE_SIZE = 0.04;
const ROTATION_SPEED = 0.03;
const BREATHE_SPEED = 0.5;
const BREATHE_AMPLITUDE = 0.08;
const MOUSE_INFLUENCE = 0.15;
const BOUNDS = 5;

// ===================== PLEXUS NETWORK COMPONENT =====================
function PlexusNetwork() {
    const pointsRef = useRef<THREE.Points>(null!);
    const linesRef = useRef<THREE.LineSegments>(null!);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { size } = useThree();

    // Generate initial particle positions
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            // Distribute particles in a sphere-like volume
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.random() * BOUNDS * 0.8;

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random velocities for organic movement
            velocities[i3] = (Math.random() - 0.5) * 0.005;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;
        }

        return { positions, velocities };
    }, []);

    // Pre-allocate line geometry (max possible connections)
    const maxConnections = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
    const linePositions = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);
    const lineColors = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
            mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [size]);

    // Animation loop
    useFrame((state) => {
        if (!pointsRef.current || !linesRef.current) return;

        const time = state.clock.elapsedTime;
        const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // Breathing effect
        const breathe = 1 + Math.sin(time * BREATHE_SPEED) * BREATHE_AMPLITUDE;

        // Update particle positions
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Add velocity
            positionsArray[i3] += velocities[i3];
            positionsArray[i3 + 1] += velocities[i3 + 1];
            positionsArray[i3 + 2] += velocities[i3 + 2];

            // Apply breathing
            const dist = Math.sqrt(
                positionsArray[i3] ** 2 +
                positionsArray[i3 + 1] ** 2 +
                positionsArray[i3 + 2] ** 2
            );

            if (dist > 0) {
                const normalizedBreatheFactor = (breathe - 1) * 0.3;
                positionsArray[i3] *= 1 + normalizedBreatheFactor / dist;
                positionsArray[i3 + 1] *= 1 + normalizedBreatheFactor / dist;
                positionsArray[i3 + 2] *= 1 + normalizedBreatheFactor / dist;
            }

            // Boundary check - wrap around
            for (let j = 0; j < 3; j++) {
                if (Math.abs(positionsArray[i3 + j]) > BOUNDS) {
                    velocities[i3 + j] *= -1;
                    positionsArray[i3 + j] = Math.sign(positionsArray[i3 + j]) * BOUNDS;
                }
            }
        }

        // Calculate connections
        let lineIndex = 0;
        const lineGeometry = linesRef.current.geometry;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                const i3 = i * 3;
                const j3 = j * 3;

                const dx = positionsArray[i3] - positionsArray[j3];
                const dy = positionsArray[i3 + 1] - positionsArray[j3 + 1];
                const dz = positionsArray[i3 + 2] - positionsArray[j3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < CONNECTION_DISTANCE) {
                    const opacity = 1 - distance / CONNECTION_DISTANCE;
                    const idx = lineIndex * 6;

                    // Line start
                    linePositions[idx] = positionsArray[i3];
                    linePositions[idx + 1] = positionsArray[i3 + 1];
                    linePositions[idx + 2] = positionsArray[i3 + 2];

                    // Line end
                    linePositions[idx + 3] = positionsArray[j3];
                    linePositions[idx + 4] = positionsArray[j3 + 1];
                    linePositions[idx + 5] = positionsArray[j3 + 2];

                    // Cyan color with opacity falloff (RGB: 6, 182, 212 normalized)
                    const r = 0.024 * opacity;
                    const g = 0.714 * opacity;
                    const b = 0.831 * opacity;

                    lineColors[idx] = r;
                    lineColors[idx + 1] = g;
                    lineColors[idx + 2] = b;
                    lineColors[idx + 3] = r;
                    lineColors[idx + 4] = g;
                    lineColors[idx + 5] = b;

                    lineIndex++;
                }
            }
        }

        // Update line geometry
        lineGeometry.setDrawRange(0, lineIndex * 2);
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;

        // Update points
        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Global rotation with mouse influence
        const targetRotationY = mouseRef.current.x * MOUSE_INFLUENCE;
        const targetRotationX = mouseRef.current.y * MOUSE_INFLUENCE;

        pointsRef.current.rotation.y += (targetRotationY - pointsRef.current.rotation.y) * 0.02;
        pointsRef.current.rotation.x += (targetRotationX - pointsRef.current.rotation.x) * 0.02;
        pointsRef.current.rotation.z += ROTATION_SPEED * 0.01;

        linesRef.current.rotation.copy(pointsRef.current.rotation);
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={PARTICLE_COUNT}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={PARTICLE_SIZE}
                    color="#06b6d4"
                    transparent
                    opacity={0.9}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Connection Lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={maxConnections * 2}
                        array={linePositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={maxConnections * 2}
                        array={lineColors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={0.6}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    );
}

// ===================== 3D BACKGROUND SCENE =====================
function PlexusBackground() {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Defer Canvas rendering to client-side only to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useGSAP(
        () => {
            if (!canvasRef.current) return;
            gsap.set(canvasRef.current, {
                autoAlpha: 0,
                scale: 1.1,
            });
            gsap.to(canvasRef.current, {
                autoAlpha: 1,
                scale: 1,
                duration: 2.0,
                ease: 'power3.out',
            });
        },
        { scope: canvasRef, dependencies: [isMounted] }
    );

    return (
        <div ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full bg-slate-950" aria-hidden>
            {isMounted && (
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
                    gl={{ antialias: true, alpha: false }}
                    dpr={[1, 1.5]}
                    style={{ width: '100%', height: '100%' }}
                >
                    <color attach="background" args={['#020617']} />
                    <fog attach="fog" args={['#020617', 5, 15]} />
                    <PlexusNetwork />
                </Canvas>
            )}

            {/* Radial gradient overlay for text readability */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 80% 50% at 30% 50%, rgba(2, 6, 23, 0.9) 0%, transparent 70%),
            linear-gradient(to bottom, transparent 0%, rgba(2, 6, 23, 0.7) 50%, rgba(2, 6, 23, 0.95) 100%)
          `,
                }}
            />

            {/* Additional subtle gradient from bottom */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
    );
}

// ===================== HERO COMPONENT =====================
interface HeroProps {
    title: string;
    description: string;
    badgeText?: string;
    badgeLabel?: string;
    ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
    microDetails?: Array<string>;
}

export default function Hero({
    title,
    description,
    badgeText = 'System Online',
    badgeLabel = 'V 1.0',
    ctaButtons = [],
    microDetails = [],
}: HeroProps) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const headerRef = useRef<HTMLHeadingElement | null>(null);
    const paraRef = useRef<HTMLParagraphElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);
    const badgeRef = useRef<HTMLDivElement | null>(null);
    const microRef = useRef<HTMLUListElement | null>(null);

    useGSAP(
        () => {
            if (badgeRef.current) gsap.set(badgeRef.current, { autoAlpha: 0, y: -10 });
            if (headerRef.current) gsap.set(headerRef.current, { autoAlpha: 0, y: 30, filter: 'blur(10px)' });
            if (paraRef.current) gsap.set(paraRef.current, { autoAlpha: 0, y: 20 });
            if (ctaRef.current) gsap.set(ctaRef.current, { autoAlpha: 0, y: 20 });
            if (microRef.current) gsap.set(microRef.current.children, { autoAlpha: 0, y: 10 });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.5 });

            if (badgeRef.current) {
                tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, 0);
            }

            if (headerRef.current) {
                tl.to(
                    headerRef.current,
                    {
                        autoAlpha: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 1.2,
                    },
                    0.2
                );
            }

            if (paraRef.current) {
                tl.to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.5);
            }

            if (ctaRef.current) {
                tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.7);
            }

            if (microRef.current) {
                tl.to(
                    microRef.current.children,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                    },
                    0.9
                );
            }
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-slate-950 text-left">
            <PlexusBackground />

            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center gap-6 px-6 pb-24 pt-32 sm:px-10 lg:px-16">
                {/* Badge */}
                <div
                    ref={badgeRef}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-1.5 text-xs backdrop-blur-md"
                >
                    <span className="font-bold text-cyan-400">{badgeLabel}</span>
                    <span className="h-1 w-1 rounded-full bg-cyan-500/50" />
                    <span className="text-slate-300">{badgeText}</span>
                </div>

                {/* Title with gradient */}
                <h1
                    ref={headerRef}
                    className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:leading-[1.1]"
                    style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #ffffff 100%)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'gradientShift 8s ease infinite',
                    }}
                >
                    {title}
                </h1>

                {/* Add gradient animation keyframes via style tag */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}} />

                {/* Description */}
                <p ref={paraRef} className="max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl">
                    {description}
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-4">
                    {ctaButtons.map((button, index) => (
                        <a
                            key={index}
                            href={button.href}
                            className={`rounded-xl px-8 py-3.5 text-sm font-medium transition-all duration-300 ${button.primary
                                ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]'
                                : 'border border-slate-700 bg-slate-900/50 text-white backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-800/50'
                                }`}
                        >
                            {button.text}
                        </a>
                    ))}
                </div>

                {/* Micro Details */}
                <ul ref={microRef} className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-500">
                    {microDetails.map((detail, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/60" />
                            {detail}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
