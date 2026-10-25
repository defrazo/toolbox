<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\OneMateUserService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class OneMateAuthController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $request->session()->forget('onemate_account_link');

        $state = Str::random(40);
        $verifier = Str::random(96);

        $challenge = rtrim(strtr(
            base64_encode(hash('sha256', $verifier, true)),
            '+/',
            '-_',
        ), '=');

        $request->session()->put('onemate_oauth', [
            'state' => $state,
            'verifier' => $verifier,
        ]);

        $params = http_build_query([
            'client_id' => config('services.onemate.client_id'),
            'redirect_uri' => config('services.onemate.redirect_uri'),
            'response_type' => 'code',
            'scope' => 'profile:read',
            'state' => $state,
            'code_challenge' => $challenge,
            'code_challenge_method' => 'S256',
        ], '', '&', PHP_QUERY_RFC3986);

        return redirect()->away(
            rtrim(config('services.onemate.url'), '/') . '/oauth/authorize?' . $params,
        );
    }

    public function callback(Request $request): RedirectResponse
    {
        $oauth = $request->session()->pull('onemate_oauth');

        if (
            !is_array($oauth) ||
            !is_string($oauth['state'] ?? null) ||
            !is_string($oauth['verifier'] ?? null) ||
            !is_string($request->query('state')) ||
            !hash_equals($oauth['state'], $request->query('state'))
        ) {
            return $this->frontendRedirect('invalid_state');
        }

        if ($request->query('error') === 'access_denied') {
            return $this->frontendRedirect('access_denied');
        }

        if (!$request->filled('code')) {
            return $this->frontendRedirect('invalid_response');
        }

        $url = rtrim(config('services.onemate.url'), '/');

        try {
            $response = Http::asForm()
                ->timeout(10)
                ->post($url . '/oauth/token', [
                    'grant_type' => 'authorization_code',
                    'client_id' => config('services.onemate.client_id'),
                    'redirect_uri' => config('services.onemate.redirect_uri'),
                    'code' => $request->query('code'),
                    'code_verifier' => $oauth['verifier'],
                ]);

            if (!$response->successful() || !$response->json('access_token')) {
                Log::warning('OneMate OAuth token exchange failed', [
                    'status' => $response->status(),
                ]);

                return $this->frontendRedirect('token_error');
            }

            $profile = Http::withToken($response->json('access_token'))
                ->acceptJson()
                ->timeout(10)
                ->get($url . '/api/oauth/user');

            if (!$profile->successful()) {
                Log::warning('OneMate OAuth profile request failed', [
                    'status' => $profile->status(),
                ]);

                return $this->frontendRedirect('profile_error');
            }
        } catch (ConnectionException $exception) {
            Log::warning('OneMate OAuth connection failed', [
                'message' => $exception->getMessage(),
            ]);

            return $this->frontendRedirect('connection_error');
        }

        try {
            $service = app(OneMateUserService::class);

            $user = $service->resolve($profile->json());

            Auth::guard('web')->login($user);

            $request->session()->regenerate();

            return $this->frontendRedirect();
        } catch (RuntimeException $exception) {
            if ($exception->getMessage() === 'EMAIL_ALREADY_EXISTS') {
                $request->session()->put('onemate_account_link', [
                    'profile' => [
                        'id' => $profile->json('id'),
                        'email' => $profile->json('email'),
                        'email_verified' => $profile->json('email_verified'),
                    ],
                    'expires_at' => now()->addMinutes(10)->timestamp,
                ]);

                return redirect()->away(
                    rtrim(config('app.frontend_url'), '/') . '/account-link',
                );
            }

            return $this->frontendRedirect($exception->getMessage());
        }
    }

    public function confirmLink(Request $request, OneMateUserService $service): JsonResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $pending = $request->session()->get('onemate_account_link');

        if (
            !is_array($pending) ||
            !is_array($pending['profile'] ?? null) ||
            !is_numeric($pending['expires_at'] ?? null) ||
            now()->timestamp >= $pending['expires_at']
        ) {
            $request->session()->forget('onemate_account_link');

            return response()->json([
                'message' => 'Время подтверждения истекло. Повторите вход через OneMate',
                'code' => 'LINK_EXPIRED',
            ], 422);
        }

        $profile = $pending['profile'];

        $email = mb_strtolower(trim($profile['email']));

        $user = User::query()
            ->where('email', $email)
            ->first();

        if (!$user || !$user->password || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Неверный пароль ToolBox',
                'code' => 'INVALID_PASSWORD',
            ], 422);
        }

        try {
            $service->link($user, $profile);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => 'Не удалось связать аккаунты',
                'code' => $exception->getMessage(),
            ], 409);
        }

        $request->session()->forget('onemate_account_link');

        Auth::guard('web')->login($user);

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Аккаунты успешно связаны',
        ]);
    }

    private function frontendRedirect(?string $error = null): RedirectResponse
    {
        $url = rtrim(config('app.frontend_url'), '/');

        return redirect()->away(
            $url . ($error !== null
                ? '/login?oauth=' . urlencode($error)
                : '/'),
        );
    }
}
