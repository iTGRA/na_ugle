<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Support\PageCache;
use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Attachable;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class ChefProfile extends Model
{
    use HasFactory, AsSource, Filterable, Attachable;

    protected $fillable = [
        'name', 'position', 'photo', 'bio_text', 'quote',
        'facts', 'lavolt_note', 'is_active',
    ];

    protected $casts = [
        'facts' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    protected static function booted(): void
    {
        $flush = fn () => PageCache::flushHome();
        static::saved($flush);
        static::deleted($flush);
    }

}
