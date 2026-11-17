<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Web Installer') - The Local Tutors</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #0d6efd 0%, #003399 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 30px 15px;
        }
        .installer-card {
            background: #ffffff;
            border-radius: 1.25rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 780px;
            overflow: hidden;
        }
        .installer-header {
            background: #ffffff;
            border-bottom: 1px solid #edf2f7;
            padding: 2rem 2.5rem 1.5rem;
            text-align: center;
        }
        .installer-steps {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1.25rem;
            padding: 0;
            list-style: none;
        }
        .step-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: #6c757d;
        }
        .step-item.active {
            color: #0d6efd;
        }
        .step-item.completed {
            color: #198754;
        }
        .step-badge {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e9ecef;
            color: #495057;
            font-size: 0.8rem;
        }
        .step-item.active .step-badge {
            background: #0d6efd;
            color: #ffffff;
        }
        .step-item.completed .step-badge {
            background: #198754;
            color: #ffffff;
        }
        .installer-body {
            padding: 2.5rem;
        }
        .table-checks td {
            vertical-align: middle;
            padding: 0.75rem 1rem;
        }
    </style>
</head>
<body>

<div class="installer-card">
    <div class="installer-header">
        <h3 class="fw-bold text-dark mb-1 d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-mortarboard-fill text-primary"></i>
            <span>The Local Tutors</span>
        </h3>
        <p class="text-muted small mb-0">Web Installation &amp; Configuration Wizard</p>

        @php
            $currentStep = $step ?? 1;
        @endphp
        <ul class="installer-steps">
            <li class="step-item {{ $currentStep == 1 ? 'active' : ($currentStep > 1 ? 'completed' : '') }}">
                <span class="step-badge">{!! $currentStep > 1 ? '<i class="bi bi-check-lg"></i>' : '1' !!}</span>
                <span>Requirements</span>
            </li>
            <li class="step-item {{ $currentStep == 2 ? 'active' : ($currentStep > 2 ? 'completed' : '') }}">
                <span class="step-badge">{!! $currentStep > 2 ? '<i class="bi bi-check-lg"></i>' : '2' !!}</span>
                <span>Database</span>
            </li>
            <li class="step-item {{ $currentStep == 3 ? 'active' : ($currentStep > 3 ? 'completed' : '') }}">
                <span class="step-badge">{!! $currentStep > 3 ? '<i class="bi bi-check-lg"></i>' : '3' !!}</span>
                <span>Admin Setup</span>
            </li>
            <li class="step-item {{ $currentStep == 4 ? 'active' : ($currentStep > 4 ? 'completed' : '') }}">
                <span class="step-badge">{!! $currentStep >= 4 ? '<i class="bi bi-check-lg"></i>' : '4' !!}</span>
                <span>Ready</span>
            </li>
        </ul>
    </div>

    <div class="installer-body">
        @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>{{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @yield('content')
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
@yield('scripts')
</body>
</html>
