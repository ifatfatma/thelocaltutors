<?php

namespace App\Jobs;

use App\Models\TeacherDiscoverySearch;
use App\Services\TeacherDiscovery\TeacherDiscoveryService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessTeacherDiscoveryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 180;

    public function __construct(public int $searchId)
    {
    }

    public function handle(TeacherDiscoveryService $discoveryService): void
    {
        $search = TeacherDiscoverySearch::find($this->searchId);
        if (!$search) {
            return;
        }

        $discoveryService->executeSearch($search);
    }
}
