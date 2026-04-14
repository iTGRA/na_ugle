import { useEffect, useState } from 'react';

function hashStr(str) {
    let h = 0;
    for (let i = 0; i < (str || '').length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return String(h);
}

export default function AnnouncementBar({ isOpen, text, onHeightChange }) {
    const [dismissed, setDismissed] = useState(false);
    const shouldShow = Boolean(isOpen && text);
    const key = 'na_ugle_ann_' + hashStr(text || '');

    useEffect(() => {
        if (!shouldShow) {
            onHeightChange?.(0);
            return;
        }
        if (typeof window !== 'undefined') {
            try {
                if (localStorage.getItem(key) === '1') {
                    setDismissed(true);
                    onHeightChange?.(0);
                    return;
                }
            } catch {}
        }
        onHeightChange?.(36);
    }, [shouldShow, key, onHeightChange]);

    if (!shouldShow || dismissed) return null;

    const close = () => {
        setDismissed(true);
        try { localStorage.setItem(key, '1'); } catch {}
        onHeightChange?.(0);
    };

    return (
        <div
            className="w-full inverted flex items-center justify-center relative"
            style={{ height: '36px', padding: '0 48px 0 16px' }}
        >
            <span className="t-label text-center">{text}</span>
            <button
                type="button"
                onClick={close}
                aria-label="Скрыть баннер"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors text-lg leading-none"
            >
                ×
            </button>
        </div>
    );
}
