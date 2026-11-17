@extends('installer.layout', ['step' => 2])

@section('title', 'Database Configuration')

@section('content')
    <h5 class="fw-bold text-dark mb-2">
        <i class="bi bi-database-check text-primary me-2"></i>Database Connection
    </h5>
    <p class="text-muted small mb-4">
        Enter your MySQL database connection credentials below. If the database does not exist, the installer will attempt to automatically create it for you.
    </p>

    <div id="testAlert" class="d-none alert mb-4" role="alert"></div>

    <form method="POST" action="{{ route('install.database.save') }}" id="dbForm">
        @csrf
        <div class="row g-3 mb-4">
            <div class="col-md-8">
                <label class="form-label fw-semibold">Database Host *</label>
                <input type="text" name="host" id="db_host" class="form-control" value="{{ old('host', $defaultHost) }}" required>
                <div class="form-text">Usually <code>127.0.0.1</code> or <code>localhost</code></div>
            </div>

            <div class="col-md-4">
                <label class="form-label fw-semibold">Port *</label>
                <input type="number" name="port" id="db_port" class="form-control" value="{{ old('port', $defaultPort) }}" required>
                <div class="form-text">Default: <code>3306</code></div>
            </div>

            <div class="col-12">
                <label class="form-label fw-semibold">Database Name *</label>
                <input type="text" name="database" id="db_name" class="form-control" value="{{ old('database', $defaultDatabase) }}" required>
                <div class="form-text">The database to store application tables.</div>
            </div>

            <div class="col-md-6">
                <label class="form-label fw-semibold">Username *</label>
                <input type="text" name="username" id="db_user" class="form-control" value="{{ old('username', $defaultUsername) }}" required>
            </div>

            <div class="col-md-6">
                <label class="form-label fw-semibold">Password</label>
                <input type="password" name="password" id="db_pass" class="form-control" value="{{ old('password', $defaultPassword) }}" placeholder="Leave blank if no password">
            </div>
        </div>

        <div class="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-2">
            <a href="{{ route('install.index') }}" class="btn btn-outline-secondary px-3">
                <i class="bi bi-arrow-left me-1"></i> Back
            </a>

            <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-primary px-3 fw-semibold" id="btnTest">
                    <span id="testSpinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
                    <i class="bi bi-lightning-charge me-1" id="testIcon"></i> Test Connection
                </button>

                <button type="submit" class="btn btn-primary px-4 fw-semibold" id="btnNext">
                    Continue to Admin Setup <i class="bi bi-arrow-right ms-1"></i>
                </button>
            </div>
        </div>
    </form>
@endsection

@section('scripts')
<script>
    document.getElementById('btnTest').addEventListener('click', async function() {
        const btn = this;
        const spinner = document.getElementById('testSpinner');
        const icon = document.getElementById('testIcon');
        const alertBox = document.getElementById('testAlert');

        btn.disabled = true;
        spinner.classList.remove('d-none');
        icon.classList.add('d-none');
        alertBox.className = 'alert d-none';

        const data = {
            host: document.getElementById('db_host').value,
            port: document.getElementById('db_port').value,
            database: document.getElementById('db_name').value,
            username: document.getElementById('db_user').value,
            password: document.getElementById('db_pass').value,
            _token: '{{ csrf_token() }}'
        };

        try {
            const res = await fetch('{{ route('install.database.test') }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            alertBox.classList.remove('d-none');

            if (res.ok && result.status === 200) {
                alertBox.className = 'alert alert-success d-flex align-items-center';
                alertBox.innerHTML = '<i class="bi bi-check-circle-fill me-2 fs-5"></i><div>' + result.message + '</div>';
            } else {
                alertBox.className = 'alert alert-danger d-flex align-items-center';
                alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i><div>' + (result.message || 'Connection failed.') + '</div>';
            }
        } catch (err) {
            alertBox.className = 'alert alert-danger d-flex align-items-center';
            alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i><div>Error connecting to server. Please verify parameters.</div>';
        } finally {
            btn.disabled = false;
            spinner.classList.add('d-none');
            icon.classList.remove('d-none');
        }
    });
</script>
@endsection
