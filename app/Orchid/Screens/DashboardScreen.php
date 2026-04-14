<?php

namespace App\Orchid\Screens;

use App\Models\Reservation;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class DashboardScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'is_open' => SiteSetting::bool('is_open'),
            'announcement_text' => SiteSetting::get('announcement_text', ''),
            'new_count' => Reservation::new()->count(),
            'total_count' => Reservation::count(),
            'recent' => Reservation::orderByDesc('created_at')->limit(5)->get(),
        ];
    }

    public function name(): ?string
    {
        return 'На Угле — дашборд';
    }

    public function description(): ?string
    {
        return 'Главное: режим работы ресторана и последние заявки.';
    }

    public function commandBar(): iterable
    {
        $isOpen = SiteSetting::bool('is_open');

        return [
            Button::make($isOpen ? '🟢 РЕСТОРАН ОТКРЫТ' : '🔴 РЕСТОРАН ЗАКРЫТ')
                ->method('toggleOpen')
                ->type($isOpen ? Color::SUCCESS : Color::DANGER)
                ->confirm($isOpen ? 'Закрыть ресторан?' : 'Открыть ресторан?'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::metrics([
                'Новых заявок' => 'new_count',
                'Всего заявок' => 'total_count',
            ]),
            Layout::rows([
                TextArea::make('announcement_text')
                    ->title('Текст баннера на сайте')
                    ->rows(2)
                    ->help('Например: «Сегодня открыты: 12:00 – 23:00»'),
            ]),
            Layout::table('recent', [
                TD::make('created_at', 'Заявка')->render(fn (Reservation $r) => $r->created_at?->format('d.m H:i')),
                TD::make('name', 'Имя'),
                TD::make('phone', 'Телефон')->render(fn (Reservation $r) => '<a href="tel:'.e($r->phone).'">'.e($r->phone).'</a>'),
                TD::make('date', 'Визит')->render(fn (Reservation $r) => $r->date?->format('d.m').' · '.$r->guests.' чел'),
                TD::make('status', 'Статус')->render(fn (Reservation $r) => $r->status_label),
            ])->title('Последние заявки'),
        ];
    }

    public function toggleOpen(Request $request)
    {
        $new = !SiteSetting::bool('is_open');
        SiteSetting::put('is_open', $new ? '1' : '0');
        Toast::info($new ? 'Ресторан открыт' : 'Ресторан закрыт');
    }

    public function save(Request $request)
    {
        SiteSetting::put('announcement_text', (string) $request->input('announcement_text', ''));
        Toast::info('Сохранено');
    }
}
