/**
 * ParticleHero — hero-блок с коллективной анимацией частиц (digital liquid).
 *
 * 4 фазы (18s цикл): REST → WARP → EMBRACE → DISSOLVE → REST...
 * Все частицы подчиняются общему векторному полю + spring к origin + dead zone + mouse.
 * Вдохновение: «Паприка» Сатоси Кона — пространство перетекает, не знает жёстких границ.
 *
 * Props:
 *   text, height, particleCount, gridCols, gridRows, bgColor, particleColor, textClassName
 */
import { useEffect, useRef } from 'react';

function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

export default function ParticleHero({
    text = 'Swipe',
    height = 600,
    particleCount = 100,
    gridCols = 12,
    gridRows = 8,
    bgColor = '#F5F0E8',
    particleColor = '#0A0A08',
    textClassName = 'font-bold',
}) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const rafRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Respect reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textEl = textRef.current;
        if (!canvas || !container || !textEl) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let canvasH = height;
        let deadZone = { x: 0, y: 0, w: 0, h: 0 };
        let maxDistFromCenter = 1;

        // --- Scene state ---
        const scene = {
            time: 0,
            phase: 'REST',
            phaseTime: 0,
            phaseIndex: 0,
            warpAngle: Math.random() * Math.PI * 2,
            embraceIntensity: 0,
            dissolveProgress: 0,
            restBreathAmplitude: 1,
            cycleCount: 0,
        };

        const BASE_DURATIONS = { REST: 6, WARP: 3, EMBRACE: 5, DISSOLVE: 4 };
        const PHASE_ORDER = ['REST', 'WARP', 'EMBRACE', 'DISSOLVE'];
        let phaseDurations = { ...BASE_DURATIONS };

        const randomizeDurations = () => {
            for (const k of Object.keys(BASE_DURATIONS)) {
                phaseDurations[k] = BASE_DURATIONS[k] * (0.9 + Math.random() * 0.2);
            }
        };
        randomizeDurations();

        // --- Init ---
        const initParticles = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = width * dpr;
            canvas.height = canvasH * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${canvasH}px`;
            ctx.scale(dpr, dpr);

            const textRect = textEl.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const padX = 120;
            const padY = 80;
            deadZone = {
                x: textRect.left - containerRect.left - padX,
                y: textRect.top - containerRect.top - padY,
                w: textRect.width + padX * 2,
                h: textRect.height + padY * 2,
            };

            const cx = width / 2;
            const cy = canvasH / 2;

            const particles = [];
            const cellW = width / gridCols;
            const cellH = canvasH / gridRows;

            for (let i = 0; i < particleCount; i++) {
                const col = i % gridCols;
                const row = Math.floor(i / gridCols) % gridRows;
                const originX = col * cellW + cellW / 2 + (Math.random() - 0.5) * cellW * 0.4;
                const originY = row * cellH + cellH / 2 + (Math.random() - 0.5) * cellH * 0.4;
                const dx = originX - cx;
                const dy = originY - cy;

                particles.push({
                    x: originX,
                    y: originY,
                    vx: 0,
                    vy: 0,
                    originX,
                    originY,
                    size: 2 + Math.random() * 3,
                    phase: Math.random() * Math.PI * 2,
                    opacity: 1,
                    distanceFromCenter: Math.sqrt(dx * dx + dy * dy),
                });
            }

            maxDistFromCenter = Math.max(...particles.map(p => p.distanceFromCenter), 1);
            particlesRef.current = particles;
        };

        // --- Dead zone repulsion ---
        const getDeadZoneForce = (p) => {
            const cx = deadZone.x + deadZone.w / 2;
            const cy = deadZone.y + deadZone.h / 2;
            const buffer = 100;
            const dx = Math.max(deadZone.x - p.x, 0, p.x - (deadZone.x + deadZone.w));
            const dy = Math.max(deadZone.y - p.y, 0, p.y - (deadZone.y + deadZone.h));
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > buffer) return { fx: 0, fy: 0 };
            const dirX = p.x - cx;
            const dirY = p.y - cy;
            const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const strength = ((buffer - dist) / buffer) ** 2 * 2.5;
            return { fx: (dirX / len) * strength, fy: (dirY / len) * strength };
        };

        // --- Mouse repulsion ---
        const getMouseForce = (p) => {
            if (!mouseRef.current.active) return { fx: 0, fy: 0 };
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 150;
            if (dist > radius) return { fx: 0, fy: 0 };
            const strength = ((radius - dist) / radius) * 1.5;
            const len = dist || 1;
            return { fx: (dx / len) * strength, fy: (dy / len) * strength };
        };

        // --- Embrace force: attract to dead zone boundary ---
        const getEmbraceForce = (p, intensity) => {
            if (intensity < 0.01) return { fx: 0, fy: 0 };
            // Nearest point on dead zone boundary (buffer/2 outside)
            const bufferHalf = 50;
            const targetX = Math.max(deadZone.x - bufferHalf, Math.min(p.x, deadZone.x + deadZone.w + bufferHalf));
            const targetY = Math.max(deadZone.y - bufferHalf, Math.min(p.y, deadZone.y + deadZone.h + bufferHalf));
            // Clamp to boundary
            let bx = targetX, by = targetY;
            if (p.x > deadZone.x - bufferHalf && p.x < deadZone.x + deadZone.w + bufferHalf &&
                p.y > deadZone.y - bufferHalf && p.y < deadZone.y + deadZone.h + bufferHalf) {
                // Inside expanded zone — push to nearest edge
                const dLeft = p.x - (deadZone.x - bufferHalf);
                const dRight = (deadZone.x + deadZone.w + bufferHalf) - p.x;
                const dTop = p.y - (deadZone.y - bufferHalf);
                const dBottom = (deadZone.y + deadZone.h + bufferHalf) - p.y;
                const minD = Math.min(dLeft, dRight, dTop, dBottom);
                if (minD === dLeft) bx = deadZone.x - bufferHalf;
                else if (minD === dRight) bx = deadZone.x + deadZone.w + bufferHalf;
                else if (minD === dTop) by = deadZone.y - bufferHalf;
                else by = deadZone.y + deadZone.h + bufferHalf;
            }
            const dx = bx - p.x;
            const dy = by - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const strength = intensity * 0.8;
            return { fx: (dx / dist) * strength, fy: (dy / dist) * strength };
        };

        // --- Phase transition ---
        const advancePhase = () => {
            scene.phaseIndex = (scene.phaseIndex + 1) % PHASE_ORDER.length;
            scene.phase = PHASE_ORDER[scene.phaseIndex];
            scene.phaseTime = 0;

            if (scene.phase === 'REST') {
                scene.cycleCount++;
                randomizeDurations();
            }
            if (scene.phase === 'WARP') {
                scene.warpAngle = Math.random() * Math.PI * 2;
            }
        };

        // --- Animation loop ---
        const dt = 1 / 60; // approximate frame time in seconds
        const animate = () => {
            scene.time += 0.01;
            scene.phaseTime += dt;

            const phaseDuration = phaseDurations[scene.phase];

            // Phase transition
            if (scene.phaseTime >= phaseDuration) {
                advancePhase();
            }

            // If reduced motion — freeze in REST with minimal breathing
            if (prefersReduced) {
                scene.phase = 'REST';
                scene.phaseTime = 0;
            }

            const pt = scene.phaseTime;
            const pd = phaseDurations[scene.phase];
            const t = scene.time;

            // Phase blend (0.5s crossfade)
            const fadeZone = 0.5;
            const nextPhaseIndex = (scene.phaseIndex + 1) % PHASE_ORDER.length;
            const blendToNext = pt > pd - fadeZone ? smoothstep(pd - fadeZone, pd, pt) : 0;

            // Phase-specific parameters
            let warpStrength = 0, warpAngle = scene.warpAngle;
            let embraceIntensity = 0;
            let dissolveProgress = 0;
            let breathScale = 1;

            if (scene.phase === 'REST') {
                scene.restBreathAmplitude = 1 + Math.sin(t * 0.15) * 0.5;
                breathScale = 1;
            } else if (scene.phase === 'WARP') {
                warpAngle = scene.warpAngle + Math.sin(pt * 2) * Math.PI;
                warpStrength = Math.sin((pt / pd) * Math.PI);
                breathScale = 0.3;
            } else if (scene.phase === 'EMBRACE') {
                embraceIntensity = Math.sin((pt / pd) * Math.PI);
                scene.embraceIntensity = embraceIntensity;
                breathScale = 0.5;
            } else if (scene.phase === 'DISSOLVE') {
                dissolveProgress = Math.min(pt / pd, 1);
                scene.dissolveProgress = dissolveProgress;
                breathScale = 0.2;
            }

            // Blend with next phase
            const nextPhase = PHASE_ORDER[nextPhaseIndex];
            if (blendToNext > 0) {
                if (nextPhase === 'WARP') {
                    warpStrength = warpStrength * (1 - blendToNext);
                }
                if (nextPhase === 'REST') {
                    breathScale = breathScale * (1 - blendToNext) + 1 * blendToNext;
                }
            }

            ctx.clearRect(0, 0, width, canvasH);

            const particles = particlesRef.current;
            const breathAmp = scene.restBreathAmplitude * breathScale;

            for (const p of particles) {
                // --- Breathing ---
                const breatheX = Math.sin(t + p.phase) * 4 * breathAmp;
                const breatheY = Math.cos(t * 0.8 + p.phase) * 4 * breathAmp;
                const targetX = p.originX + breatheX;
                const targetY = p.originY + breatheY;

                // --- Spring to origin (weakened during EMBRACE) ---
                const springK = scene.phase === 'EMBRACE' ? 0.04 * (1 - embraceIntensity * 0.8) :
                    scene.phase === 'DISSOLVE' ? 0.08 : 0.04;
                const springX = (targetX - p.x) * springK;
                const springY = (targetY - p.y) * springK;

                // --- Forces ---
                const dead = getDeadZoneForce(p);
                const mouse = getMouseForce(p);

                let fx = springX + dead.fx + mouse.fx;
                let fy = springY + dead.fy + mouse.fy;

                // WARP: global directional force
                if (warpStrength > 0.01) {
                    fx += Math.cos(warpAngle) * warpStrength * 3;
                    fy += Math.sin(warpAngle) * warpStrength * 3;
                }

                // EMBRACE: attract to text boundary
                if (embraceIntensity > 0.01) {
                    const emb = getEmbraceForce(p, embraceIntensity);
                    fx += emb.fx;
                    fy += emb.fy;
                }

                // --- Velocity ---
                p.vx += fx;
                p.vy += fy;
                p.vx *= 0.85;
                p.vy *= 0.85;
                p.x += p.vx;
                p.y += p.vy;

                // --- DISSOLVE: wave opacity ---
                if (scene.phase === 'DISSOLVE') {
                    const normDist = p.distanceFromCenter / maxDistFromCenter;
                    let targetOpacity;
                    const isReverse = scene.cycleCount % 2 === 1;
                    const nd = isReverse ? (1 - normDist) : normDist;

                    if (dissolveProgress < 0.5) {
                        // Disappear wave: edges first (or center first if reverse)
                        const wp = 1 - dissolveProgress * 2;
                        targetOpacity = smoothstep(wp - 0.15, wp + 0.15, nd);
                    } else {
                        // Reappear wave: center first (or edges first if reverse)
                        const wp = (dissolveProgress - 0.5) * 2;
                        targetOpacity = smoothstep(wp - 0.15, wp + 0.15, 1 - nd);
                    }
                    p.opacity += (targetOpacity - p.opacity) * 0.1;
                } else {
                    // Restore opacity
                    p.opacity += (1 - p.opacity) * 0.05;
                }

                // --- Render ---
                if (p.opacity < 0.01) continue;

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const angle = Math.atan2(p.vy, p.vx);
                const stretch = 1 + Math.min(speed * 0.8, 2);

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.translate(p.x, p.y);
                ctx.rotate(angle);
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * stretch, p.size / stretch, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.restore();
            }

            // --- Debug (uncomment to tune timings) ---
            // ctx.fillStyle = 'rgba(0,0,0,0.5)';
            // ctx.font = '11px monospace';
            // ctx.fillText(`${scene.phase} ${pt.toFixed(1)}s / ${pd.toFixed(1)}s  cycle:${scene.cycleCount}`, width - 280, 20);

            rafRef.current = requestAnimationFrame(animate);
        };

        // --- Events ---
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };
        const handleMouseLeave = () => { mouseRef.current.active = false; };
        const handleResize = () => { initParticles(); };

        initParticles();
        animate();

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, [text, height, particleCount, gridCols, gridRows, particleColor]);

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: `${height}px`, backgroundColor: bgColor }}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    ref={textRef}
                    className={textClassName}
                    style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', letterSpacing: '-0.03em' }}
                >
                    {text}
                </div>
            </div>
        </div>
    );
}
