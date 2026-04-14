<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Support\PageCache;
use Illuminate\Database\Eloquent\Model;
use Orchid\Attachment\Attachable;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class GalleryPhoto extends Model
{
    use HasFactory, AsSource, Filterable, Attachable;

    public const SECTION_ATMOSPHERE = 'atmosphere';
    public const SECTION_DISHES = 'dishes';
    public const SECTION_TEAM = 'team';

    protected $fillable = [
        'photo', 'section', 'alt_text', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeSection($query, string $section)
    {
        return $query->where('section', $section);
    }
    protected static function booted(): void
    {
        $flush = fn () => PageCache::flushHome();
        static::saved($flush);
        static::deleted($flush);
    }

}
