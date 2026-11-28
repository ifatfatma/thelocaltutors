import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Settings({ settings = {}, providersStatus = {} }) {
    const [form, setForm] = useState({
        search_provider: settings.search_provider || 'google_cse',
        max_results_default: settings.max_results_default || 25,
        timeout_seconds: settings.timeout_seconds || 15,
        max_retries: settings.max_retries ?? 2,
        rate_limit_per_minute: settings.rate_limit_per_minute || 20,
        respect_robots_txt: settings.respect_robots_txt ?? true,
        match_by_email: settings.match_by_email ?? true,
        match_by_phone: settings.match_by_phone ?? true,
        match_by_name_city_subject: settings.match_by_name_city_subject ?? true,
        match_by_source_url: settings.match_by_source_url ?? true,
        import_mode: settings.import_mode || 'manual',
        default_account_status: settings.default_account_status || 'pending_verification',
        use_queue_above: settings.use_queue_above || 25,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post('/admin/teacher-discovery/settings', form, {
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AdminLayout title="Teacher Discovery — Import Settings">
            <Head title="Discovery Import Settings - Admin" />

            <div className="d-flex flex-wrap gap-2 mb-3">
                <Link href="/admin/teacher-discovery" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                    <i className="bi bi-search me-1"></i>Search Teachers
                </Link>
                <Link href="/admin/teacher-discovery/history" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                    <i className="bi bi-clock-history me-1"></i>Discovery History
                </Link>
                <Link href="/admin/teacher-discovery/imported" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                    <i className="bi bi-person-check me-1"></i>Imported Teachers
                </Link>
                <Link href="/admin/teacher-discovery/settings" className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold">
                    <i className="bi bi-sliders me-1"></i>Import Settings
                </Link>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <form onSubmit={handleSubmit}>
                            <h5 className="fw-bold border-bottom pb-2 mb-3">Search API &amp; Performance Settings</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Search API Provider</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.search_provider}
                                        onChange={(e) => setForm({ ...form, search_provider: e.target.value })}
                                    >
                                        <option value="google_cse">Google Custom Search JSON API</option>
                                        <option value="bing">Microsoft Bing Web Search API v7</option>
                                        <option value="serper">Serper Google Search API</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">Default Max Results</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.max_results_default}
                                        onChange={(e) => setForm({ ...form, max_results_default: Number(e.target.value) })}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-semibold">API Timeout (sec)</label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="60"
                                        className="form-control form-control-sm"
                                        value={form.timeout_seconds}
                                        onChange={(e) => setForm({ ...form, timeout_seconds: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-semibold">API Retries</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="4"
                                        className="form-control form-control-sm"
                                        value={form.max_retries}
                                        onChange={(e) => setForm({ ...form, max_retries: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-semibold">Rate Limit (req / min)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="120"
                                        className="form-control form-control-sm"
                                        value={form.rate_limit_per_minute}
                                        onChange={(e) => setForm({ ...form, rate_limit_per_minute: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-semibold">Queue Async Above</label>
                                    <input
                                        type="number"
                                        min="10"
                                        max="100"
                                        className="form-control form-control-sm"
                                        value={form.use_queue_above}
                                        onChange={(e) => setForm({ ...form, use_queue_above: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <h5 className="fw-bold border-bottom pb-2 mb-3">Duplicate Matching &amp; Compliance</h5>
                            <div className="row g-2 mb-4">
                                {[
                                    { key: 'respect_robots_txt', label: 'Strictly respect robots.txt restrictions before fetching public pages' },
                                    { key: 'match_by_email', label: 'Match duplicates by normalized Email Address' },
                                    { key: 'match_by_phone', label: 'Match duplicates by normalized 10-digit Mobile Number' },
                                    { key: 'match_by_name_city_subject', label: 'Match possible duplicates by Teacher Name + City' },
                                    { key: 'match_by_source_url', label: 'Match duplicates by Source Profile URL' },
                                ].map((item) => (
                                    <div key={item.key} className="col-12">
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={item.key}
                                                checked={Boolean(form[item.key])}
                                                onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                                            />
                                            <label className="form-check-label small" htmlFor={item.key}>{item.label}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h5 className="fw-bold border-bottom pb-2 mb-3">Import &amp; Account Defaults</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Import Mode (Recommended: Manual)</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.import_mode}
                                        onChange={(e) => setForm({ ...form, import_mode: e.target.value })}
                                    >
                                        <option value="manual">Manual Preview &amp; Import (Default)</option>
                                        <option value="auto">Auto-Import Unique Records</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Default Teacher Account Status</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={form.default_account_status}
                                        onChange={(e) => setForm({ ...form, default_account_status: e.target.value })}
                                    >
                                        <option value="pending_verification">Pending Verification (Inactive until verified)</option>
                                        <option value="verified">Verified (Active immediately)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold" disabled={saving}>
                                {saving ? 'Saving Settings...' : 'Save Import Settings'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* API Credential Status Panel (Never exposes actual keys) */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-2">
                            <i className="bi bi-key-fill text-warning me-2"></i>.env API Credential Status
                        </h5>
                        <p className="small text-muted mb-3">
                            For security, API keys are read strictly from server <code>.env</code> variables and are never exposed to the browser.
                        </p>

                        <ul className="list-group list-group-flush small mb-3">
                            <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                <span>Google Custom Search</span>
                                <span className={`badge rounded-pill ${providersStatus.google_cse ? 'bg-success' : 'bg-secondary'}`}>
                                    {providersStatus.google_cse ? 'Configured' : 'Not Set'}
                                </span>
                            </li>
                            <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                <span>Bing Web Search v7</span>
                                <span className={`badge rounded-pill ${providersStatus.bing ? 'bg-success' : 'bg-secondary'}`}>
                                    {providersStatus.bing ? 'Configured' : 'Not Set'}
                                </span>
                            </li>
                            <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                <span>Serper Google Search</span>
                                <span className={`badge rounded-pill ${providersStatus.serper ? 'bg-success' : 'bg-secondary'}`}>
                                    {providersStatus.serper ? 'Configured' : 'Not Set'}
                                </span>
                            </li>
                        </ul>

                        <div className="p-3 bg-light rounded-3 border small">
                            <div className="fw-semibold mb-1">Required .env keys:</div>
                            <code className="d-block">GOOGLE_CSE_API_KEY=...</code>
                            <code className="d-block">GOOGLE_CSE_CX=...</code>
                            <code className="d-block mt-1">BING_SEARCH_API_KEY=...</code>
                            <code className="d-block mt-1">SERPER_API_KEY=...</code>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
