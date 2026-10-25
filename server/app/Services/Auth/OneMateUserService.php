<?php

namespace App\Services\Auth;

use App\Models\OAuthAccount;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class OneMateUserService
{
    public function resolve(array $profile): User
    {
        $this->validateProfile($profile);

        $providerId = $profile['id'];

        return DB::transaction(function () use ($profile, $providerId) {
            $account = OAuthAccount::query()
                ->where('provider', 'onemate')
                ->where('provider_user_id', $providerId)
                ->first();

            if ($account) {
                return $account->user;
            }

            $email = mb_strtolower(trim($profile['email']));

            if (User::where('email', $email)->exists()) {
                throw new RuntimeException('EMAIL_ALREADY_EXISTS');
            }

            $username = $this->generateUsername(
                is_string($profile['username'] ?? null)
                    ? $profile['username']
                    : 'user',
            );

            $user = User::create([
                'username' => $username,
                'email' => $email,
                'email_verified_at' => now(),
                'password' => null,
            ]);

            OAuthAccount::create([
                'user_id' => $user->id,
                'provider' => 'onemate',
                'provider_user_id' => $providerId,
            ]);

            return $user;
        });
    }

    public function link(User $user, array $profile): void
    {
        $this->validateProfile($profile);

        DB::transaction(function () use ($user, $profile) {
            $account = OAuthAccount::query()
                ->where('provider', 'onemate')
                ->where('provider_user_id', $profile['id'])
                ->first();

            if ($account) {
                if ($account->user_id === $user->id) {
                    return;
                }

                throw new RuntimeException('ONEMATE_ALREADY_LINKED');
            }

            $existing = OAuthAccount::query()
                ->where('user_id', $user->id)
                ->where('provider', 'onemate')
                ->first();

            if ($existing) {
                throw new RuntimeException('USER_ALREADY_LINKED');
            }

            OAuthAccount::create([
                'user_id' => $user->id,
                'provider' => 'onemate',
                'provider_user_id' => $profile['id'],
            ]);
        });
    }

    private function generateUsername(string $username): string
    {
        $base = Str::substr($username, 0, 24);

        if (!preg_match('/^[a-zA-Z0-9_-]{2,24}$/', $base)) {
            $base = 'user';
        }

        $candidate = $base;

        while (User::where('username', $candidate)->exists()) {
            $candidate = $base . '_' . Str::lower(Str::random(6));
        }

        return $candidate;
    }

    private function validateProfile(array $profile): void
    {
        if (
            !is_string($profile['id'] ?? null) ||
            !Str::isUuid($profile['id']) ||
            !is_string($profile['email'] ?? null) ||
            !filter_var($profile['email'], FILTER_VALIDATE_EMAIL) ||
            ($profile['email_verified'] ?? false) !== true
        ) {
            throw new RuntimeException('INVALID_ONEMATE_PROFILE');
        }
    }
}
