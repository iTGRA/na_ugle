/**
 * ParticleHero — WARP-DRIVE with gradient color phases.
 *
 * Color narrative (art direction):
 *   LAUNCH → cold energy (lime #CEFF88 → olive #92B075) — fresh blast
 *   ORBIT  → warm vortex (coral #FF7960 → peach #FFC3B9) — passion
 *   PULSE  → digital chill (lavender #CDCCE8 → cyan #B4F6FF) — pulsation
 *   DRIFT  → calm fade (lemon #FFF5BC → mist #EDEDED) — rest
 *
 * Each particle picks a random position on its phase gradient.
 * Phase transitions: 0.5s color crossfade via RGB lerp.
 */
import { useEffect, useRef } from 'react';

function smoothstep(a, b, x) {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

function hexToRgb(hex) {
    const v = parseInt(hex.replace('#', ''), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function lerpColor(c1, c2, t) {
    return [
        Math.round(c1[0] + (c2[0] - c1[0]) * t),
        Math.round(c1[1] + (c2[1] - c1[1]) * t),
        Math.round(c1[2] + (c2[2] - c1[2]) * t),
    ];
}

function rgbStr(c, a = 1) {
    return a >= 1 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

// Phase color palettes — high contrast (Google/Apple inspired)
const PHASE_COLORS = {
    LAUNCH: [hexToRgb('#4285F4'), hexToRgb('#1A73E8')],  // Google Blue
    ORBIT:  [hexToRgb('#EA4335'), hexToRgb('#D93025')],   // Google Red
    PULSE:  [hexToRgb('#A259FF'), hexToRgb('#7B2FBE')],   // Purple (Apple-ish)
    DRIFT:  [hexToRgb('#34A853'), hexToRgb('#1E8E3E')],   // Google Green
};

export default function ParticleHero({
    text = 'swipe base',
    height = 600,
    particleCount = 200,
    bgColor = '#FFFFFF',
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
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textEl = textRef.current;
        if (!canvas || !container || !textEl) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = 0, H = height;
        let centerX = 0, centerY = 0;
        let deadZone = { x: 0, y: 0, w: 0, h: 0 };

        const PHASES = ['LAUNCH', 'ORBIT', 'PULSE', 'DRIFT'];
        const DURATIONS = { LAUNCH: 2, ORBIT: 6, PULSE: 4, DRIFT: 4 };
        const scene = { time: 0, phase: 'LAUNCH', phaseTime: 0, phaseIdx: 0, cycle: 0 };

        const init = () => {
            const rect = container.getBoundingClientRect();
            W = rect.width;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.scale(dpr, dpr);

            centerX = W / 2;
            centerY = H / 2;

            const tRect = textEl.getBoundingClientRect();
            const cRect = container.getBoundingClientRect();
            const px = 100, py = 60;
            deadZone = {
                x: tRect.left - cRect.left - px,
                y: tRect.top - cRect.top - py,
                w: tRect.width + px * 2,
                h: tRect.height + py * 2,
            };

            const particles = [];
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.max(W, H) * 0.6 + Math.random() * Math.max(W, H) * 0.4;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                const col = i % 14;
                const row = Math.floor(i / 14) % 10;
                const originX = (col + 0.5) * (W / 14) + (Math.random() - 0.5) * 20;
                const originY = (row + 0.5) * (H / 10) + (Math.random() - 0.5) * 20;

                particles.push({
                    x, y, vx: 0, vy: 0,
                    originX, originY,
                    size: 1.5 + Math.random() * 2.5,
                    phase: Math.random() * Math.PI * 2,
                    opacity: 1,
                    orbitDir: Math.random() > 0.5 ? 1 : -1,
                    trailLength: 3 + Math.random() * 5,
                    trail: [],
                    colorSeed: Math.random(), // position on gradient
                    currentColor: [0, 0, 0],
                });
            }
            particlesRef.current = particles;
        };

        const advancePhase = () => {
            scene.phaseIdx = (scene.phaseIdx + 1) % PHASES.length;
            scene.phase = PHASES[scene.phaseIdx];
            scene.phaseTime = 0;
            if (scene.phase === 'LAUNCH') scene.cycle++;
        };

        const getDeadZoneForce = (p, strength = 2.5) => {
            const cx = deadZone.x + deadZone.w / 2;
            const cy = deadZone.y + deadZone.h / 2;
            const buffer = 80;
            const dx = Math.max(deadZone.x - p.x, 0, p.x - (deadZone.x + deadZone.w));
            const dy = Math.max(deadZone.y - p.y, 0, p.y - (deadZone.y + deadZone.h));
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > buffer) return { fx: 0, fy: 0 };
            const dirX = p.x - cx;
            const dirY = p.y - cy;
            const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const s = ((buffer - dist) / buffer) ** 2 * strength;
            return { fx: (dirX / len) * s, fy: (dirY / len) * s };
        };

        const getMouseForce = (p) => {
            if (!mouseRef.current.active) return { fx: 0, fy: 0 };
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 180) return { fx: 0, fy: 0 };
            const s = ((180 - dist) / 180) * 2;
            const len = dist || 1;
            return { fx: (dx / len) * s, fy: (dy / len) * s };
        };

        const animate = () => {
            scene.time += 0.016;
            scene.phaseTime += 0.016;
            if (scene.phaseTime >= DURATIONS[scene.phase]) advancePhase();
            if (prefersReduced) scene.phase = 'DRIFT';

            const t = scene.time;
            const pt = scene.phaseTime;
            const pd = DURATIONS[scene.phase];
            const progress = pt / pd;

            // Color: current phase palette + crossfade to next
            const curColors = PHASE_COLORS[scene.phase];
            const nextPhase = PHASES[(scene.phaseIdx + 1) % PHASES.length];
            const nextColors = PHASE_COLORS[nextPhase];
            const colorBlend = pt > pd - 0.5 ? smoothstep(pd - 0.5, pd, pt) : 0;

            ctx.clearRect(0, 0, W, H);
            const particles = particlesRef.current;

            for (const p of particles) {
                let fx = 0, fy = 0;

                const toCenterX = centerX - p.x;
                const toCenterY = centerY - p.y;
                const distToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY) || 1;
                const normToCX = toCenterX / distToCenter;
                const normToCY = toCenterY / distToCenter;
                const perpX = -normToCY * p.orbitDir;
                const perpY = normToCX * p.orbitDir;

                if (scene.phase === 'LAUNCH') {
                    const pull = 4 + progress * 8;
                    fx += normToCX * pull;
                    fy += normToCY * pull;
                    fx += perpX * progress * 3;
                    fy += perpY * progress * 3;
                } else if (scene.phase === 'ORBIT') {
                    const orbitSpeed = 3 + Math.sin(t + p.phase) * 1;
                    const centripetal = 1.5 + Math.sin(t * 0.5 + p.phase) * 0.5;
                    fx += perpX * orbitSpeed + normToCX * centripetal;
                    fy += perpY * orbitSpeed + normToCY * centripetal;
                    fx += Math.sin(t + p.phase) * 0.3;
                    fy += Math.cos(t * 0.7 + p.phase) * 0.3;
                } else if (scene.phase === 'PULSE') {
                    const wave = Math.sin(progress * Math.PI * 4 + p.phase * 0.5);
                    fx += normToCX * wave * 4 + perpX * 1.5;
                    fy += normToCY * wave * 4 + perpY * 1.5;
                } else if (scene.phase === 'DRIFT') {
                    fx += (p.originX - p.x) * 0.02 + Math.sin(t + p.phase) * 0.5;
                    fy += (p.originY - p.y) * 0.02 + Math.cos(t * 0.6 + p.phase) * 0.5;
                    if (progress > 0.75) {
                        const ramp = (progress - 0.75) * 4;
                        fx += normToCX * ramp * 2;
                        fy += normToCY * ramp * 2;
                    }
                }

                const dead = getDeadZoneForce(p, scene.phase === 'LAUNCH' ? 5 : 2.5);
                const mouse = getMouseForce(p);
                fx += dead.fx + mouse.fx;
                fy += dead.fy + mouse.fy;

                p.vx += fx;
                p.vy += fy;
                const damp = scene.phase === 'LAUNCH' ? 0.92 : 0.88;
                p.vx *= damp;
                p.vy *= damp;
                p.x += p.vx;
                p.y += p.vy;

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > p.trailLength) p.trail.shift();

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const angle = Math.atan2(p.vy, p.vx);

                // --- Color per particle ---
                // Each particle has a colorSeed (0..1) that picks its position on the gradient
                // Speed also shifts the color: fast particles → end of gradient
                const speedShift = Math.min(speed * 0.05, 0.4);
                const gradPos = Math.min(p.colorSeed * 0.6 + speedShift, 1);

                let targetColor = lerpColor(curColors[0], curColors[1], gradPos);
                if (colorBlend > 0) {
                    const nextTarget = lerpColor(nextColors[0], nextColors[1], gradPos);
                    targetColor = lerpColor(targetColor, nextTarget, colorBlend);
                }

                // Smooth color transition
                p.currentColor = lerpColor(p.currentColor, targetColor, 0.08);
                const colorRgb = p.currentColor;

                // --- Trail ---
                if (speed > 1.5 && p.trail.length > 2) {
                    ctx.save();
                    ctx.strokeStyle = rgbStr(colorRgb, Math.min(speed * 0.06, 0.5));
                    ctx.lineWidth = Math.min(p.size * 0.6, 2);
                    ctx.beginPath();
                    ctx.moveTo(p.trail[0].x, p.trail[0].y);
                    for (let j = 1; j < p.trail.length; j++) ctx.lineTo(p.trail[j].x, p.trail[j].y);
                    ctx.stroke();
                    ctx.restore();
                }

                // --- Particle ---
                const stretch = 1 + Math.min(speed * 0.5, 3);
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(angle);
                ctx.fillStyle = rgbStr(colorRgb, Math.min(0.75 + speed * 0.04, 1));
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * stretch, p.size / stretch, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        const onMove = (e) => {
            const r = container.getBoundingClientRect();
            mouseRef.current.x = e.clientX - r.left;
            mouseRef.current.y = e.clientY - r.top;
            mouseRef.current.active = true;
        };
        const onLeave = () => { mouseRef.current.active = false; };
        const onResize = () => { init(); };

        init();
        animate();

        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);
        window.addEventListener('resize', onResize);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            container.removeEventListener('mousemove', onMove);
            container.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('resize', onResize);
        };
    }, [text, height, particleCount]);

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
                    style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', letterSpacing: '-0.03em', color: '#0A0A08' }}
                >
                    {text}
                </div>
            </div>
        </div>
    );
}
