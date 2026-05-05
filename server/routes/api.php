<?php

use App\Http\Controllers\Api\ShortLinkController;
use App\Http\Controllers\RenamerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Renamer API
Route::post('/renamer', [RenamerController::class, 'renamer']);

// Shortener API
Route::post('/shorten', [ShortLinkController::class, 'store']);
