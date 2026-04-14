export default function AnnouncementBar({ isOpen, text }) {
    if (!isOpen || !text) return null;
    return (
        <div className="inverted text-center t-label py-3 px-4">
            {text}
        </div>
    );
}
