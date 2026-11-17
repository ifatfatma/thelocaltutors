@extends('installer.layout', ['step' => 1])

@section('title', 'Server Requirements')

@section('content')
    <h5 class="fw-bold text-dark mb-3">
        <i class="bi bi-shield-check text-primary me-2"></i>System Requirements &amp; Permissions
    </h5>
    <p class="text-muted small mb-4">
        Ensure your server environment fulfills the requirements below to run The Local Tutors platform smoothly.
    </p>

    <!-- PHP Version -->
    <div class="card border-0 bg-light rounded-3 p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <strong class="d-block text-dark">PHP Version</strong>
                <span class="text-muted small">Required: &ge; {{ $phpVersion['minimum'] }} | Current: {{ $phpVersion['current'] }}</span>
            </div>
            <div>
                @if($phpVersion['supported'])
                    <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                        <i class="bi bi-check-circle-fill me-1"></i>Passed
                    </span>
                @else
                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
                        <i class="bi bi-x-circle-fill me-1"></i>Upgrade Required
                    </span>
                @endif
            </div>
        </div>
    </div>

    <!-- PHP Extensions -->
    <h6 class="fw-bold text-dark mb-2">Required PHP Extensions</h6>
    <div class="table-responsive mb-4">
        <table class="table table-bordered table-checks align-middle mb-0">
            <tbody>
                @foreach(array_chunk($extensions, 2) as $row)
                    <tr>
                        @foreach($row as $ext)
                            <td class="w-50">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-dark">{{ $ext['name'] }} <small class="text-muted">({{ $ext['extension'] }})</small></span>
                                    @if($ext['status'])
                                        <i class="bi bi-check-circle-fill text-success fs-5"></i>
                                    @else
                                        <i class="bi bi-x-circle-fill text-danger fs-5" title="Extension missing"></i>
                                    @endif
                                </div>
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Directory Permissions -->
    <h6 class="fw-bold text-dark mb-2">Directory Permissions</h6>
    <div class="table-responsive mb-4">
        <table class="table table-bordered table-checks align-middle mb-0">
            <tbody>
                @foreach($directories as $dir)
                    <tr>
                        <td>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="fw-semibold text-dark">{{ $dir['name'] }}</span>
                                    <small class="d-block text-muted">{{ $dir['path'] }}</small>
                                </div>
                                <div>
                                    @if($dir['status'])
                                        <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                            <i class="bi bi-check-circle-fill me-1"></i>Writable
                                        </span>
                                    @else
                                        <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                                            <i class="bi bi-x-circle-fill me-1"></i>Not Writable
                                        </span>
                                    @endif
                                </div>
                            </div>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
        <span class="text-muted small">
            @if($canProceed)
                <i class="bi bi-check2-circle text-success me-1"></i>All requirements satisfied.
            @else
                <i class="bi bi-exclamation-octagon text-danger me-1"></i>Please fix missing requirements before proceeding.
            @endif
        </span>
        <a href="{{ route('install.database') }}" class="btn btn-primary px-4 py-2 fw-semibold {{ $canProceed ? '' : 'disabled' }}">
            Continue to Database <i class="bi bi-arrow-right ms-1"></i>
        </a>
    </div>
@endsection
