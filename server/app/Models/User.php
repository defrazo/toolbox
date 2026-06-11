<?php

namespace App\Models;

use App\Notifications\PasswordChangedNotification;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailNotification;
use App\Notifications\VerifyPendingEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    protected $fillable = ['username', 'email', 'pending_email', 'password', 'avatar', 'is_demo'];

    protected $hidden = ['password', 'remember_token'];

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function sendPasswordChangedNotification(): void
    {
        $this->notify(new PasswordChangedNotification);
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyEmailNotification);
    }

    public function sendPendingEmailVerificationNotification(): void
    {
        if (!$this->pending_email) {
            return;
        }

        Notification::route('mail', $this->pending_email)
            ->notify(new VerifyPendingEmailNotification(
                $this->id,
                $this->pending_email,
            ));
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
