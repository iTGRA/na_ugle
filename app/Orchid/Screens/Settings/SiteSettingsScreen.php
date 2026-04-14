<?php

namespace App\Orchid\Screens\Settings;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Fields\Upload;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class SiteSettingsScreen extends Screen
{
    public function query(): iterable
    {
        $s = SiteSetting::all();
        $settings = [];
        foreach ([
            'is_open', 'announcement_text', 'address', 'phone', 'work_hours', 'season',
            'hero_slogan', 'hero_description', 'durnyasha_quote',
            'manifesto_headline', 'manifesto_text',
            'how_to_find', 'instagram_url', 'telegram_url',
            'yandex_maps_url', '2gis_url', 'map_embed',
            'menu_pdf', 'bar_menu_pdf', 'wine_card_pdf',
            'notification_email', 'telegram_bot_token', 'telegram_chat_id',
        ] as $key) {
            $settings[$key] = $s->get($key, '');
        }
        $settings['is_open'] = SiteSetting::bool('is_open');
        return ['settings' => $settings];
    }

    public function name(): ?string { return 'Настройки сайта'; }

    public function commandBar(): iterable
    {
        return [Button::make('Сохранить всё')->method('save')->type(Color::PRIMARY)->icon('bs.check')];
    }

    public function layout(): iterable
    {
        return [
            Layout::tabs([
                'Основное' => Layout::rows([
                    CheckBox::make('settings.is_open')->title('Ресторан открыт')->sendTrueOrFalse(),
                    Input::make('settings.announcement_text')->title('Текст баннера на сайте')->placeholder('Сегодня открыты: 12:00–23:00'),
                    Input::make('settings.address')->title('Адрес'),
                    Input::make('settings.phone')->title('Телефон'),
                    TextArea::make('settings.work_hours')->title('Режим работы')->rows(3),
                    Input::make('settings.season')->title('Сезон')->placeholder('Май — Сентябрь'),
                ]),
                'Главная — Hero и Манифест' => Layout::rows([
                    TextArea::make('settings.hero_slogan')->title('Hero: слоган (многострочный)')->rows(4),
                    TextArea::make('settings.hero_description')->title('Hero: описание')->rows(4),
                    TextArea::make('settings.durnyasha_quote')->title('Цитата Дурняши')->rows(2),
                    TextArea::make('settings.manifesto_headline')->title('Манифест: заголовок (многостр.)')->rows(3),
                    TextArea::make('settings.manifesto_text')->title('Манифест: текст')->rows(4),
                ]),
                'PDF меню' => Layout::rows([
                    Input::make('settings.menu_pdf')->title('URL основного меню PDF'),
                    Input::make('settings.bar_menu_pdf')->title('URL барного меню PDF'),
                    Input::make('settings.wine_card_pdf')->title('URL винной карты PDF'),
                ]),
                'Контакты и карты' => Layout::rows([
                    TextArea::make('settings.how_to_find')->title('Как добраться')->rows(3),
                    Input::make('settings.yandex_maps_url')->title('Ссылка Яндекс.Карты'),
                    Input::make('settings.2gis_url')->title('Ссылка 2GIS'),
                    TextArea::make('settings.map_embed')->title('Embed-код карты (iframe)')->rows(4),
                    Input::make('settings.instagram_url')->title('Instagram URL'),
                    Input::make('settings.telegram_url')->title('Telegram URL'),
                ]),
                'Уведомления' => Layout::rows([
                    Input::make('settings.notification_email')->type('email')->title('Email для заявок'),
                    Input::make('settings.telegram_bot_token')->title('Telegram Bot Token'),
                    Input::make('settings.telegram_chat_id')->title('Telegram Chat ID'),
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
        Toast::info('Настройки сохранены');
    }
}
