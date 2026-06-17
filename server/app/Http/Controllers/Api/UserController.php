<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['sometimes', 'string', 'min:2', 'max:32', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'avatar' => ['sometimes', 'string', Rule::in(array_map(fn ($i) => "avatar$i", range(0, 15)))],
        ]);

        $user = $request->user();

        if ($user->is_demo) {
            unset($data['username']);
        }

        $user->update($data);

        return response()->json(['user' => $user->fresh()]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->is_demo) {
            return response()->json(['code' => 'DEMO_RESTRICTED'], 403);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string', 'current_password'],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->mixedCase()->numbers(),
                'not_regex:/[А-Яа-яЁё]/u',
            ],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();

            $code = match (true) {
                $errors->has('current_password') => 'INVALID_CURRENT_PASSWORD',
                $errors->has('password') => 'INVALID_PASSWORD',
                default => 'PASSWORD_UPDATE_ERROR',
            };

            return response()->json(['code' => $code], 422);
        }

        $data = $validator->validated();

        $request->user()->forceFill(['password' => Hash::make($data['password'])])->save();
        $request->user()->sendPasswordChangedNotification();

        return response()->json(['code' => 'PASSWORD_UPDATED']);
    }

    public function updateEmail(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->is_demo) {
            return response()->json(['code' => 'DEMO_RESTRICTED'], 403);
        }

        $data = $request->validate([
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'unique:users,email',
                'unique:users,pending_email',
            ],
        ]);

        if ($user->pending_email) {
            return response()->json(['code' => 'EMAIL_CHANGE_ALREADY_PENDING'], 409);
        }

        $user->forceFill(['pending_email' => mb_strtolower(trim($data['email']))])->save();
        $user->sendPendingEmailVerificationNotification();

        return response()->json([
            'user' => $user->fresh(),
            'code' => 'PENDING_EMAIL_CREATED',
        ]);
    }

    public function resendPendingEmail(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->pending_email) {
            return response()->json(['code' => 'NO_PENDING_EMAIL'], 422);
        }

        $user->sendPendingEmailVerificationNotification();

        return response()->json(['code' => 'PENDING_EMAIL_RESENT']);
    }

    public function verifyPendingEmail(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        if (!$user->pending_email) {
            return response()->json(['code' => 'NO_PENDING_EMAIL'], 422);
        }

        if (!hash_equals($hash, sha1($user->pending_email))) {
            abort(403);
        }

        $user->forceFill([
            'email' => $user->pending_email,
            'pending_email' => null,
            'email_verified_at' => now(),
        ])->save();

        return response()->json([
            'user' => $user->fresh(),
            'code' => 'PENDING_EMAIL_VERIFIED',
        ]);
    }
}
