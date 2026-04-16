/**
 * ParticleHero — hero-блок с анимацией частиц, обтекающих центральный текст.
 * Vanilla Canvas 2D, без библиотек. SSR-safe (все canvas-операции в useEffect).
 *
 * Частицы раскладываются по сетке, «дышат», отталкиваются от текста и курсора.
 * Форма — эллипс, вытянутый по направлению движения.
 *
 * Props:
 *   text            — текст по центру (default 'Swipe')
 *   height          — высота блока в px (default 600)
 *   particleCount   — количество частиц (default 100)
 *   gridCols        — колонки сетки (default 12)
 *   gridRows        — строки сетки (default 8)
 *   bgColor         — фон (default '#F5F0E8')
 *   particleColor   — цвет частиц (default '#0A0A08')
 *   textClassName   — CSS-классы текста
 */
import { useEffect, useRef } from 'react';

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

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const textEl = textRef.current;
        if (!canvas || !container || !textEl) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let deadZone = { x: 0, y: 0, w: 0, h: 0 };

        // --- Initialise: canvas size, DPR, particle grid ---
        const initParticles = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);

            // Dead zone around text
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

            // Generate particles on a jittered grid
            const particles = [];
            const cellW = width / gridCols;
            const cellH = height / gridRows;

            for (let i = 0; i < particleCount; i++) {
                const col = i % gridCols;
                const row = Math.floor(i / gridCols) % gridRows;
                const baseX = col * cellW + cellW / 2;
                const baseY = row * cellH + cellH / 2;

                const originX = baseX + (Math.random() - 0.5) * cellW * 0.4;
                const originY = baseY + (Math.random() - 0.5) * cellH * 0.4;

                particles.push({
                    x: originX,
                    y: originY,
                    vx: 0,
                    vy: 0,
                    originX,
                    originY,
                    size: 2 + Math.random() * 3,
                    phase: Math.random() * Math.PI * 2,
                });
            }

            particlesRef.current = particles;
        };

        // --- Dead zone repulsion (rectangle) ---
        const getDeadZoneForce = (p) => {
            const cx = deadZone.x + deadZone.w / 2;
            const cy = deadZone.y + deadZone.h / 2;
            const buffer = 100;

            const dx = Math.max(deadZone.x - p.x, 0, p.x - (deadZone.x + deadZone.w));
            const dy = Math.max(deadZone.y - p.y, 0, p.y - (deadZone.y + deadZone.h));
            const distToRect = Math.sqrt(dx * dx + dy * dy);

            if (distToRect > buffer) return { fx: 0, fy: 0 };

            const dirX = p.x - cx;
            const dirY = p.y - cy;
            const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
            const strength = ((buffer - distToRect) / buffer) ** 2 * 2.5;

            return {
                fx: (dirX / len) * strength,
                fy: (dirY / len) * strength,
            };
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
            return {
                fx: (dx / len) * strength,
                fy: (dy / len) * strength,
            };
        };

        // --- Animation loop ---
        let time = 0;
        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);

            const particles = particlesRef.current;

            for (const p of particles) {
                // Breathing around origin
                const breatheX = Math.sin(time + p.phase) * 4;
                const breatheY = Math.cos(time * 0.8 + p.phase) * 4;
                const targetX = p.originX + breatheX;
                const targetY = p.originY + breatheY;

                // Spring to target
                const springX = (targetX - p.x) * 0.04;
                const springY = (targetY - p.y) * 0.04;

                // Forces
                const dead = getDeadZoneForce(p);
                const mouse = getMouseForce(p);

                p.vx += springX + dead.fx + mouse.fx;
                p.vy += springY + dead.fy + mouse.fy;

                // Damping
                p.vx *= 0.85;
                p.vy *= 0.85;

                p.x += p.vx;
                p.y += p.vy;

                // Render: ellipse stretched along velocity
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const angle = Math.atan2(p.vy, p.vx);
                const stretch = 1 + Math.min(speed * 0.8, 2);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(angle);
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size * stretch, p.size / stretch, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        // --- Events ---
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        const handleResize = () => {
            initParticles();
        };

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
