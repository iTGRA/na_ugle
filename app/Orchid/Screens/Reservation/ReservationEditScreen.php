<?php

namespace App\Orchid\Screens\Reservation;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Screen;
use Orchid\Support\Color;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class ReservationEditScreen extends Screen
{
    public ?Reservation $reservation = null;

    public function query(Reservation $reservation): iterable
    {
        return ['reservation' => $reservation];
    }

    public function name(): ?string
    {
        return 'Заявка: '.($this->reservation?->name ?? '—');
    }

    public function commandBar(): iterable
    {
        return [
            Button::make('Сохранить')->method('save')->type(Color::PRIMARY),
            Button::make('Позвонить')->rawClick()
                ->type(Color::DEFAULT)
                ->attributes(['onclick' => "window.location='tel:".e($this->reservation?->phone)."';return false;"])
                ->canSee((bool) $this->reservation?->phone),
            Button::make('Удалить')->method('remove')->type(Color::DANGER)
                ->confirm('Удалить заявку?')->canSee(($this->reservation?->exists ?? false)),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Input::make('reservation.name')->title('Имя'),
                Input::make('reservation.phone')->title('Телефон'),
                Input::make('reservation.date')->type('date')->title('Дата визита'),
                Input::make('reservation.time')->type('time')->title('Время'),
                Input::make('reservation.guests')->type('number')->title('Количество гостей'),
                TextArea::make('reservation.comment')->title('Комментарий')->rows(3),
                Select::make('reservation.status')->title('Статус')->options([
                    'new' => '🟡 Новая',
                    'confirmed' => '🟢 Подтверждена',
                    'cancelled' => '🔴 Отменена',
                ]),
            ]),
        ];
    }

    public function save(Request $request, Reservation $reservation)
    {
        $data = $request->validate([
            'reservation.name' => 'required|string|max:100',
            'reservation.phone' => 'required|string|max:50',
            'reservation.date' => 'required|date',
            'reservation.time' => 'nullable',
            'reservation.guests' => 'required|integer|min:1|max:100',
            'reservation.comment' => 'nullable|string|max:1000',
            'reservation.status' => 'required|in:new,confirmed,cancelled',
        ])['reservation'];
        $reservation->fill($data)->save();
        Toast::info('Сохранено');
        return redirect()->route('platform.reservations');
    }

    public function remove(Reservation $reservation)
    {
        $reservation->delete();
        Toast::info('Удалено');
        return redirect()->route('platform.reservations');
    }
}
