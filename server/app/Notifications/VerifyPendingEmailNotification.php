<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class VerifyPendingEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 30;

    public function __construct(
        private readonly int $userId,
        private readonly string $pendingEmail,
    ) {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Подтвердите новый e-mail в ToolBox')
            ->view('emails.verify-new-email', ['url' => $this->verificationUrl()]);
    }

    protected function verificationUrl(): string
    {
        $signedBackendUrl = URL::temporarySignedRoute(
            'pending-email.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $this->userId,
                'hash' => sha1($this->pendingEmail),
                'type' => 'pending',
            ],
            absolute: false,
        );

        $query = parse_url($signedBackendUrl, PHP_URL_QUERY);

        return sprintf(
            '%s/email/verify/%s/%s?%s',
            rtrim(config('app.frontend_url'), '/'),
            $this->userId,
            sha1($this->pendingEmail),
            $query,
        );
    }
}
