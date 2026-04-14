import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV = [
    { href: '/menu', label: 'Меню' },
    { href: '#about', label: 'О нас' },
    { href: '#chef', label: 'Шеф' },
    { href: '#gallery', label: 'Галерея' },
    { href: '#contacts', label: 'Контакты' },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
                style={{
                    background: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    borderBottom: scrolled ? '1px solid var(--ink-15)' : '1px solid transparent',
                    padding: scrolled ? '0.8rem 0' : '1.2rem 0',
                }}
            >
                <div className="shell flex items-center justify-between gap-6">
                    <Link href="/" className="font-bold tracking-tight" style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', letterSpacing: '-0.01em' }}>
                        НА&nbsp;УГЛЕ
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV.map((l) => (
                            <a key={l.href} href={l.href} className="t-label link-hover">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <a href="#reservation" className="hidden md:inline-block cta-plain">Забронировать</a>
                    <button
                        className="md:hidden text-2xl leading-none"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Открыть меню"
                    >
                        ≡
                    </button>
                </div>
            </header>

            {menuOpen && (
                <div className="fixed inset-0 z-50 bg-paper flex flex-col">
                    <div className="shell flex items-center justify-between py-5">
                        <span className="font-bold" style={{ fontSize: '1.4rem' }}>НА УГЛЕ</span>
                        <button
                            className="text-3xl leading-none"
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
                                className="t-h2 link-hover"
                            >{l.label}</a>
                        ))}
                        <a
                            href="#reservation"
                            onClick={() => setMenuOpen(false)}
                            className="cta mt-6"
                        >Забронировать</a>
                    </nav>
                </div>
            )}
        </>
    );
}
