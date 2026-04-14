export default function CowMascot({ size = 120, mood = 'happy' }) {
    return (
        <svg
            viewBox="0 0 200 200"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Дурняша — корова на угле"
        >
            {/* Coal base */}
            <path d="M30 165 Q100 150 170 165 Q175 175 168 182 L32 182 Q25 175 30 165 Z" fill="currentColor" opacity="0.35" />
            {/* Body */}
            <ellipse cx="100" cy="125" rx="55" ry="30" fill="currentColor" opacity="0.05" />
            {/* Head */}
            <ellipse cx="100" cy="85" rx="40" ry="38" fill="currentColor" opacity="0.05" />
            {/* Horns */}
            <path d="M75 55 Q70 40 68 30" />
            <path d="M125 55 Q130 40 132 30" />
            {/* Ears */}
            <ellipse cx="65" cy="78" rx="10" ry="6" transform="rotate(-30 65 78)" />
            <ellipse cx="135" cy="78" rx="10" ry="6" transform="rotate(30 135 78)" />
            {/* Eyes */}
            {mood === 'happy' ? (
                <>
                    <path d="M82 83 Q86 80 90 83" />
                    <path d="M110 83 Q114 80 118 83" />
                </>
            ) : (
                <>
                    <circle cx="86" cy="82" r="2.5" fill="currentColor" />
                    <circle cx="114" cy="82" r="2.5" fill="currentColor" />
                </>
            )}
            {/* Snout */}
            <ellipse cx="100" cy="105" rx="18" ry="12" />
            <circle cx="93" cy="103" r="1.5" fill="currentColor" />
            <circle cx="107" cy="103" r="1.5" fill="currentColor" />
            {/* Smile */}
            <path d="M90 113 Q100 119 110 113" />
            {/* Spots */}
            <ellipse cx="78" cy="130" rx="8" ry="5" fill="currentColor" opacity="0.3" />
            <ellipse cx="120" cy="140" rx="6" ry="4" fill="currentColor" opacity="0.3" />
            {/* Legs hinting sitting */}
            <path d="M75 155 L75 165" />
            <path d="M125 155 L125 165" />
        </svg>
    );
}
