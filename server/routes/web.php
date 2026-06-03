<?php

use App\Http\Controllers\RedirectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/reset-password/{token}', function (Request $request, string $token) {
    return redirect(
        config('app.frontend_url')
            . "/reset-password?token={$token}&email="
            . urlencode($request->email),
    );
})->name('password.reset');

Route::get('/{code}', RedirectController::class)
    ->where('code', '[a-zA-Z0-9]+');
