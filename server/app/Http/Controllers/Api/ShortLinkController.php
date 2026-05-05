<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShortLink;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShortLinkController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $code = Str::random(6);

        while (ShortLink::where('code', $code)->exists()) {
            $code = Str::random(6);
        }

        $link = ShortLink::create([
            'code' => $code,
            'original_url' => $request->url,
        ]);

        return response()->json([
            'short_url' => url('/' . $code),
            'code' => $code,
        ]);
    }
}
