import { Head } from '@inertiajs/react';

export default function Welcome({ restaurantName }) {
    return (
        <>
            <Head title="Главная" />
            <main style={{ fontFamily: 'system-ui, sans-serif', padding: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>{restaurantName}</h1>
                <p style={{ fontSize: '1.2rem', color: '#555' }}>Ресторан в Самаре</p>
                <p style={{ marginTop: '3rem', color: '#999' }}>Site is under construction.</p>
            </main>
        </>
    );
}
