@extends('installer.layout', ['step' => 3])

@section('title', 'Application & Administrator Setup')

@section('content')
    <h5 class="fw-bold text-dark mb-2">
        <i class="bi bi-person-gear text-primary me-2"></i>Application &amp; Administrator Setup
    </h5>
    <p class="text-muted small mb-4">
        Configure your platform details and create your initial Super Admin administrator credentials.
    </p>

    <form method="POST" action="{{ route('install.process') }}" id="installForm">
        @csrf

        <div class="card border-0 bg-light rounded-3 p-3 mb-4">
            <h6 class="fw-bold text-dark mb-3">
                <i class="bi bi-globe2 text-secondary me-2"></i>Platform Information
            </h6>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Application Name *</label>
                    <input type="text" name="app_name" class="form-control" value="{{ old('app_name', $defaultAppName) }}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-semibold">Application URL *</label>
                    <input type="url" name="app_url" class="form-control" value="{{ old('app_url', $defaultAppUrl) }}" required>
                </div>
            </div>
        </div>

        <div class="card border-0 bg-light rounded-3 p-3 mb-4">
            <h6 class="fw-bold text-dark mb-3">
                <i class="bi bi-shield-lock-fill text-secondary me-2"></i>Super Administrator Account
            </h6>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Full Name *</label>
                    <input type="text" name="admin_name" class="form-control" value="{{ old('admin_name', 'Super Admin') }}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-semibold">Email Address *</label>
                    <input type="email" name="admin_email" class="form-control" value="{{ old('admin_email', 'admin@thelocaltutors.com') }}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-semibold">Username *</label>
                    <input type="text" name="admin_username" class="form-control" value="{{ old('admin_username', 'admin') }}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-semibold">Mobile Number *</label>
                    <input type="text" name="admin_mobile" class="form-control" value="{{ old('admin_mobile', '7003578764') }}" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-semibold">Password *</label>
                    <input type="password" name="admin_password" class="form-control" placeholder="Minimum 6 characters" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-semibold">Confirm Password *</label>
                    <input type="password" name="admin_password_confirmation" class="form-control" placeholder="Re-enter password" required>
                </div>
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-2">
            <a href="{{ route('install.database') }}" class="btn btn-outline-secondary px-3">
                <i class="bi bi-arrow-left me-1"></i> Back to Database
            </a>

            <button type="submit" class="btn btn-success px-4 py-2 fw-semibold" id="btnSubmit">
                <span id="submitSpinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
                <i class="bi bi-check2-circle me-1" id="submitIcon"></i> Install &amp; Launch System
            </button>
        </div>
    </form>
@endsection

@section('scripts')
<script>
    document.getElementById('installForm').addEventListener('submit', function() {
        const btn = document.getElementById('btnSubmit');
        const spinner = document.getElementById('submitSpinner');
        const icon = document.getElementById('submitIcon');

        btn.disabled = true;
        spinner.classList.remove('d-none');
        icon.classList.add('d-none');
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Migrating &amp; Installing Platform (Please wait)...';
    });
</script>
@endsection
