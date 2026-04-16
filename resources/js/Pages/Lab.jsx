import { Head } from '@inertiajs/react';
import ParticleHero from '../Components/UI/ParticleHero';
import ImageButton from '../Components/UI/ImageButton';

export default function Lab() {
    return (
        <>
            <Head title="Lab" />
            <div className="relative">
                <ParticleHero
                    text="Swipe"
                    height={typeof window !== 'undefined' ? window.innerHeight : 800}
                    particleCount={120}
                    gridCols={14}
                    gridRows={10}
                    bgColor="#F5F0E8"
                    particleColor="#0A0A08"
                    textClassName="font-bold"
                />
                {/* ImageButton centered below the title */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 z-10"
                    style={{ top: 'calc(50% + 80px)' }}
                >
                    <ImageButton
                        imageSrc="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80&auto=format&fit=crop"
                        label="Смотреть проект"
                        ariaLabel="Открыть проект"
                        onClick={() => { if (typeof window !== 'undefined') window.location.href = '/'; }}
                        dotSize={18}
                        sphereSize={130}
                        capsuleWidth={240}
                        capsuleHeight={110}
                    />
                </div>
            </div>
        </>
    );
}
