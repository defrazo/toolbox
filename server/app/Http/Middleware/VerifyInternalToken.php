<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyInternalToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = config('services.onemate.internal_token');

        if (
            !is_string($expected) ||
            $expected === '' ||
            !hash_equals($expected, (string) $request->bearerToken())
        ) {
            abort(403);
        }

        return $next($request);
    }
}
