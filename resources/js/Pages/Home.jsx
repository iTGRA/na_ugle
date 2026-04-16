/**
 * Главная страница лендинга НА УГЛЕ.
 *
 * Props (от HomeController):
 *   settings    — SiteSetting key-value (manifesto, contacts, PDFs, section headlines)
 *   heroSlides  — массив слайдов (photo, title, slogan, subtitle, cta)
 *   featuredItems — блюда с is_featured=true (до 12)
 *   chefPicks   — блюда с is_chef_pick=true (все)
 *   atmospherePhotos — GalleryPhoto section=atmosphere
 *   teamPhotos  — GalleryPhoto section=team
 *   chef        — ChefProfile (single active)
 */
import { Head } from '@inertiajs/react';
import AnnouncementBar from '../Components/AnnouncementBar';
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import HeroSection from '../Components/Hero/HeroSection';
import ManifestoSection from '../Components/Sections/ManifestoSection';
import GallerySection from '../Components/Sections/GallerySection';
import MenuHitsSection from '../Components/Sections/MenuHitsSection';
import ChefSection from '../Components/Sections/ChefSection';
import ChefPicksSection from '../Components/Sections/ChefPicksSection';
import ContactsSection from '../Components/Sections/ContactsSection';

export default function Home({ settings = {}, heroSlides = [], featuredItems = [], chefPicks = [], atmospherePhotos = [], teamPhotos = [], chef }) {
    return (
        <>
            <Head title="Главная" />
            <div className="sticky top-0 z-40 bg-paper">
                <AnnouncementBar isOpen={settings.is_open} text={settings.announcement_text} />
                <Header variant="solid" phone={settings.phone} address={settings.address} />
            </div>
            <main>
                <HeroSection slides={heroSlides} phone={settings.phone} />
                <ManifestoSection
                    headline={settings.manifesto_headline}
                    text={settings.manifesto_text}
                    durnyashaQuote={settings.durnyasha_quote}
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
                <ChefPicksSection items={chefPicks} headline={settings.chef_picks_headline} />
                <ContactsSection settings={settings} headline={settings.contacts_headline} />
            </main>
            <Footer settings={settings} />
        </>
    );
}
