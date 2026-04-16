/**
 * ParticleHero — Neon Tunnel Warp.
 *
 * Частицы летят из глубины экрана (центр = vanishing point) наружу по перспективе тоннеля.
 * Неоновые флуоресцентные градиентные линии. Утолщаются при скорости.
 * Растворяются в 150px зоне безопасности от краёв.
 */
import { useEffect, useRef } from 'react';

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

// Neon palette — 4 fluorescent gradients [core, glow]
const NEON_PALETTES = [
    { core: hexToRgb('#4285F4'), glow: hexToRgb('#80B4FF') },  // Electric Blue
    { core: hexToRgb('#EA4335'), glow: hexToRgb('#FF8A80') },  // Neon Red
    { core: hexToRgb('#A259FF'), glow: hexToRgb('#D4A5FF') },  // UV Purple
    { core: hexToRgb('#34A853'), glow: hexToRgb('#81E89E') },  // Neon Green
    { core: hexToRgb('#FBBC04'), glow: hexToRgb('#FFE082') },  // Neon Yellow
    { core: hexToRgb('#FF6D00'), glow: hexToRgb('#FFAB40') },  // Neon Orange
];

export default function ParticleV4({
    text = 'swipe base',
    height = 600,
    particleCount = 250,
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

        let W = 0, H = height;
        let centerX = 0, centerY = 0;
        let deadZone = { x: 0, y: 0, w: 0, h: 0 };
        const EDGE_FADE = 150; // px from edge where particles dissolve

        const spawnParticle = (existing) => {
            const angle = Math.random() * Math.PI * 2;
            const startDist = 10 + Math.random() * 40; // spawn near center (vanishing point)
            const palette = NEON_PALETTES[Math.floor(Math.random() * NEON_PALETTES.length)];

            const p = existing || {};
            p.x = centerX + Math.cos(angle) * startDist;
            p.y = centerY + Math.sin(angle) * startDist;
            p.vx = 0;
            p.vy = 0;
            p.angle = angle; // direction from center
            p.speed = 1.5 + Math.random() * 3; // base outward speed
            p.size = 1.5 + Math.random() * 2;
            p.life = 0;
            p.maxLife = 120 + Math.random() * 180; // frames
            p.phase = Math.random() * Math.PI * 2;
            p.palette = palette;
            p.trail = [];
            p.trailMax = 8 + Math.floor(Math.random() * 12);
            p.wobble = (Math.random() - 0.5) * 0.02; // slight angle drift
            p.accel = 1.01 + Math.random() * 0.03; // acceleration factor
            return p;
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
                const p = spawnParticle();
                p.life = Math.random() * p.maxLife; // stagger initial positions
                // Pre-simulate to spread them out
                const preSteps = Math.floor(p.life);
                for (let s = 0; s < preSteps; s++) {
                    p.speed *= p.accel;
                    p.angle += p.wobble;
                    p.x += Math.cos(p.angle) * p.speed * 0.3;
                    p.y += Math.sin(p.angle) * p.speed * 0.3;
                }
                particles.push(p);
            }
            particlesRef.current = particles;
        };

        // Edge fade: opacity based on distance from edges
        const getEdgeFade = (x, y) => {
            const dLeft = x;
            const dRight = W - x;
            const dTop = y;
            const dBottom = H - y;
            const minDist = Math.min(dLeft, dRight, dTop, dBottom);
            if (minDist >= EDGE_FADE) return 1;
            if (minDist <= 0) return 0;
            return minDist / EDGE_FADE;
        };

        // Dead zone deflection
        const getDeadZoneForce = (p) => {
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
            const s = ((buffer - dist) / buffer) ** 2 * 3;
            return { fx: (dirX / len) * s, fy: (dirY / len) * s };
        };

        const getMouseForce = (p) => {
            if (!mouseRef.current.active) return { fx: 0, fy: 0 };
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 180) return { fx: 0, fy: 0 };
            const s = ((180 - dist) / 180) * 2.5;
            const len = dist || 1;
            return { fx: (dx / len) * s, fy: (dy / len) * s };
        };

        let time = 0;

        const animate = () => {
            time += 0.016;
            ctx.clearRect(0, 0, W, H);

            const particles = particlesRef.current;

            for (const p of particles) {
                p.life++;

                // Respawn when out of bounds or expired
                if (p.life > p.maxLife || p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) {
                    spawnParticle(p);
                    continue;
                }

                // Tunnel perspective: accelerate outward from center
                p.speed *= p.accel;
                p.angle += p.wobble + Math.sin(time * 2 + p.phase) * 0.003; // subtle sway

                // Outward velocity from vanishing point
                const outVX = Math.cos(p.angle) * p.speed;
                const outVY = Math.sin(p.angle) * p.speed;

                // Dead zone + mouse
                const dead = getDeadZoneForce(p);
                const mouse = getMouseForce(p);

                p.vx = outVX + dead.fx + mouse.fx;
                p.vy = outVY + dead.fy + mouse.fy;

                p.x += p.vx * 0.3;
                p.y += p.vy * 0.3;

                // Trail
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > p.trailMax) p.trail.shift();

                // Opacity: edge fade + life fade-in
                const edgeFade = getEdgeFade(p.x, p.y);
                const lifeFadeIn = Math.min(p.life / 20, 1); // fade in first 20 frames
                const alpha = edgeFade * lifeFadeIn;

                if (alpha < 0.01 || p.trail.length < 2) continue;

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const distFromCenter = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);
                const perspectiveScale = 0.3 + (distFromCenter / (Math.max(W, H) * 0.5)) * 0.7; // farther = thicker

                // Line width: base + speed boost + perspective
                const lineW = (p.size * 0.8 + Math.min(speed * 0.15, 2)) * perspectiveScale * 1.15;

                // --- Render gradient neon trail ---
                const trail = p.trail;
                const core = p.palette.core;
                const glow = p.palette.glow;

                // Glow layer (wider, transparent)
                ctx.save();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = lineW * 3;
                ctx.globalAlpha = alpha * 0.15;

                const glowGrad = ctx.createLinearGradient(
                    trail[0].x, trail[0].y,
                    trail[trail.length - 1].x, trail[trail.length - 1].y
                );
                glowGrad.addColorStop(0, `rgba(${glow[0]},${glow[1]},${glow[2]},0)`);
                glowGrad.addColorStop(1, `rgba(${glow[0]},${glow[1]},${glow[2]},1)`);
                ctx.strokeStyle = glowGrad;

                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let j = 1; j < trail.length; j++) ctx.lineTo(trail[j].x, trail[j].y);
                ctx.stroke();
                ctx.restore();

                // Core line (sharp, gradient)
                ctx.save();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = lineW;
                ctx.globalAlpha = alpha * 0.85;

                const coreGrad = ctx.createLinearGradient(
                    trail[0].x, trail[0].y,
                    trail[trail.length - 1].x, trail[trail.length - 1].y
                );
                coreGrad.addColorStop(0, `rgba(${core[0]},${core[1]},${core[2]},0)`);
                coreGrad.addColorStop(0.3, `rgba(${core[0]},${core[1]},${core[2]},0.6)`);
                coreGrad.addColorStop(1, `rgba(${glow[0]},${glow[1]},${glow[2]},1)`);
                ctx.strokeStyle = coreGrad;

                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let j = 1; j < trail.length; j++) ctx.lineTo(trail[j].x, trail[j].y);
                ctx.stroke();
                ctx.restore();

                // Head dot (bright tip)
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgb(${glow[0]},${glow[1]},${glow[2]})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, lineW * 0.6, 0, Math.PI * 2);
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
