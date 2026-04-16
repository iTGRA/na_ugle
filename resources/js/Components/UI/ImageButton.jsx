/**
 * ImageButton — CTA-кнопка с тремя состояниями: точка → сфера → капсула.
 *
 * IDLE:   чёрная точка (dotSize × dotSize)
 * HOVER:  сфера с изображением + fisheye-виньетка
 * ACTIVE: капсула с изображением + label
 *
 * Пример:
 *   <ImageButton
 *     imageSrc="/images/hero-1.jpg"
 *     label="Смотреть проект"
 *     ariaLabel="Открыть проект"
 *     onClick={() => console.log('clicked')}
 *   />
 */
import { useState, useRef, useCallback } from 'react';

const STATES = { IDLE: 'idle', HOVER: 'hover', ACTIVE: 'active' };

export default function ImageButton({
    imageSrc,
    label,
    onClick,
    href,
    dotSize = 16,
    sphereSize = 120,
    capsuleWidth = 220,
    capsuleHeight = 100,
    ariaLabel = 'Action',
}) {
    const [state, setState] = useState(STATES.IDLE);
    const wasActive = useRef(false);

    const handleEnter = useCallback(() => {
        if (state !== STATES.ACTIVE) setState(STATES.HOVER);
    }, [state]);

    const handleLeave = useCallback(() => {
        if (state !== STATES.ACTIVE) setState(STATES.IDLE);
        wasActive.current = false;
    }, [state]);

    const handleDown = useCallback(() => {
        setState(STATES.ACTIVE);
        wasActive.current = true;
    }, []);

    const handleUp = useCallback(() => {
        if (wasActive.current) {
            setState(STATES.HOVER);
            wasActive.current = false;
            if (onClick) onClick();
            if (href && typeof window !== 'undefined') window.location.href = href;
        }
    }, [onClick, href]);

    // Touch support
    const handleTouchStart = useCallback(() => {
        setState(STATES.ACTIVE);
        wasActive.current = true;
    }, []);

    const handleTouchEnd = useCallback(() => {
        setTimeout(() => {
            setState(STATES.IDLE);
            wasActive.current = false;
            if (onClick) onClick();
            if (href && typeof window !== 'undefined') window.location.href = href;
        }, 200);
    }, [onClick, href]);

    // Dimensions per state
    const dims = {
        [STATES.IDLE]: { w: dotSize, h: dotSize, br: dotSize / 2 },
        [STATES.HOVER]: { w: sphereSize, h: sphereSize, br: sphereSize / 2 },
        [STATES.ACTIVE]: { w: capsuleWidth, h: capsuleHeight, br: capsuleHeight / 2 },
    };
    const d = dims[state];

    const isExpanded = state !== STATES.IDLE;
    const showLabel = state === STATES.ACTIVE && label;

    const Tag = href ? 'a' : 'button';
    const tagProps = href ? { href } : { type: 'button' };

    return (
        <>
            <Tag
                {...tagProps}
                className="image-button"
                aria-label={ariaLabel}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onMouseDown={handleDown}
                onMouseUp={handleUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                    '--ib-w': `${d.w}px`,
                    '--ib-h': `${d.h}px`,
                    '--ib-br': `${d.br}px`,
                }}
            >
                <div className="ib-image-wrapper">
                    {imageSrc && (
                        <img src={imageSrc} alt="" draggable="false" />
                    )}
                    <div className="ib-vignette" />
                </div>
                {label && <span className="ib-label">{label}</span>}
            </Tag>

            <style>{`
                .image-button {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: var(--ib-w);
                    height: var(--ib-h);
                    border-radius: var(--ib-br);
                    background: ${state === STATES.IDLE ? '#0A0A08' : 'transparent'};
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    overflow: hidden;
                    transition:
                        width ${state === STATES.IDLE ? '300ms' : '400ms'} ${state === STATES.HOVER ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'},
                        height ${state === STATES.IDLE ? '300ms' : '400ms'} ${state === STATES.HOVER ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'},
                        border-radius ${state === STATES.IDLE ? '300ms' : '400ms'} ${state === STATES.HOVER ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'},
                        background 200ms ease;
                    outline: none;
                    text-decoration: none;
                    -webkit-tap-highlight-color: transparent;
                }

                .image-button:focus-visible {
                    outline: 2px solid #0A0A08;
                    outline-offset: 4px;
                }

                .ib-image-wrapper {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    border-radius: inherit;
                    opacity: ${isExpanded ? 1 : 0};
                    transition: opacity 250ms ease;
                }

                .ib-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scale(1.3);
                    transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
                }

                .ib-vignette {
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.4);
                    background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.25) 100%);
                    pointer-events: none;
                }

                .ib-label {
                    position: relative;
                    z-index: 2;
                    color: #ffffff;
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
                    white-space: nowrap;
                    opacity: ${showLabel ? 1 : 0};
                    transition: opacity 250ms ease ${showLabel ? '150ms' : '0ms'};
                    pointer-events: none;
                }

                @media (prefers-reduced-motion: reduce) {
                    .image-button,
                    .ib-image-wrapper,
                    .ib-image-wrapper img,
                    .ib-label {
                        transition-duration: 0.01s !important;
                        transition-delay: 0s !important;
                    }
                }
            `}</style>
        </>
    );
}
