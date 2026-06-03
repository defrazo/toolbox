<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShortLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShortLinkController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['url' => ['required', 'url']]);

        $code = ShortLink::generateUniqueCode();

        $link = ShortLink::create([
            'code' => $code,
            'original_url' => $validated['url'],
        ]);

        return response()->json([
            'short_url' => url("/{$link->code}"),
            'code' => $link->code,
        ]);
    }
}
