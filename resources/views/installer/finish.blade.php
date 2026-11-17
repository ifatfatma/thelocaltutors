@extends('installer.layout', ['step' => 4])

@section('title', 'Installation Complete')

@section('content')
    <div class="text-center py-4">
        <div class="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow mb-4" style="width: 80px; height: 80px;">
            <i class="bi bi-check-lg display-5"></i>
        </div>

        <h3 class="fw-bold text-dark mb-2">Congratulations!</h3>
        <p class="lead text-muted mb-4">
            The Local Tutors platform has been installed and configured successfully.
        </p>

        <div class="card border-0 bg-light rounded-4 p-4 text-start mx-auto mb-4" style="max-width: 520px;">
            <h6 class="fw-bold text-dark mb-3 border-bottom pb-2">
                <i class="bi bi-person-badge-fill text-primary me-2"></i>Administrator Access Summary
            </h6>

            <div class="row g-2 small">
                <div class="col-sm-5 text-muted">Admin Email:</div>
                <div class="col-sm-7 fw-semibold text-dark">{{ session('admin_email', 'admin@thelocaltutors.com') }}</div>

                <div class="col-sm-5 text-muted">Admin Username:</div>
                <div class="col-sm-7 fw-semibold text-dark">{{ session('admin_username', 'admin') }}</div>

                <div class="col-sm-5 text-muted">Installation Lock:</div>
                <div class="col-sm-7 fw-semibold text-success">
                    <i class="bi bi-lock-fill me-1"></i>storage/installed created
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center gap-3 flex-wrap">
            <a href="{{ url('/') }}" class="btn btn-outline-primary px-4 py-2 fw-semibold">
                <i class="bi bi-house me-1"></i> Visit Website
            </a>
            <a href="{{ route('front.login') }}" class="btn btn-primary px-4 py-2 fw-semibold">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login to Admin Panel
            </a>
        </div>
    </div>
@endsection
