import { Head } from '@inertiajs/react';
import ParticleHero from '../Components/UI/ParticleHero';

export default function Lab() {
    return (
        <>
            <Head title="Lab" />
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
        </>
    );
}
