<?php

use App\Http\Controllers\Auth\OneMateAuthController;
use App\Http\Controllers\Links\RedirectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Password
Route::get('/reset-password/{token}', function (Request $request, string $token) {
    return redirect(
        config('app.frontend_url')
            . "/reset-password?token={$token}&email="
            . urlencode($request->email),
    );
})->name('password.reset');

// Links
Route::get('/{code}', RedirectController::class)
    ->where('code', '[A-Za-z0-9]{6}')
    ->name('redirect');

// OAuth
Route::get('/auth/onemate', [OneMateAuthController::class, 'redirect'])
    ->middleware('throttle:10,1')
    ->name('onemate.redirect');

Route::get('/auth/onemate/callback', [OneMateAuthController::class, 'callback'])
    ->middleware('throttle:10,1')
    ->name('onemate.callback');
