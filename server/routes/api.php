<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\OneMateAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Internal\ConnectedAccountController;
use App\Http\Controllers\Links\ShortLinkController;
use App\Http\Controllers\User\UserController;
use App\Http\Middleware\VerifyInternalToken;
use Illuminate\Support\Facades\Route;

// Auth
Route::post('/invite/verify', [AuthController::class, 'verifyInvite'])
    ->middleware('throttle:5,1');

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::get('/auth/session', [AuthController::class, 'session'])
    ->middleware('throttle:60,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::post('/auth/onemate/link/confirm', [OneMateAuthController::class, 'confirmLink'])
    ->middleware('throttle:5,1');

// Password
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])
    ->middleware('throttle:5,1');

Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->middleware('throttle:5,1');

// Email verification
Route::post('/email/resend', [EmailVerificationController::class, 'resendVerification'])
    ->middleware('throttle:3,1');

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verifyEmail'])
    ->middleware(['signed:relative', 'throttle:6,1'])
    ->name('verification.verify');

Route::get('/user/email/verify/{id}/{hash}', [UserController::class, 'verifyPendingEmail'])
    ->middleware('signed:relative')
    ->name('pending-email.verify');

// Internal
Route::middleware([VerifyInternalToken::class, 'throttle:60,1'])
    ->prefix('internal')
    ->group(function () {
        Route::get('/onemate/accounts/{providerUserId}', [ConnectedAccountController::class, 'show'])
            ->whereUuid('providerUserId');

        Route::delete('/onemate/accounts/{providerUserId}', [ConnectedAccountController::class, 'destroy'])
            ->whereUuid('providerUserId');
    });

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Account
    Route::get('/user', [UserController::class, 'show']);
    Route::patch('/user', [UserController::class, 'update']);
    Route::patch('/user/email', [UserController::class, 'updateEmail']);
    Route::post('/user/email/resend', [UserController::class, 'resendPendingEmail'])
        ->middleware('throttle:3,1');

    Route::patch('/user/password', [UserController::class, 'updatePassword']);

    // Links
    Route::post('/shorten', [ShortLinkController::class, 'store']);
    Route::get('/links', [ShortLinkController::class, 'index']);
    Route::patch('/links/{shortLink}', [ShortLinkController::class, 'update']);
    Route::delete('/links/{shortLink}', [ShortLinkController::class, 'destroy']);
});
