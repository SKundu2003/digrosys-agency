'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

// ===================== PLEXUS CONFIGURATION =====================
// Desktop configuration
const DESKTOP_PARTICLE_COUNT = 100;
const DESKTOP_CONNECTION_DISTANCE = 1.8;
const DESKTOP_ROTATION_SPEED = 0.03;

// Mobile configuration (reduced for performance)
const MOBILE_PARTICLE_COUNT = 30;
const MOBILE_CONNECTION_DISTANCE = 2.2; // Slightly larger to compensate for fewer particles
const MOBILE_ROTATION_SPEED = 0.015; // Half speed to save GPU cycles

// Shared configuration
const PARTICLE_SIZE = 0.04;
const BREATHE_SPEED = 0.5;
const BREATHE_AMPLITUDE = 0.08;
const MOUSE_INFLUENCE = 0.15;
const BOUNDS = 5;

// ===================== PLEXUS NETWORK COMPONENT =====================
interface PlexusNetworkProps {
    isMobile: boolean;
}

function PlexusNetwork({ isMobile }: PlexusNetworkProps) {
    const pointsRef = useRef<THREE.Points>(null!);
    const linesRef = useRef<THREE.LineSegments>(null!);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { size } = useThree();

    // Adaptive configuration based on device
    const particleCount = isMobile ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
    const connectionDistance = isMobile ? MOBILE_CONNECTION_DISTANCE : DESKTOP_CONNECTION_DISTANCE;
    const rotationSpeed = isMobile ? MOBILE_ROTATION_SPEED : DESKTOP_ROTATION_SPEED;

    // Generate initial particle positions
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Distribute particles in a sphere-like volume
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = Math.random() * BOUNDS * 0.8;

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Random velocities for organic movement (slower on mobile)
            const velocityMultiplier = isMobile ? 0.003 : 0.005;
            velocities[i3] = (Math.random() - 0.5) * velocityMultiplier;
            velocities[i3 + 1] = (Math.random() - 0.5) * velocityMultiplier;
            velocities[i3 + 2] = (Math.random() - 0.5) * velocityMultiplier;
        }

        return { positions, velocities };
    }, [particleCount, isMobile]);

    // Pre-allocate line geometry (max possible connections)
    const maxConnections = (particleCount * (particleCount - 1)) / 2;
    const linePositions = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);
    const lineColors = useMemo(() => new Float32Array(maxConnections * 6), [maxConnections]);

    // Mouse tracking (disabled on mobile for performance)
    useEffect(() => {
        if (isMobile) return; // Skip mouse tracking on mobile

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
            mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [size, isMobile]);

    // Animation loop
    useFrame((state) => {
        if (!pointsRef.current || !linesRef.current) return;

        const time = state.clock.elapsedTime;
        const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // Breathing effect (reduced amplitude on mobile)
        const breatheAmp = isMobile ? BREATHE_AMPLITUDE * 0.5 : BREATHE_AMPLITUDE;
        const breathe = 1 + Math.sin(time * BREATHE_SPEED) * breatheAmp;

        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
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

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const i3 = i * 3;
                const j3 = j * 3;

                const dx = positionsArray[i3] - positionsArray[j3];
                const dy = positionsArray[i3 + 1] - positionsArray[j3 + 1];
                const dz = positionsArray[i3 + 2] - positionsArray[j3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < connectionDistance) {
                    const opacity = 1 - distance / connectionDistance;
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

        // Global rotation with mouse influence (disabled on mobile)
        if (!isMobile) {
            const targetRotationY = mouseRef.current.x * MOUSE_INFLUENCE;
            const targetRotationX = mouseRef.current.y * MOUSE_INFLUENCE;
            pointsRef.current.rotation.y += (targetRotationY - pointsRef.current.rotation.y) * 0.02;
            pointsRef.current.rotation.x += (targetRotationX - pointsRef.current.rotation.x) * 0.02;
        }

        // Continuous slow rotation
        pointsRef.current.rotation.z += rotationSpeed * 0.01;
        linesRef.current.rotation.copy(pointsRef.current.rotation);
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={isMobile ? PARTICLE_SIZE * 1.5 : PARTICLE_SIZE}
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
                        args={[linePositions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[lineColors, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={isMobile ? 0.8 : 0.6}
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
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        setIsMounted(true);

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
                    gl={{ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' }}
                    dpr={[1, 1.5]} // Cap pixel ratio to prevent 3x/4x rendering on high-DPI devices
                    style={{ width: '100%', height: '100%' }}
                    frameloop={isMobile ? 'demand' : 'always'} // Reduce frame rate pressure on mobile
                >
                    <color attach="background" args={['#020617']} />
                    <fog attach="fog" args={['#020617', 5, 15]} />
                    <PlexusNetwork isMobile={isMobile} />
                </Canvas>
            )}

            {/* Radial gradient overlay for text readability - strengthened for mobile */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 30% 50%, rgba(2, 6, 23, 0.95) 0%, transparent 70%),
                        linear-gradient(to bottom, transparent 0%, rgba(2, 6, 23, 0.8) 40%, rgba(2, 6, 23, 0.98) 100%)
                    `,
                }}
            />

            {/* Mobile-specific stronger overlay for improved text readability */}
            <div
                className="pointer-events-none absolute inset-0 md:opacity-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.7) 0%, rgba(2, 6, 23, 0.5) 50%, rgba(2, 6, 23, 0.7) 100%)',
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
        <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-left">
            <PlexusBackground />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-4 px-6 pb-20 pt-24 sm:gap-6 sm:px-10 sm:pb-24 sm:pt-32 lg:px-16">
                {/* Badge */}
                <div
                    ref={badgeRef}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-3 py-1 text-[10px] backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs"
                >
                    <span className="font-bold text-cyan-400">{badgeLabel}</span>
                    <span className="h-1 w-1 rounded-full bg-cyan-500/50" />
                    <span className="text-slate-300">{badgeText}</span>
                </div>

                {/* Title with gradient - responsive typography */}
                <h1
                    ref={headerRef}
                    className="max-w-4xl text-[clamp(1.75rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight"
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

                {/* Description - responsive typography */}
                <p ref={paraRef} className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl">
                    {description}
                </p>

                {/* CTA Buttons - larger touch targets on mobile */}
                <div ref={ctaRef} className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:pt-4">
                    {ctaButtons.map((button, index) => {
                        const isBookingButton = button.primary && button.text.toLowerCase().includes('book');

                        if (isBookingButton) {
                            return (
                                <button
                                    key={index}
                                    data-cal-link="souvik-kundu-y0tdcc/30min"
                                    data-cal-config='{"layout":"month_view"}'
                                    className="min-h-[48px] w-full rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-300 bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] cursor-pointer sm:w-auto sm:px-8"
                                >
                                    {button.text}
                                </button>
                            );
                        }

                        return (
                            <a
                                key={index}
                                href={button.href}
                                className={`min-h-[48px] flex items-center justify-center w-full rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-300 sm:w-auto sm:px-8 ${button.primary
                                    ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]'
                                    : 'border border-slate-700 bg-slate-900/50 text-white backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-800/50'
                                    }`}
                            >
                                {button.text}
                            </a>
                        );
                    })}
                </div>

                {/* Micro Details - responsive spacing */}
                <ul ref={microRef} className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500 sm:mt-12 sm:gap-x-8 sm:gap-y-4 sm:text-sm">
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
