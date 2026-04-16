import { Head } from '@inertiajs/react';
import ParticleV1 from '../Components/UI/variants/ParticleV1_Breathing';
import ParticleV2 from '../Components/UI/variants/ParticleV2_Liquid';
import ParticleV3 from '../Components/UI/variants/ParticleV3_WarpDrive';
import ParticleV4 from '../Components/UI/variants/ParticleV4_NeonTunnel';
import ParticleHero from '../Components/UI/ParticleHero';

const SECTION_H = typeof window !== 'undefined' ? Math.min(window.innerHeight, 800) : 700;

function Label({ num, title, desc }) {
    return (
        <div style={{ background: '#0A0A08', color: '#F5F0E8', padding: '16px 32px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>
                Вариант {num}
            </span>
            <span style={{ margin: '0 12px', opacity: 0.3 }}>·</span>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>{title}</span>
            <span style={{ margin: '0 12px', opacity: 0.3 }}>·</span>
            <span style={{ fontSize: '12px', opacity: 0.6 }}>{desc}</span>
        </div>
    );
}

export default function Lab() {
    return (
        <>
            <Head title="Hero Lab — все варианты" />

            <Label num="01" title="Gentle Breathing" desc="Тихое поле точек, дыхание, отталкивание от мыши и текста" />
            <ParticleV1
                text="swipe base"
                height={SECTION_H}
                particleCount={100}
                gridCols={12}
                gridRows={8}
                bgColor="#FFFFFF"
                particleColor="#0A0A08"
                textClassName="font-bold"
            />

            <Label num="02" title="Digital Liquid" desc="4 фазы: REST → WARP → EMBRACE → DISSOLVE (18s цикл)" />
            <ParticleV2
                text="swipe base"
                height={SECTION_H}
                particleCount={120}
                bgColor="#FFFFFF"
                particleColor="#0A0A08"
                textClassName="font-bold"
            />

            <Label num="03" title="Warp Drive" desc="Частицы летят к центру на скорости света, орбита, пульс, дрифт" />
            <ParticleV3
                text="swipe base"
                height={SECTION_H}
                particleCount={200}
                bgColor="#FFFFFF"
                particleColor="#0A0A08"
                textClassName="font-bold"
            />

            <Label num="04" title="Neon Tunnel" desc="Перспективный тоннель, неоновые градиентные линии, edge fade" />
            <ParticleV4
                text="swipe base"
                height={SECTION_H}
                particleCount={250}
                bgColor="#FFFFFF"
                textClassName="font-bold"
            />

            <Label num="05" title="Black Dots Warp (текущий)" desc="Чёрные точки → warp/möbius/tunnel stretch → обратно в точки" />
            <ParticleHero
                text="swipe base"
                height={SECTION_H}
                particleCount={220}
                bgColor="#FFFFFF"
                textClassName="font-bold"
            />
        </>
    );
}
