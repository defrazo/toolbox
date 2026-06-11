<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ShortLink extends Model
{
    protected $fillable = ['code', 'original_url', 'user_id', 'locked', 'clicks'];

    protected $casts = ['locked' => 'boolean', 'clicks' => 'integer'];

    public static function generateUniqueCode(int $length = 6): string
    {
        do {
            $code = Str::random($length);
        } while (static::where('code', $code)->exists());

        return $code;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return !$this->locked
            && $this->created_at !== null
            && $this->created_at->lt(now()->subDay());
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query
            ->where('locked', false)
            ->where('created_at', '<', now()->subDay());
    }

    public function incrementClicks(): void
    {
        $this->increment('clicks');
    }
}
