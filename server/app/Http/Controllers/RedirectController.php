<?php

namespace App\Http\Controllers;

use App\Models\ShortLink;
use Illuminate\Http\RedirectResponse;

class RedirectController extends Controller
{
    public function __invoke(string $code): RedirectResponse
    {
        $link = ShortLink::where('code', $code)->firstOrFail();

        if ($link->isExpired()) {
            abort(410, 'SHORT_LINK_EXPIRED');
        }

        $link->incrementClicks();

        return redirect()->away($link->original_url);
    }
}
