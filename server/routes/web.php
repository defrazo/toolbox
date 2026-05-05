<?php

use App\Http\Controllers\RedirectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// short link redirect
Route::get('/{code}', RedirectController::class);

Route::post('/login', function (Request $request) {
    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $request->session()->regenerate();

    return response()->json(Auth::user());
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();

    return response()->json(['message' => 'logged out']);
});
