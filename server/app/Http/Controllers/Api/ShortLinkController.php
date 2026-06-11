<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShortLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShortLinkController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $links = ShortLink::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $links->map(fn (ShortLink $link) => $this->toResponse($link)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate(['url' => ['required', 'url', 'max:2048']]);

        $link = ShortLink::create([
            'code' => ShortLink::generateUniqueCode(),
            'original_url' => $validated['url'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => $this->toResponse($link),
            'code' => 'SHORT_LINK_CREATED',
        ], 201);
    }

    public function update(Request $request, ShortLink $shortLink): JsonResponse
    {
        $this->authorize('update', $shortLink);

        $validated = $request->validate(['locked' => ['required', 'boolean']]);

        $shortLink->update($validated);

        return response()->json([
            'data' => $this->toResponse($shortLink),
            'code' => 'SHORT_LINK_UPDATED',
        ]);
    }

    public function destroy(ShortLink $shortLink): JsonResponse
    {
        $this->authorize('delete', $shortLink);

        $shortLink->delete();

        return response()->json(['code' => 'SHORT_LINK_DELETED']);
    }

    private function toResponse(ShortLink $link): array
    {
        return [
            'id' => $link->id,
            'code' => $link->code,
            'short_url' => url("/{$link->code}"),
            'original_url' => $link->original_url,
            'clicks' => $link->clicks,
            'locked' => $link->locked,
            'created_at' => $link->created_at?->toIso8601String(),
        ];
    }
}
