<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class Reservation extends Model
{
    use HasFactory, AsSource, Filterable;

    public const STATUS_NEW = 'new';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_LABELS = [
        self::STATUS_NEW => 'Новая',
        self::STATUS_CONFIRMED => 'Подтверждена',
        self::STATUS_CANCELLED => 'Отменена',
    ];

    protected $fillable = [
        'name', 'phone', 'date', 'time', 'guests', 'comment', 'status',
    ];

    protected $casts = [
        'date' => 'date',
        'guests' => 'integer',
    ];

    public function scopeNew($query)
    {
        return $query->where('status', self::STATUS_NEW);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }
}
