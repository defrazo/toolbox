<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('links:cleanup-expired')
    ->hourly()
    ->name('links.cleanup-expired');
