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
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300`}
                style={{
                    background: scrolled ? 'rgba(26,26,24,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(8px)' : 'none',
                    padding: scrolled ? '0.6rem 0' : '1rem 0',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-hand text-3xl text-ember">НА УГЛЕ</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV.map((l) => (
                            <a key={l.href} href={l.href} className="link-ember text-cream text-sm uppercase tracking-wider">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <a href="#reservation" className="hidden md:inline-block btn-ember text-xs">Забронировать</a>
                    <button
                        className="md:hidden text-cream text-3xl leading-none"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Открыть меню"
                    >☰</button>
                </div>
            </header>

            {menuOpen && (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    style={{ background: 'var(--charcoal)' }}
                >
                    <button
                        className="absolute top-6 right-6 text-cream text-4xl"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Закрыть"
                    >×</button>
                    <nav className="flex flex-col items-center gap-8">
                        {NAV.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-cream text-2xl uppercase tracking-wider"
                            >{l.label}</a>
                        ))}
                        <a
                            href="#reservation"
                            onClick={() => setMenuOpen(false)}
                            className="btn-ember mt-4"
                        >Забронировать</a>
                    </nav>
                </div>
            )}
        </>
    );
}
