<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShortLinkController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');
Route::post('/invite/verify', [AuthController::class, 'verifyInvite'])
    ->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login']);

// Password
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Email verification
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');
Route::post('/email/resend', [AuthController::class, 'resendVerification'])
    ->middleware('throttle:3,1');

// Pending email verification
Route::get('/user/email/verify/{id}/{hash}', [UserController::class, 'verifyPendingEmail'])
    ->middleware('signed')
    ->name('pending-email.verify');
Route::post('/user/email/resend', [UserController::class, 'resendPendingEmail'])
    ->middleware(['auth:sanctum', 'throttle:3,1']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', [UserController::class, 'show']);
    Route::patch('/user', [UserController::class, 'update']);
    Route::patch('/user/email', [UserController::class, 'updateEmail']);
    Route::patch('/user/password', [UserController::class, 'updatePassword']);

    Route::post('/shorten', [ShortLinkController::class, 'store']);
});
