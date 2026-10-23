<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('links:cleanup-expired')
    ->dailyAt('03:00')
    ->name('links.cleanup-expired');
