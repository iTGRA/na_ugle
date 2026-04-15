<?php

namespace App\Orchid\Screens\Settings;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class SiteSettingsScreen extends Screen
{
    public const KEYS = [
        // Main
        'is_open', 'announcement_text', 'address', 'phone', 'work_hours', 'season',
        // Manifesto + Durnyasha (Hero slogans now per-slide in /admin/hero-slides)
        'durnyasha_quote',
        'manifesto_headline', 'manifesto_text',
        // Section headlines (editable)
        'gallery_headline', 'hits_headline', 'chef_picks_headline', 'contacts_headline',
        // Contacts
        'how_to_find', 'instagram_url', 'telegram_url',
        'yandex_maps_url', '2gis_url', 'map_embed',
        // PDFs
        'menu_pdf', 'bar_menu_pdf', 'wine_card_pdf',
        // Notifications
        'notification_email', 'telegram_bot_token', 'telegram_chat_id',
    ];

    public function query(): iterable
    {
        $s = SiteSetting::allSettings();
        $settings = [];
        foreach (self::KEYS as $key) {
            $settings[$key] = $s[$key] ?? '';
        }
        $settings['is_open'] = SiteSetting::bool('is_open');

        return ['settings' => $settings];
    }

    public function name(): ?string { return 'Настройки сайта'; }

    public function description(): ?string
    {
        return 'Все тексты, контакты, ссылки и интеграции. Изменения видны на сайте сразу после сохранения.';
    }

    public function commandBar(): iterable
    {
        return [
            Link::make('Открыть сайт')
                ->href(config('app.url'))
                ->target('_blank')
                ->icon('bs.eye'),
            Button::make('Сохранить всё')
                ->method('save')
                ->type(Color::PRIMARY)
                ->icon('bs.check'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::tabs([
                'Основное' => Layout::rows([
                    CheckBox::make('settings.is_open')
                        ->title('Ресторан открыт')
                        ->help('Управляет верхним баннером на сайте. Дублируется кнопкой на дашборде.')
                        ->sendTrueOrFalse(),
                    Input::make('settings.announcement_text')
                        ->title('Текст верхнего баннера')
                        ->placeholder('Сегодня открыты: 12:00 – 23:00')
                        ->help('Виден на сайте только если «Ресторан открыт» включён.'),
                    Input::make('settings.address')
                        ->title('Адрес')
                        ->help('Используется в хедере, контактах и футере.'),
                    Input::make('settings.phone')
                        ->title('Телефон')
                        ->placeholder('8-906-347-77-07')
                        ->help('Используется в хедере, кнопках «Забронировать», блоке контактов и футере. По клику инициирует звонок.'),
                    TextArea::make('settings.work_hours')
                        ->title('Режим работы')
                        ->rows(3)
                        ->help('Многострочно. Видно в блоке Контакты и в футере.'),
                    Input::make('settings.season')
                        ->title('Сезон')
                        ->placeholder('Май — Сентябрь'),
                ]),

                'Манифест' => Layout::rows([
                    TextArea::make('settings.manifesto_headline')
                        ->title('Манифест: заголовок')
                        ->rows(3)
                        ->help('Многострочный заголовок в блоке «Честная еда…». По умолчанию: 3 строки.'),
                    TextArea::make('settings.manifesto_text')
                        ->title('Манифест: основной текст')
                        ->rows(4)
                        ->help('Один абзац под заголовком. Голос бренда: фактически и без пафоса.'),
                    TextArea::make('settings.durnyasha_quote')
                        ->title('Реплика Дурняши')
                        ->rows(2)
                        ->help('Появляется в манифесте после основного текста.'),
                ]),

                'Заголовки секций' => Layout::rows([
                    TextArea::make('settings.gallery_headline')
                        ->title('Заголовок галереи')
                        ->rows(2)
                        ->placeholder('Наслаждаемся закатами в нашей атмосфере')
                        ->help('Многострочный. По умолчанию: «Наслаждаемся закатами / в нашей атмосфере».'),
                    Input::make('settings.hits_headline')
                        ->title('Заголовок «Хиты с хоспера»')
                        ->placeholder('Хиты с хоспера'),
                    Input::make('settings.chef_picks_headline')
                        ->title('Заголовок «Рекомендации шефа»')
                        ->placeholder('Рекомендации от шефа'),
                    Input::make('settings.contacts_headline')
                        ->title('Заголовок «Контакты»')
                        ->placeholder('Как нас найти'),
                ]),

                'Контакты и карты' => Layout::rows([
                    TextArea::make('settings.how_to_find')
                        ->title('Как добраться')
                        ->rows(3)
                        ->help('Подсказка под адресом. Например: «На набережной Волги, под Струковским парком».'),
                    Input::make('settings.yandex_maps_url')
                        ->title('Ссылка на Яндекс.Карты')
                        ->placeholder('https://yandex.ru/maps/...'),
                    Input::make('settings.2gis_url')
                        ->title('Ссылка на 2GIS')
                        ->placeholder('https://2gis.ru/samara/...'),
                    TextArea::make('settings.map_embed')
                        ->title('Embed-код карты')
                        ->rows(4)
                        ->help('Скопируйте iframe из Яндекс.Карт или 2GIS («Поделиться» → «Получить код карты»).'),
                    Input::make('settings.instagram_url')
                        ->title('Instagram URL')
                        ->placeholder('https://instagram.com/...'),
                    Input::make('settings.telegram_url')
                        ->title('Telegram URL')
                        ->placeholder('https://t.me/...'),
                ]),

                'PDF меню' => Layout::view('orchid.pdf-uploads'),

                'Уведомления (Telegram)' => Layout::rows([
                    Input::make('settings.notification_email')
                        ->type('email')
                        ->title('Email для уведомлений')
                        ->help('Резерв на будущее (форма брони сейчас отключена — бронь идёт звонком).'),
                    Input::make('settings.telegram_bot_token')
                        ->title('Telegram Bot Token')
                        ->help('Токен бота для отправки уведомлений. Получить: @BotFather в Telegram.'),
                    Input::make('settings.telegram_chat_id')
                        ->title('Telegram Chat ID')
                        ->help('ID чата/канала куда слать уведомления.'),
                ]),
            ]),
        ];
    }

    public function save(Request $request)
    {
        $data = (array) $request->input('settings', []);
        foreach ($data as $key => $value) {
            if ($key === 'is_open') {
                SiteSetting::put('is_open', $value ? '1' : '0');
            } else {
                SiteSetting::put($key, (string) $value);
            }
        }
        Toast::info('Настройки сохранены. Изменения уже на сайте.');
    }
}
