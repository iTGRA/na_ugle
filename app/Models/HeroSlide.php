<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Support\PageCache;
use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Attachable;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class HeroSlide extends Model
{
    use HasFactory, AsSource, Filterable, Attachable;

    protected $fillable = [
        'photo', 'title', 'slogan', 'subtitle', 'cta_text', 'cta_url', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
    protected static function booted(): void
    {
        $flush = fn () => PageCache::flushHome();
        static::saved($flush);
        static::deleted($flush);
    }

}
