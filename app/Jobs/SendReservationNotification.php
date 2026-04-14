<?php

namespace App\Jobs;

use App\Models\Reservation;
use App\Models\SiteSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendReservationNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(public Reservation $reservation) {}

    public function handle(): void
    {
        $this->sendTelegram();
        $this->sendEmail();
    }

    protected function sendTelegram(): void
    {
        $token = SiteSetting::get('telegram_bot_token');
        $chat = SiteSetting::get('telegram_chat_id');
        if (!$token || !$chat) {
            return;
        }

        $r = $this->reservation;
        $text = "🔥 *Новая заявка на бронь*\n\n"
            ."👤 {$r->name}\n"
            ."📞 {$r->phone}\n"
            ."📅 ".$r->date->format('d.m.Y').($r->time ? ' '.substr($r->time, 0, 5) : '')."\n"
            ."👥 {$r->guests} чел"
            .($r->comment ? "\n💬 {$r->comment}" : '');

        try {
            Http::timeout(10)->post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chat,
                'text' => $text,
                'parse_mode' => 'Markdown',
            ]);
        } catch (\Throwable $e) {
            Log::warning('Telegram notification failed', ['error' => $e->getMessage()]);
        }
    }

    protected function sendEmail(): void
    {
        $to = SiteSetting::get('notification_email');
        if (!$to) {
            return;
        }

        try {
            $r = $this->reservation;
            Mail::raw(
                "Новая заявка на бронирование НА УГЛЕ\n\n"
                ."Имя: {$r->name}\n"
                ."Телефон: {$r->phone}\n"
                ."Дата: ".$r->date->format('d.m.Y').($r->time ? ' '.substr($r->time, 0, 5) : '')."\n"
                ."Гостей: {$r->guests}\n"
                .($r->comment ? "Комментарий: {$r->comment}\n" : '')
                ."\nПодтвердить в админке: ".route('platform.reservations.edit', $r),
                fn ($m) => $m->to($to)->subject("[НА УГЛЕ] Новая заявка: {$r->name}")
            );
        } catch (\Throwable $e) {
            Log::warning('Reservation email failed', ['error' => $e->getMessage()]);
        }
    }
}
