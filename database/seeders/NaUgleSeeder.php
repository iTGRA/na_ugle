<?php

namespace Database\Seeders;

use App\Models\ChefProfile;
use App\Models\HeroSlide;
use App\Models\MenuCategory;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class NaUgleSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedCategories();
        $this->seedSettings();
        $this->seedHeroSlide();
        $this->seedChef();
    }

    private function seedCategories(): void
    {
        $categories = [
            ['name' => 'На хлеб',   'slug' => 'na-hleb',   'icon' => '🥖', 'sort_order' => 10],
            ['name' => 'Закуски',   'slug' => 'zakuski',   'icon' => '🔥', 'sort_order' => 20],
            ['name' => 'Салаты',    'slug' => 'salaty',    'icon' => '🥗', 'sort_order' => 30],
            ['name' => 'Супы',      'slug' => 'supy',      'icon' => '🍲', 'sort_order' => 40],
            ['name' => 'Горячее',   'slug' => 'goryachee', 'icon' => '🥩', 'sort_order' => 50],
            ['name' => 'Колбасы',   'slug' => 'kolbasy',   'icon' => '🌭', 'sort_order' => 60],
            ['name' => 'Гарниры',   'slug' => 'garniry',   'icon' => '🥔', 'sort_order' => 70],
            ['name' => 'Соусы',     'slug' => 'sousy',     'icon' => '🥫', 'sort_order' => 80],
            ['name' => 'Десерты',   'slug' => 'deserty',   'icon' => '🍰', 'sort_order' => 90],
            ['name' => 'Напитки',   'slug' => 'napitki',   'icon' => '🥤', 'sort_order' => 100],
        ];

        foreach ($categories as $cat) {
            MenuCategory::updateOrCreate(['slug' => $cat['slug']], $cat + ['is_active' => true]);
        }
    }

    private function seedSettings(): void
    {
        $defaults = [
            'is_open' => '1',
            'announcement_text' => 'Сегодня открыты: 12:00 – 23:00',
            'address' => 'ул. Максима Горького 1, набережная Самары',
            'phone' => '8-906-347-77-07',
            'work_hours' => "Пн–Чт: 12:00 – 23:00\nПт–Вс: 12:00 – 00:00",
            'season' => 'Май — Сентябрь',
            'how_to_find' => 'Напротив речного вокзала, рядом с колесом обозрения. Ищите хоспер и огонь.',
            'instagram_url' => '',
            'telegram_url' => '',
            'yandex_maps_url' => '',
            '2gis_url' => '',
            'map_embed' => '',
            'manifesto_headline' => "Честная еда\nна открытом\nогне",
            'manifesto_text' => 'Мы готовим на хоспере и углях, делаем колбасы в собственном цеху и не придумываем лишнего. Просто хорошие продукты, живой огонь и вид на Волгу.',
            'hero_slogan' => "Гриль, колбаски и пиво.\nПростые удовольствия\nна набережной Самары.",
            'hero_description' => 'Шкодно-народный летник на набережной Самары, где мы собираем всё, за что любим простую и честную гастрономию. В основе — еда на углях, собственные колбасы, настойки и широкая пивная карта.',
            'durnyasha_quote' => 'Наша корова Дурняша уже сидит «На Угле» и ждёт вас в гости 🐄',
            'notification_email' => '',
            'telegram_bot_token' => '',
            'telegram_chat_id' => '',
            'menu_pdf' => '',
            'bar_menu_pdf' => '',
            'wine_card_pdf' => '',
        ];

        foreach ($defaults as $key => $value) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    private function seedHeroSlide(): void
    {
        HeroSlide::firstOrCreate(
            ['title' => 'Гриль, колбаски и пиво'],
            [
                'subtitle' => 'Простые удовольствия на набережной Самары',
                'cta_text' => 'Смотреть меню',
                'cta_url' => '#menu',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );
    }

    private function seedChef(): void
    {
        ChefProfile::firstOrCreate(
            ['name' => 'Андрей Воробьёв'],
            [
                'position' => 'Шеф-повар НА УГЛЕ и La Volte',
                'bio_text' => '14 лет в профессии. Французская школа встречает открытый огонь. Работал в BerezkaGroup (ресторан Monica), Министерстве Завтраков (Нижний Новгород), Molto Buona (Санкт-Петербург). Сейчас шеф La Volte в Самаре.',
                'quote' => 'В работе с едой два подхода: от образа — создаёшь форму, настроение, а потом накручиваешь технику. Или от продукта — понимаешь его свойства, сезонность, и находишь форму. Лучше, когда удаётся использовать оба.',
                'facts' => [
                    'Стаж' => '14 лет',
                    'Специализация' => 'Французская кухня',
                    'Стажировки' => 'Azurmendi ⭐⭐⭐ (Испания), Lysverket (Норвегия)',
                    'Текущий проект' => 'La Volte, Самара, ул. Самарская 200А',
                ],
                'lavolt_note' => 'Десерт «La Volte» в меню НА УГЛЕ — крем-брюле, которое Андрей совершенствовал 4 года и довёл до финального рецепта именно в La Volte.',
                'is_active' => true,
            ]
        );
    }
}
