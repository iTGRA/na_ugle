import { Head } from '@inertiajs/react';

export default function Lab() {
    return (
        <>
            <Head title="Lab" />
            <div
                className="min-h-screen bg-paper flex items-center justify-center"
            >
                <span
                    className="font-bold"
                    style={{
                        fontSize: 'clamp(3rem, 10vw, 8rem)',
                        letterSpacing: '-0.03em',
                        color: 'var(--ink)',
                    }}
                >
                    Swipe
                </span>
            </div>
        </>
    );
}
