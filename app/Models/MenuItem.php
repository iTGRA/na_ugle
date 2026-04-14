<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Orchid\Attachment\Attachable;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class MenuItem extends Model
{
    use HasFactory, AsSource, Filterable, Attachable;

    protected $fillable = [
        'category_id', 'photo', 'name', 'description', 'price',
        'is_featured', 'is_chef_pick', 'chef_comment',
        'is_available', 'sort_order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_chef_pick' => 'boolean',
        'is_available' => 'boolean',
        'price' => 'integer',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'category_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeChefPicks($query)
    {
        return $query->where('is_chef_pick', true);
    }
}
