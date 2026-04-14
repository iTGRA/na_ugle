import { useState } from 'react';

export default function AnnouncementBar({ isOpen, text }) {
    const [dismissed, setDismissed] = useState(false);
    if (!isOpen || !text || dismissed) return null;

    return (
        <div
            className="w-full inverted flex items-center justify-center relative"
            style={{ height: '36px', padding: '0 48px 0 16px' }}
        >
            <span className="t-label text-center">{text}</span>
            <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Скрыть баннер"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg leading-none"
            >
                ×
            </button>
        </div>
    );
}
