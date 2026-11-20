<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShortLink extends Model
{
    private const CODE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

    private const MIN_CODE_LENGTH = 3;

    private const MAX_CODE_LENGTH = 12;

    private const ATTEMPTS_PER_LENGTH = 20;

    protected $fillable = ['code', 'original_url', 'user_id', 'locked', 'clicks'];

    protected $casts = ['locked' => 'boolean', 'clicks' => 'integer'];

    public static function generateUniqueCode(): string
    {
        $alphabetLength = strlen(self::CODE_ALPHABET);

        for ($length = self::MIN_CODE_LENGTH; $length <= self::MAX_CODE_LENGTH; $length++) {
            for ($attempt = 0; $attempt < self::ATTEMPTS_PER_LENGTH; $attempt++) {
                $code = '';

                for ($i = 0; $i < $length; $i++) {
                    $code .= self::CODE_ALPHABET[random_int(0, $alphabetLength - 1)];
                }

                if (!static::where('code', $code)->exists()) {
                    return $code;
                }
            }
        }

        throw new \RuntimeException('Unable to generate a unique short link code.');
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
