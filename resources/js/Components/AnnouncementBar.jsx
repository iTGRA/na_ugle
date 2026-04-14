export default function AnnouncementBar({ isOpen, text }) {
    if (!isOpen || !text) return null;
    return (
        <div
            className="w-full text-center text-xs uppercase tracking-widest py-2 font-bold"
            style={{ background: 'var(--ember)', color: '#fff', letterSpacing: '0.15em' }}
        >
            🔥 {text}
        </div>
    );
}
