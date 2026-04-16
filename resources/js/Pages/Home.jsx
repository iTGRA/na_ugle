/**
 * v0.2 — Главная страница НА УГЛЕ.
 *
 * Изменения vs v0.1:
 *   - Hero-слайдер убран. Новый hero = ManifestoSection (корова + слоган)
 *   - Остальные секции без изменений (пока)
 */
import { Head } from '@inertiajs/react';
import AnnouncementBar from '../Components/AnnouncementBar';
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import ManifestoSection from '../Components/Sections/ManifestoSection';
import GallerySection from '../Components/Sections/GallerySection';
import MenuHitsSection from '../Components/Sections/MenuHitsSection';
import ChefSection from '../Components/Sections/ChefSection';
// ChefPicksSection removed in v0.2 — chef picks still available via /menu filter
import ContactsSection from '../Components/Sections/ContactsSection';

export default function Home({ settings = {}, featuredItems = [], atmospherePhotos = [], teamPhotos = [], chef }) {
    return (
        <>
            <Head title="Главная" />
            <div className="sticky top-0 z-40 bg-paper">
                <AnnouncementBar isOpen={settings.is_open} text={settings.announcement_text} />
                <Header variant="solid" phone={settings.phone} address={settings.address} />
            </div>
            <main>
                <ManifestoSection
                    headline={settings.manifesto_headline}
                    text={settings.manifesto_text}
                    barMenuPdf={settings.bar_menu_pdf}
                    wineCardPdf={settings.wine_card_pdf}
                />
                <GallerySection
                    photos={atmospherePhotos}
                    instagramUrl={settings.instagram_url}
                    headline={settings.gallery_headline}
                />
                <MenuHitsSection
                    items={featuredItems}
                    menuPdf={settings.menu_pdf}
                    headline={settings.hits_headline}
                />
                <ChefSection chef={chef} teamPhotos={teamPhotos} />
                <ContactsSection settings={settings} headline={settings.contacts_headline} />
            </main>
            <Footer />
        </>
    );
}
