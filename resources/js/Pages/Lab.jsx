import { Head } from '@inertiajs/react';
import ParticleHero from '../Components/UI/ParticleHero';

export default function Lab() {
    return (
        <>
            <Head title="Lab" />
            <ParticleHero
                text="swipe base"
                height={typeof window !== 'undefined' ? window.innerHeight : 800}
                particleCount={200}
                bgColor="#FFFFFF"
                textClassName="font-bold"
            />
        </>
    );
}
