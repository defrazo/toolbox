<?php

namespace App\Providers;

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Support\ServiceProvider;
use Resend\Client;
use Resend\Contracts\Client as ClientContract;
use Resend\Transporters\HttpTransporter;
use Resend\ValueObjects\ApiKey;
use Resend\ValueObjects\Transporter\BaseUri;
use Resend\ValueObjects\Transporter\Headers;

class ResendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ClientContract::class, function (): Client {
            $apiKey = ApiKey::from(config('services.resend.key'));
            $baseUri = BaseUri::from('api.resend.com');
            $headers = Headers::withAuthorization($apiKey);

            $httpClient = new GuzzleClient([
                'timeout' => 15,
                'connect_timeout' => 5,
                'headers' => ['Connection' => 'close'],
            ]);

            return new Client(new HttpTransporter($httpClient, $baseUri, $headers));
        });

        $this->app->alias(ClientContract::class, 'resend');
        $this->app->alias(ClientContract::class, Client::class);
    }
}
