<?php

namespace App\Http\Controllers;

use App\Models\ShortLink;

class RedirectController extends Controller
{
    public function __invoke($code)
    {
        $link = ShortLink::where('code', $code)->first();

        if (!$link) {
            abort(404);
        }

        return redirect($link->original_url);
    }
}
