<?php

namespace App\Orchid\Screens\Reservation;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class ReservationListScreen extends Screen
{
    public function query(Request $request): iterable
    {
        $q = Reservation::query()->orderByDesc('created_at');
        if ($request->filled('status')) {
            $q->where('status', $request->string('status'));
        }
        if ($request->filled('search')) {
            $s = $request->string('search');
            $q->where(fn ($x) => $x->where('name', 'like', "%{$s}%")->orWhere('phone', 'like', "%{$s}%"));
        }
        return ['reservations' => $q->paginate(30)];
    }

    public function name(): ?string { return 'Бронирования'; }

    public function layout(): iterable
    {
        return [
            Layout::table('reservations', [
                TD::make('created_at', 'Заявка')->render(fn (Reservation $r) =>
                    $r->created_at?->format('d.m.Y H:i')),
                TD::make('name', 'Имя')->render(fn (Reservation $r) =>
                    Link::make($r->name)->route('platform.reservations.edit', $r)),
                TD::make('phone', 'Телефон')->render(fn (Reservation $r) =>
                    '<a href="tel:'.e($r->phone).'">'.e($r->phone).'</a>'),
                TD::make('date', 'Визит')->render(fn (Reservation $r) =>
                    $r->date?->format('d.m').($r->time ? ' '.substr($r->time, 0, 5) : '')),
                TD::make('guests', 'Чел'),
                TD::make('status', 'Статус')->render(fn (Reservation $r) => match ($r->status) {
                    'new' => '🟡 Новая',
                    'confirmed' => '🟢 Подтверждена',
                    'cancelled' => '🔴 Отменена',
                    default => $r->status,
                }),
            ]),
        ];
    }
}
