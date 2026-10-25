<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use App\Models\OAuthAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ConnectedAccountController extends Controller
{
    public function show(Request $request, string $providerUserId): JsonResponse
    {
        $account = OAuthAccount::query()
            ->with('user')
            ->where('provider', 'onemate')
            ->where('provider_user_id', $providerUserId)
            ->first();

        if (!$account || !$account->user) {
            return response()->json([
                'connected' => false,
            ]);
        }

        return response()->json([
            'connected' => true,
            'account_type' => $account->user->password === null ? 'cloud' : 'local',
        ]);
    }

    public function destroy(Request $request, string $providerUserId): JsonResponse
    {
        $validated = $request->validate([
            'expected_account_type' => ['required', Rule::in(['cloud', 'local'])],
        ]);

        $result = DB::transaction(function () use ($providerUserId, $validated) {
            $account = OAuthAccount::query()
                ->where('provider', 'onemate')
                ->where('provider_user_id', $providerUserId)
                ->lockForUpdate()
                ->first();

            if (!$account) {
                return [
                    'disconnected' => true,
                    'deleted' => false,
                ];
            }

            $user = $account->user()
                ->lockForUpdate()
                ->first();

            if (!$user) {
                $account->delete();

                return [
                    'disconnected' => true,
                    'deleted' => false,
                ];
            }

            $accountType = $user->password === null ? 'cloud' : 'local';

            if ($accountType !== $validated['expected_account_type']) {
                return [
                    'disconnected' => false,
                    'conflict' => true,
                ];
            }

            if ($accountType === 'cloud') {
                DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->delete();

                $user->tokens()->delete();

                $user->delete();

                return [
                    'disconnected' => true,
                    'deleted' => true,
                ];
            }

            $account->delete();

            return [
                'disconnected' => true,
                'deleted' => false,
            ];
        });

        if ($result['conflict'] ?? false) {
            return response()->json([
                'message' => 'Тип аккаунта изменился. Подтвердите отключение повторно',
            ], 409);
        }

        return response()->json($result);
    }
}
