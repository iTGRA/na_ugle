import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV = [
    { href: '/menu', label: 'Меню' },
    { href: '#about', label: 'О нас' },
    { href: '#chef', label: 'Шеф' },
    { href: '#gallery', label: 'Галерея' },
    { href: '#contacts', label: 'Контакты' },
];

export default function Header({ variant = 'transparent', phone = '', address = '' }) {
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

    const showSolid = scrolled || hovered || variant === 'solid';
    const color = showSolid ? '#0A0A08' : '#ffffff';

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="w-full"
                style={{
                    background: showSolid ? 'rgba(245,240,232,0.95)' : 'transparent',
                    backdropFilter: showSolid ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: showSolid ? 'blur(10px)' : 'none',
                    borderBottom: 'none',
                    paddingTop: '18px',
                    paddingBottom: '18px',
                    transition: 'background 0.25s ease, backdrop-filter 0.25s ease, border-color 0.25s ease',
                }}
            >
                <div className="shell flex items-center justify-between gap-6">
                    <Link href="/" className="block flex-shrink-0">
                        <img
                            src="/images/logo-header.svg"
                            alt="НА УГЛЕ"
                            className="h-12 md:h-14 w-auto"
                        />
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="t-label"
                                style={{
                                    color,
                                    borderBottom: '1px solid transparent',
                                    paddingBottom: '2px',
                                    transition: 'color 0.25s ease, border-bottom-color 0.2s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = 'currentColor'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <div className="hidden lg:flex flex-col items-end leading-[1.15] text-right" style={{ color }}>
                        {phone && (
                            <a
                                href={`tel:${phone.replace(/\D/g, '')}`}
                                className="t-label"
                                style={{ color, borderBottom: '1px solid transparent', transition: 'border-bottom-color 0.2s ease' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = 'currentColor'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                            >
                                {phone}
                            </a>
                        )}
                        {address && (
                            <span className="t-small mt-0.5" style={{ opacity: 0.7 }}>
                                {address}
                            </span>
                        )}
                    </div>
                    {phone && (
                        <a
                            href={`tel:${phone.replace(/\D/g, '')}`}
                            className="hidden md:inline-flex btn btn-sm"
                        >
                            Забронировать
                        </a>
                    )}
                    <button
                        className="md:hidden text-2xl leading-none"
                        style={{ color, transition: 'color 0.25s ease' }}
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
                        <img src="/images/logo-header.svg" alt="НА УГЛЕ" className="h-12 w-auto" />
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
                        {phone && (
                            <a
                                href={`tel:${phone.replace(/\D/g, '')}`}
                                onClick={() => setMenuOpen(false)}
                                className="btn mt-6"
                            >Забронировать</a>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
