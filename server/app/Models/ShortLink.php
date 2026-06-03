<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

#[Fillable(['code', 'original_url'])]

class ShortLink extends Model
{
    public static function generateUniqueCode(int $length = 6): string
    {
        do {
            $code = Str::random($length);
        } while (static::where('code', $code)->exists());

        return $code;
    }
}
