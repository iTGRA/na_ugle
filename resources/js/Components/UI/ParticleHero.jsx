/**
 * ParticleHero — Dots → Neon Warp → Möbius → Tunnel → Dots.
 *
 * Основа: ТОЧКИ. Всё начинается с точек, всё возвращается в точки.
 * Между — неоновые вспышки динамики (warp, möbius, tunnel), но каждый паттерн
 * затухает обратно в спокойное поле точек, которые реагируют на мышку.
 *
 * Цикл (20s):
 *   DOTS    (4s)  — тихое поле, дыхание, мышка отталкивает
 *   WARP    (4s)  — точки вытягиваются в неоновые линии, летят потоком
 *   DOTS    (3s)  — возврат в точки
 *   MOBIUS  (4s)  — точки закручиваются в ленту Мёбиуса вокруг текста
 *   DOTS    (2s)  — возврат
 *   TUNNEL  (3s)  — взрыв из центра наружу (tunnel perspective)
 *   → повтор
 */
import { useEffect, useRef } from 'react';

function smoothstep(a, b, x) {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
}
function hexToRgb(h) { const v = parseInt(h.replace('#', ''), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
function lerpC(a, b, t) { return [Math.round(a[0]+(b[0]-a[0])*t), Math.round(a[1]+(b[1]-a[1])*t), Math.round(a[2]+(b[2]-a[2])*t)]; }

const NEONS = [
    { core: hexToRgb('#4285F4'), glow: hexToRgb('#80B4FF') },
    { core: hexToRgb('#EA4335'), glow: hexToRgb('#FF8A80') },
    { core: hexToRgb('#A259FF'), glow: hexToRgb('#D4A5FF') },
    { core: hexToRgb('#34A853'), glow: hexToRgb('#81E89E') },
    { core: hexToRgb('#FBBC04'), glow: hexToRgb('#FFE082') },
    { core: hexToRgb('#FF6D00'), glow: hexToRgb('#FFAB40') },
];
const DOT_COLOR = '#0A0A08';

export default function ParticleHero({
    text = 'swipe base',
    height = 600,
    particleCount = 220,
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
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textEl = textRef.current;
        if (!canvas || !container || !textEl) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = 0, H = height, cx = 0, cy = 0;
        let deadZone = { x: 0, y: 0, w: 0, h: 0 };

        // Phase sequence: dynamic phases separated by DOTS rest
        const SEQUENCE = [
            { name: 'DOTS', dur: 4 },
            { name: 'WARP', dur: 4 },
            { name: 'DOTS', dur: 3 },
            { name: 'MOBIUS', dur: 4 },
            { name: 'DOTS', dur: 2 },
            { name: 'TUNNEL', dur: 3 },
        ];
        const TOTAL = SEQUENCE.reduce((s, p) => s + p.dur, 0);

        const getPhase = (globalTime) => {
            let t = globalTime % TOTAL;
            for (const p of SEQUENCE) {
                if (t < p.dur) return { name: p.name, progress: t / p.dur, time: t, dur: p.dur };
                t -= p.dur;
            }
            return { name: 'DOTS', progress: 0, time: 0, dur: 4 };
        };

        const init = () => {
            const rect = container.getBoundingClientRect();
            W = rect.width;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.scale(dpr, dpr);
            cx = W / 2; cy = H / 2;

            const tR = textEl.getBoundingClientRect();
            const cR = container.getBoundingClientRect();
            deadZone = { x: tR.left - cR.left - 100, y: tR.top - cR.top - 60, w: tR.width + 200, h: tR.height + 120 };

            const cols = 16, rows = Math.ceil(particleCount / cols);
            const particles = [];
            for (let i = 0; i < particleCount; i++) {
                const col = i % cols, row = Math.floor(i / cols);
                const originX = (col + 0.5) * (W / cols) + (Math.random() - 0.5) * 15;
                const originY = (row + 0.5) * (H / rows) + (Math.random() - 0.5) * 15;
                particles.push({
                    x: originX, y: originY, vx: 0, vy: 0,
                    originX, originY,
                    size: 2 + Math.random() * 2.5,
                    phase: Math.random() * Math.PI * 2,
                    neon: NEONS[Math.floor(Math.random() * NEONS.length)],
                    trail: [],
                    trailMax: 10 + Math.floor(Math.random() * 10),
                    orbitDir: Math.random() > 0.5 ? 1 : -1,
                });
            }
            particlesRef.current = particles;
        };

        const deadForce = (p, str = 2.5) => {
            const dcx = deadZone.x + deadZone.w / 2, dcy = deadZone.y + deadZone.h / 2;
            const buf = 80;
            const dx = Math.max(deadZone.x - p.x, 0, p.x - (deadZone.x + deadZone.w));
            const dy = Math.max(deadZone.y - p.y, 0, p.y - (deadZone.y + deadZone.h));
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > buf) return { fx: 0, fy: 0 };
            const dirX = p.x - dcx, dirY = p.y - dcy;
            const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const s = ((buf - d) / buf) ** 2 * str;
            return { fx: (dirX / len) * s, fy: (dirY / len) * s };
        };

        const mouseForce = (p) => {
            if (!mouseRef.current.active) return { fx: 0, fy: 0 };
            const dx = p.x - mouseRef.current.x, dy = p.y - mouseRef.current.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 160) return { fx: 0, fy: 0 };
            const s = ((160 - d) / 160) * 2;
            return { fx: (dx / (d || 1)) * s, fy: (dy / (d || 1)) * s };
        };

        const edgeFade = (x, y) => {
            const m = Math.min(x, W - x, y, H - y);
            return m >= 120 ? 1 : Math.max(m / 120, 0);
        };

        let globalTime = 0;

        const animate = () => {
            globalTime += 0.016;
            const phase = getPhase(globalTime);
            const { name, progress, time: pt } = phase;

            // Envelope for transitions: ramp in first 15%, ramp out last 15%
            const envelope = name === 'DOTS' ? 0 : smoothstep(0, 0.15, progress) * smoothstep(1, 0.85, progress);

            ctx.clearRect(0, 0, W, H);
            const particles = particlesRef.current;
            const t = globalTime;

            for (const p of particles) {
                // --- Always: spring to origin + breathing ---
                const breathe = 1 - envelope * 0.7; // reduce breathing during dynamics
                const bx = Math.sin(t + p.phase) * 3 * breathe;
                const by = Math.cos(t * 0.8 + p.phase) * 3 * breathe;
                const tgtX = p.originX + bx, tgtY = p.originY + by;

                const springK = 0.04 + (1 - envelope) * 0.04; // stronger spring when returning to dots
                let fx = (tgtX - p.x) * springK;
                let fy = (tgtY - p.y) * springK;

                // --- Phase-specific forces (scaled by envelope) ---
                const toCX = cx - p.x, toCY = cy - p.y;
                const distC = Math.sqrt(toCX * toCX + toCY * toCY) || 1;
                const nCX = toCX / distC, nCY = toCY / distC;
                const perpX = -nCY * p.orbitDir, perpY = nCX * p.orbitDir;

                if (name === 'WARP') {
                    const angle = t * 1.5 + p.phase * 0.3;
                    const warpFX = Math.cos(angle) * 5 * envelope;
                    const warpFY = Math.sin(angle) * 5 * envelope;
                    fx += warpFX;
                    fy += warpFY;
                } else if (name === 'MOBIUS') {
                    // Möbius band: orbit around text + vertical sine wave
                    const orbitSpeed = 4 * envelope;
                    const vertWave = Math.sin(t * 3 + p.phase + distC * 0.01) * 2 * envelope;
                    fx += perpX * orbitSpeed + nCX * 1.5 * envelope;
                    fy += perpY * orbitSpeed + vertWave;
                } else if (name === 'TUNNEL') {
                    // Burst outward from center
                    const pushStr = 6 * envelope * (0.5 + progress);
                    fx += -nCX * pushStr;
                    fy += -nCY * pushStr;
                }

                // --- Always: dead zone + mouse ---
                const dz = deadForce(p, 2.5 + envelope * 2);
                const mf = mouseForce(p);
                fx += dz.fx + mf.fx;
                fy += dz.fy + mf.fy;

                p.vx += fx;
                p.vy += fy;
                p.vx *= 0.87;
                p.vy *= 0.87;
                p.x += p.vx;
                p.y += p.vy;

                // Trail (only during dynamics)
                if (envelope > 0.1) {
                    p.trail.push({ x: p.x, y: p.y });
                    if (p.trail.length > p.trailMax) p.trail.shift();
                } else {
                    if (p.trail.length > 0) p.trail.shift(); // drain trail back to dots
                }

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const ef = edgeFade(p.x, p.y);
                if (ef < 0.01) continue;

                // --- Render ---
                if (envelope > 0.1 && speed > 1 && p.trail.length > 2) {
                    // NEON TRAIL (gradient, glow)
                    const core = p.neon.core, glow = p.neon.glow;
                    const lw = (p.size * 0.7 + Math.min(speed * 0.12, 1.5)) * (1 + envelope * 0.15);
                    const trail = p.trail;
                    const neonAlpha = envelope * ef * Math.min(speed * 0.08, 0.9);

                    // Glow
                    ctx.save();
                    ctx.lineCap = 'round';
                    ctx.lineWidth = lw * 3;
                    ctx.globalAlpha = neonAlpha * 0.2;
                    ctx.strokeStyle = `rgb(${glow[0]},${glow[1]},${glow[2]})`;
                    ctx.beginPath();
                    ctx.moveTo(trail[0].x, trail[0].y);
                    for (let j = 1; j < trail.length; j++) ctx.lineTo(trail[j].x, trail[j].y);
                    ctx.stroke();
                    ctx.restore();

                    // Core gradient
                    ctx.save();
                    ctx.lineCap = 'round';
                    ctx.lineWidth = lw;
                    ctx.globalAlpha = neonAlpha * 0.8;
                    const grad = ctx.createLinearGradient(trail[0].x, trail[0].y, trail[trail.length - 1].x, trail[trail.length - 1].y);
                    grad.addColorStop(0, `rgba(${core[0]},${core[1]},${core[2]},0)`);
                    grad.addColorStop(1, `rgba(${glow[0]},${glow[1]},${glow[2]},1)`);
                    ctx.strokeStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(trail[0].x, trail[0].y);
                    for (let j = 1; j < trail.length; j++) ctx.lineTo(trail[j].x, trail[j].y);
                    ctx.stroke();
                    ctx.restore();
                }

                // DOT (always visible — the foundation)
                const dotAlpha = ef * (0.6 + (1 - envelope) * 0.4); // brighter when in DOTS phase
                const dotSize = p.size * (1 - envelope * 0.3); // slightly smaller during dynamics

                // Color blend: dot color ↔ neon based on envelope
                const dotR = Math.round(10 * (1 - envelope) + p.neon.core[0] * envelope);
                const dotG = Math.round(10 * (1 - envelope) + p.neon.core[1] * envelope);
                const dotB = Math.round(10 * (1 - envelope) + p.neon.core[2] * envelope);

                ctx.save();
                ctx.globalAlpha = dotAlpha;
                ctx.fillStyle = `rgb(${dotR},${dotG},${dotB})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        const onMove = (e) => { const r = container.getBoundingClientRect(); mouseRef.current.x = e.clientX - r.left; mouseRef.current.y = e.clientY - r.top; mouseRef.current.active = true; };
        const onLeave = () => { mouseRef.current.active = false; };
        const onResize = () => { init(); };

        init(); animate();
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
        <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: `${height}px`, backgroundColor: bgColor }}>
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div ref={textRef} className={textClassName} style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', letterSpacing: '-0.03em', color: '#0A0A08' }}>
                    {text}
                </div>
            </div>
        </div>
    );
}
