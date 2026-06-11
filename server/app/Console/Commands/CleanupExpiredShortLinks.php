<?php

namespace App\Console\Commands;

use App\Models\ShortLink;
use Illuminate\Console\Command;

class CleanupExpiredShortLinks extends Command
{
    protected $signature = 'links:cleanup-expired';

    protected $description = 'Delete expired unlocked short links';

    public function handle(): int
    {
        $deleted = ShortLink::expired()->delete();

        $this->info("Deleted expired links: {$deleted}");

        return self::SUCCESS;
    }
}
