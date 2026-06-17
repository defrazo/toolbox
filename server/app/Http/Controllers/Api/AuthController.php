<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function verifyInvite(Request $request): JsonResponse
    {
        $data = $request->validate(['invite_code' => ['required', 'string']]);

        $inviteCode = config('app.register_invite_code');

        if (!$inviteCode || !hash_equals($inviteCode, $data['invite_code'])) {
            return response()->json(['code' => 'INVALID_INVITE'], 422);
        }

        $token = Str::random(64);

        cache()->put(
            'invite_token:' . hash('sha256', $token),
            true,
            now()->addMinutes(10),
        );

        return response()->json(['invite_token' => $token]);
    }

    public function register(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'invite_token' => ['required', 'string'],
            'privacy_accepted' => ['accepted'],
            'username' => ['required', 'string', 'min:2', 'max:32', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers(), 'not_regex:/[А-Яа-яЁё]/u'],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();

            $code = match (true) {
                $errors->has('invite_token') => 'INVALID_INVITE',
                $errors->has('privacy_accepted') => 'PRIVACY_NOT_ACCEPTED',
                $errors->has('username') => 'INVALID_USERNAME',
                $errors->has('email') && str_contains($errors->first('email'), 'taken') => 'EMAIL_TAKEN',
                $errors->has('email') => 'INVALID_EMAIL',
                $errors->has('password') => 'INVALID_PASSWORD',
                default => 'REGISTRATION_ERROR',
            };

            return response()->json(['code' => $code], 422);
        }

        $data = $validator->validated();

        $inviteTokenKey = 'invite_token:' . hash('sha256', $data['invite_token']);

        if (!cache()->pull($inviteTokenKey)) {
            return response()->json(['code' => 'INVALID_INVITE'], 422);
        }

        $user = User::create([
            'username' => $data['username'],
            'email' => mb_strtolower(trim($data['email'])),
            'password' => Hash::make($data['password']),
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json(['code' => 'REGISTER_SUCCESS'], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($data)) {
            return response()->json(['code' => 'INVALID_CREDENTIALS'], 422);
        }

        $user = $request->user();

        if (!$user->hasVerifiedEmail()) {
            Auth::logout();

            return response()->json(['code' => 'EMAIL_NOT_VERIFIED'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        Auth::guard('web')->logout();

        return response()->json(['code' => 'LOGGED_OUT']);
    }

    public function verifyEmail(Request $request, string $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();

            event(new Verified($user));
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->hasVerifiedEmail()) {
            return response()->json(['code' => 'OK']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['code' => 'OK']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        Password::sendResetLink($request->only('email'));

        return response()->json(['code' => 'OK']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers(), 'not_regex:/[А-Яа-яЁё]/u'],

        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password), 'remember_token' => Str::random(60)])->save();
                event(new PasswordReset($user));
            },
        );

        return $status === Password::PasswordReset
            ? response()->json(['code' => 'PASSWORD_RESET'])
            : response()->json(['code' => 'PASSWORD_RESET_FAILED'], 422);
    }
}
