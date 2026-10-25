<?php

return [
    'resend' => ['key' => env('RESEND_API_KEY')],

    'onemate' => [
        'url' => env('ONEMATE_URL'),
        'client_id' => env('ONEMATE_CLIENT_ID'),
        'redirect_uri' => env('ONEMATE_REDIRECT_URI'),
        'internal_token' => env('ONEMATE_INTERNAL_TOKEN'),
    ],
];
