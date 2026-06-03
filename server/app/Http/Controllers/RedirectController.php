<?php

namespace App\Http\Controllers;

use App\Models\ShortLink;
use Illuminate\Http\RedirectResponse;

class RedirectController extends Controller
{
    public function __invoke(string $code): RedirectResponse
    {
        $link = ShortLink::where('code', $code)->firstOrFail();

        return redirect($link->original_url);
    }
}
