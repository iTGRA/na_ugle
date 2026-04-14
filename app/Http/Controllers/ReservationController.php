<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationRequest;
use App\Jobs\SendReservationNotification;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;

class ReservationController extends Controller
{
    public function store(ReservationRequest $request): RedirectResponse
    {
        $reservation = Reservation::create($request->validated() + ['status' => Reservation::STATUS_NEW]);

        SendReservationNotification::dispatch($reservation);

        return back()->with('reservation_success', 'Заявка отправлена. Мы перезвоним в течение 30 минут.');
    }
}
