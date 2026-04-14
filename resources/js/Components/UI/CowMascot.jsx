export default function CowMascot({ size = 120 }) {
    return (
        <svg
            viewBox="0 0 200 200"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Дурняша"
        >
            <path d="M30 168 Q100 156 170 168 Q174 177 168 182 L32 182 Q26 177 30 168 Z" />
            <ellipse cx="100" cy="128" rx="56" ry="30" />
            <ellipse cx="100" cy="88" rx="40" ry="38" />
            <path d="M76 58 Q70 42 68 30" />
            <path d="M124 58 Q130 42 132 30" />
            <ellipse cx="64" cy="80" rx="10" ry="6" transform="rotate(-30 64 80)" />
            <ellipse cx="136" cy="80" rx="10" ry="6" transform="rotate(30 136 80)" />
            <path d="M82 85 Q86 82 90 85" />
            <path d="M110 85 Q114 82 118 85" />
            <ellipse cx="100" cy="108" rx="18" ry="12" />
            <circle cx="93" cy="106" r="1.2" fill="currentColor" />
            <circle cx="107" cy="106" r="1.2" fill="currentColor" />
            <path d="M92 116 Q100 121 108 116" />
        </svg>
    );
}
