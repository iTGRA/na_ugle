import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV = [
    { href: '/menu', label: 'Меню' },
    { href: '#about', label: 'О нас' },
    { href: '#chef', label: 'Шеф' },
    { href: '#gallery', label: 'Галерея' },
    { href: '#contacts', label: 'Контакты' },
];

export default function Header({ variant = 'transparent' }) {
    const [scrolled, setScrolled] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Solid state: either scrolled past threshold, or hovering the header, or page forces 'solid'
    const showSolid = scrolled || hovered || variant === 'solid';
    const textClass = showSolid ? 'text-ink' : 'text-white';

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="w-full transition-[background,border,padding] duration-300"
                style={{
                    background: showSolid ? 'rgba(245,240,232,0.95)' : 'transparent',
                    backdropFilter: showSolid ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: showSolid ? 'blur(10px)' : 'none',
                    borderBottom: showSolid ? '1px solid rgba(10,10,8,0.15)' : '1px solid transparent',
                    paddingTop: showSolid ? '12px' : '18px',
                    paddingBottom: showSolid ? '12px' : '18px',
                }}
            >
                <div className="shell flex items-center justify-between gap-6">
                    <Link
                        href="/"
                        className={`font-bold tracking-tight transition-colors duration-300 ${textClass}`}
                        style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)', letterSpacing: '-0.01em' }}
                    >
                        НА&nbsp;УГЛЕ
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className={`t-label transition-colors duration-300 ${textClass}`}
                                style={{
                                    borderBottom: '1px solid transparent',
                                    paddingBottom: '2px',
                                    transition: 'color 0.3s, border-bottom-color 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = 'currentColor'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <a
                        href="#reservation"
                        className={`hidden md:inline-block cta-plain transition-colors duration-300 ${textClass}`}
                    >
                        Забронировать
                    </a>
                    <button
                        className={`md:hidden text-2xl leading-none transition-colors duration-300 ${textClass}`}
                        onClick={() => setMenuOpen(true)}
                        aria-label="Открыть меню"
                    >
                        ≡
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="fixed inset-0 z-[60] bg-paper flex flex-col">
                    <div className="shell flex items-center justify-between py-5">
                        <span className="font-bold text-ink" style={{ fontSize: '1.4rem' }}>НА УГЛЕ</span>
                        <button
                            className="text-3xl leading-none text-ink"
                            onClick={() => setMenuOpen(false)}
                            aria-label="Закрыть"
                        >×</button>
                    </div>
                    <nav className="flex-1 flex flex-col items-start justify-center gap-6 px-6">
                        {NAV.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setMenuOpen(false)}
                                className="t-h2 text-ink link-hover"
                            >{l.label}</a>
                        ))}
                        <a
                            href="#reservation"
                            onClick={() => setMenuOpen(false)}
                            className="cta mt-6 text-ink"
                        >Забронировать</a>
                    </nav>
                </div>
            )}
        </>
    );
}
