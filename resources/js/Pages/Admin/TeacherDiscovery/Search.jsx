import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';
import { STATES_LIST, getCitiesForState } from '../../../Utils/indiaLocations';
import axios from 'axios';

const TEACHER_TYPES = [
    'Home Tutor',
    'Online Tutor',
    'Coaching Teacher',
    'School Teacher',
    'College Professor',
    'Competitive Exam Mentor (JEE/NEET/UPSC)',
];

export default function Search({
    stats = {},
    settings = {},
    providersStatus = {},
    activeSearch = null,
    results = null,
    subjects = [],
    filters = {},
}) {
    const list = results?.data || [];

    // Search Form State
    const [form, setForm] = useState({
        country: activeSearch?.country || 'India',
        state: activeSearch?.state || 'West Bengal',
        city: activeSearch?.city || 'Kolkata',
        locality: activeSearch?.locality || '',
        subject: activeSearch?.subject || '',
        teacher_type: activeSearch?.teacher_type || '',
        experience_filter: activeSearch?.experience_filter || '',
        teaching_mode: activeSearch?.teaching_mode || 'Both',
        max_records: activeSearch?.max_records || settings?.max_results_default || 25,
    });
    const [searching, setSearching] = useState(false);

    // Selection & Modals
    const [selectedIds, setSelectedIds] = useState([]);
    const [viewRecord, setViewRecord] = useState(null);
    const [editRecord, setEditRecord] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [savingEdit, setSavingEdit] = useState(false);

    // Live Progress Polling when queued/processing
    const [liveStatus, setLiveStatus] = useState(activeSearch);
    useEffect(() => {
        setLiveStatus(activeSearch);
    }, [activeSearch]);

    useEffect(() => {
        if (!liveStatus || !['queued', 'processing'].includes(liveStatus.status)) return;
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/admin/teacher-discovery/searches/${liveStatus.id}/status`);
                setLiveStatus((prev) => ({ ...prev, ...res.data }));
                if (['completed', 'failed'].includes(res.data.status)) {
                    clearInterval(interval);
                    router.reload({ preserveScroll: true });
                }
            } catch (_) {}
        }, 2500);
        return () => clearInterval(interval);
    }, [liveStatus?.id, liveStatus?.status]);

    const citiesForState = getCitiesForState(form.state);
    const currentProviderConfigured = Boolean(providersStatus[settings?.search_provider || 'google_cse']);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearching(true);
        router.post('/admin/teacher-discovery/search', form, {
            onFinish: () => setSearching(false),
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        const selectable = list.filter((r) => r.import_status === 'pending').map((r) => r.id);
        if (selectedIds.length === selectable.length && selectable.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(selectable);
        }
    };

    const handleImportSelected = () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Import ${selectedIds.length} selected teacher(s) with Pending Verification status?`)) return;
        router.post('/admin/teacher-discovery/import-selected', { result_ids: selectedIds }, {
            preserveScroll: true,
            onSuccess: () => setSelectedIds([]),
        });
    };

    const handleImportAllNonDuplicates = () => {
        if (!activeSearch?.id) return;
        if (!confirm('Import all unique (non-duplicate) pending teachers from this search?')) return;
        router.post(`/admin/teacher-discovery/searches/${activeSearch.id}/import-non-duplicates`, {}, {
            preserveScroll: true,
            onSuccess: () => setSelectedIds([]),
        });
    };

    const handleReject = (id) => {
        router.post(`/admin/teacher-discovery/results/${id}/reject`, {}, { preserveScroll: true });
    };

    const openEditModal = (rec) => {
        setEditRecord(rec);
        setEditForm({
            teacher_name: rec.teacher_name || '',
            email: rec.email || '',
            phone: rec.phone || '',
            whatsapp: rec.whatsapp || '',
            gender: rec.gender || '',
            state: rec.state || '',
            city: rec.city || '',
            locality: rec.locality || '',
            full_address: rec.full_address || '',
            qualification: rec.qualification || '',
            experience: rec.experience || '',
            teaching_mode: rec.teaching_mode || '',
            hourly_fees: rec.hourly_fees || '',
            institute_name: rec.institute_name || '',
            subjects: Array.isArray(rec.subjects) ? rec.subjects.join(', ') : (rec.subjects || ''),
            biography: rec.biography || '',
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editRecord) return;
        setSavingEdit(true);
        router.post(`/admin/teacher-discovery/results/${editRecord.id}/update`, editForm, {
            preserveScroll: true,
            onSuccess: () => setEditRecord(null),
            onFinish: () => setSavingEdit(false),
        });
    };

    return (
        <AdminLayout title="Teacher Discovery — Search & Preview">
            <Head title="Teacher Discovery - Admin" />

            {/* Sub-Navigation Pills */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div className="d-flex flex-wrap gap-2">
                    <Link href="/admin/teacher-discovery" className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold">
                        <i className="bi bi-search me-1"></i>Search Teachers
                    </Link>
                    <Link href="/admin/teacher-discovery/history" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                        <i className="bi bi-clock-history me-1"></i>Discovery History
                    </Link>
                    <Link href="/admin/teacher-discovery/imported" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                        <i className="bi bi-person-check me-1"></i>Imported Teachers
                    </Link>
                    <Link href="/admin/teacher-discovery/settings" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                        <i className="bi bi-sliders me-1"></i>Import Settings
                    </Link>
                </div>

                {activeSearch?.id && (
                    <div className="d-flex gap-2">
                        <a
                            href={`/admin/teacher-discovery/export?format=csv&search_id=${activeSearch.id}`}
                            className="btn btn-sm btn-outline-success rounded-pill px-3"
                        >
                            <i className="bi bi-filetype-csv me-1"></i>Export CSV
                        </a>
                        <a
                            href={`/admin/teacher-discovery/export?format=xlsx&search_id=${activeSearch.id}`}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                            <i className="bi bi-file-earmark-excel me-1"></i>Export Excel
                        </a>
                    </div>
                )}
            </div>

            {/* KPI Stats Row */}
            <div className="row g-2 mb-4">
                {[
                    { label: 'Total Searches', val: stats.total_searches || 0, color: 'primary' },
                    { label: 'Discovered', val: stats.total_discovered || 0, color: 'info' },
                    { label: 'Imported', val: stats.total_imported || 0, color: 'success' },
                    { label: 'Duplicates', val: stats.total_duplicates || 0, color: 'warning' },
                    { label: 'Pending Verify', val: stats.pending_verification || 0, color: 'secondary' },
                    { label: 'Rejected', val: stats.rejected_records || 0, color: 'danger' },
                ].map((k, i) => (
                    <div key={i} className="col-6 col-md-4 col-lg-2">
                        <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
                            <div className="small text-muted">{k.label}</div>
                            <div className={`fs-4 fw-bold text-${k.color}`}>{k.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Provider Config Notice */}
            {!currentProviderConfigured && (
                <div className="alert alert-warning rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                    <div className="small">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong>Search API Key Not Configured:</strong> Active provider <code>{settings?.search_provider}</code> requires API credentials in your server <code>.env</code> file before live searches can run.
                    </div>
                    <Link href="/admin/teacher-discovery/settings" className="btn btn-sm btn-dark rounded-pill px-3">
                        Configure Provider
                    </Link>
                </div>
            )}

            {/* Search Form Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-globe-central-south-asia text-primary me-2"></i>
                    Discover Publicly Listed Teachers &amp; Tutors
                </h5>
                <form onSubmit={handleSearchSubmit}>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Country *</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">State *</label>
                            <select
                                className="form-select form-select-sm"
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value, city: '' })}
                                required
                            >
                                <option value="">Select State</option>
                                {STATES_LIST.map((st) => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">City *</label>
                            <input
                                type="text"
                                list="discoveryCityList"
                                className="form-control form-control-sm"
                                placeholder="e.g. Kolkata"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                required
                            />
                            <datalist id="discoveryCityList">
                                {citiesForState.map((ct) => (
                                    <option key={ct} value={ct} />
                                ))}
                            </datalist>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Locality / Area (Optional)</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="e.g. Garden Reach, Behala, Salt Lake"
                                value={form.locality}
                                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Subject (Optional)</label>
                            <input
                                type="text"
                                list="discoverySubjectList"
                                className="form-control form-control-sm"
                                placeholder="e.g. Mathematics, Physics, English"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            />
                            <datalist id="discoverySubjectList">
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.name} />
                                ))}
                            </datalist>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Teacher Type</label>
                            <select
                                className="form-select form-select-sm"
                                value={form.teacher_type}
                                onChange={(e) => setForm({ ...form, teacher_type: e.target.value })}
                            >
                                <option value="">Any Category</option>
                                {TEACHER_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label small fw-semibold">Experience (Optional)</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="e.g. 5+ Years"
                                value={form.experience_filter}
                                onChange={(e) => setForm({ ...form, experience_filter: e.target.value })}
                            />
                        </div>

                        <div className="col-md-2">
                            <label className="form-label small fw-semibold">Teaching Mode</label>
                            <select
                                className="form-select form-select-sm"
                                value={form.teaching_mode}
                                onChange={(e) => setForm({ ...form, teaching_mode: e.target.value })}
                            >
                                <option value="Both">Both</option>
                                <option value="Offline">Offline</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label className="form-label small fw-semibold">Max Records</label>
                            <select
                                className="form-select form-select-sm"
                                value={form.max_records}
                                onChange={(e) => setForm({ ...form, max_records: Number(e.target.value) })}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <span className="small text-muted">
                            <i className="bi bi-shield-check text-success me-1"></i>
                            Only publicly accessible sources are queried. Respects <code>robots.txt</code>. Records are previewed before import.
                        </span>
                        <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold" disabled={searching}>
                            {searching ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Searching Public Sources...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-search me-2"></i>Search Teachers
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Active Search Progress / Error Banner */}
            {liveStatus && (
                <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                        <div>
                            <span className="fw-bold text-dark me-2">
                                Search #{liveStatus.id}: {[liveStatus.subject, liveStatus.locality, liveStatus.city, liveStatus.state].filter(Boolean).join(' • ')}
                            </span>
                            <span
                                className={`badge rounded-pill ${
                                    liveStatus.status === 'completed'
                                        ? 'bg-success'
                                        : liveStatus.status === 'failed'
                                        ? 'bg-danger'
                                        : 'bg-warning text-dark'
                                }`}
                            >
                                {liveStatus.status}
                            </span>
                        </div>
                        <div className="small text-muted">
                            Found: <strong>{liveStatus.total_found}</strong> &bull; Duplicates: <strong>{liveStatus.total_duplicates}</strong> &bull; Imported: <strong>{liveStatus.total_imported}</strong>
                        </div>
                    </div>

                    {['queued', 'processing'].includes(liveStatus.status) && (
                        <div className="progress" style={{ height: '10px' }}>
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                style={{ width: `${Math.max(10, liveStatus.progress_percent || 10)}%` }}
                            />
                        </div>
                    )}

                    {liveStatus.status === 'failed' && liveStatus.error_message && (
                        <div className="alert alert-danger py-2 px-3 small mb-0 mt-2">
                            <i className="bi bi-exclamation-circle-fill me-1"></i>
                            {liveStatus.error_message}
                        </div>
                    )}
                </div>
            )}

            {/* Preview DataTable */}
            {activeSearch && (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2 bg-white">
                        <div className="fw-bold text-dark">
                            Discovered Teachers Preview ({results?.total ?? list.length})
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleImportSelected}
                                disabled={selectedIds.length === 0}
                                className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold"
                            >
                                <i className="bi bi-download me-1"></i>Import Selected ({selectedIds.length})
                            </button>
                            <button
                                type="button"
                                onClick={handleImportAllNonDuplicates}
                                className="btn btn-sm btn-success rounded-pill px-3 fw-semibold"
                            >
                                <i className="bi bi-check2-all me-1"></i>Import All Non-Duplicates
                            </button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 small">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '36px' }}>
                                        <input type="checkbox" className="form-check-input" onChange={toggleSelectAll} checked={selectedIds.length > 0 && selectedIds.length === list.filter((r) => r.import_status === 'pending').length} />
                                    </th>
                                    <th>Teacher</th>
                                    <th>Location</th>
                                    <th>Subjects &amp; Qual.</th>
                                    <th>Exp.</th>
                                    <th>Contact</th>
                                    <th>Source</th>
                                    <th>Duplicate</th>
                                    <th>Import Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-5 text-muted">
                                            No discovered records to display for this search.
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((rec) => (
                                        <tr key={rec.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    disabled={rec.import_status !== 'pending'}
                                                    checked={selectedIds.includes(rec.id)}
                                                    onChange={() => toggleSelect(rec.id)}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {rec.profile_image ? (
                                                        <img src={rec.profile_image} alt={rec.teacher_name} className="rounded-circle border" style={{ width: '34px', height: '34px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }}>
                                                            <i className="bi bi-person"></i>
                                                        </div>
                                                    )}
                                                    <div className="fw-semibold text-dark">{rec.teacher_name}</div>
                                                </div>
                                            </td>
                                            <td>{[rec.locality, rec.city, rec.state].filter(Boolean).join(', ') || '-'}</td>
                                            <td>
                                                <div>{Array.isArray(rec.subjects) ? rec.subjects.join(', ') : (rec.subjects || '-')}</div>
                                                {rec.qualification && <div className="text-muted">{rec.qualification}</div>}
                                            </td>
                                            <td>{rec.experience || '-'}</td>
                                            <td>
                                                {rec.email && <div><i className="bi bi-envelope me-1 text-primary"></i>{rec.email}</div>}
                                                {rec.phone && <div><i className="bi bi-telephone me-1 text-success"></i>{rec.phone}</div>}
                                                {!rec.email && !rec.phone && <span className="text-muted">Not published</span>}
                                            </td>
                                            <td>
                                                {rec.source_url ? (
                                                    <a href={rec.source_url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                        {rec.source_name || 'Source'} <i className="bi bi-box-arrow-up-right"></i>
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill ${
                                                        rec.duplicate_status === 'unique'
                                                            ? 'bg-success-subtle text-success'
                                                            : rec.duplicate_status === 'possible_duplicate'
                                                            ? 'bg-warning-subtle text-dark'
                                                            : 'bg-danger-subtle text-danger'
                                                    }`}
                                                    title={rec.duplicate_match_reason || ''}
                                                >
                                                    {rec.duplicate_status}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill ${
                                                        rec.import_status === 'imported'
                                                            ? 'bg-success'
                                                            : rec.import_status === 'rejected'
                                                            ? 'bg-danger'
                                                            : 'bg-secondary'
                                                    }`}
                                                >
                                                    {rec.import_status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-inline-flex gap-1">
                                                    <button type="button" onClick={() => setViewRecord(rec)} className="btn btn-sm btn-outline-info py-0 px-2" title="View Details">
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                    {rec.import_status === 'pending' && (
                                                        <>
                                                            <button type="button" onClick={() => openEditModal(rec)} className="btn btn-sm btn-outline-primary py-0 px-2" title="Edit Before Import">
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button type="button" onClick={() => handleReject(rec.id)} className="btn btn-sm btn-outline-danger py-0 px-2" title="Reject">
                                                                <i className="bi bi-x-lg"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {results?.links && <div className="p-3 border-top"><Pagination links={results.links} /></div>}
                </div>
            )}

            {/* VIEW DETAILS MODAL */}
            {viewRecord && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1060 }} onClick={() => setViewRecord(null)}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">{viewRecord.teacher_name}</h5>
                                <button type="button" className="btn-close" onClick={() => setViewRecord(null)}></button>
                            </div>
                            <div className="modal-body small">
                                <div className="row g-2">
                                    <div className="col-md-6"><strong>Email:</strong> {viewRecord.email || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Phone:</strong> {viewRecord.phone || 'NULL'}</div>
                                    <div className="col-md-6"><strong>WhatsApp:</strong> {viewRecord.whatsapp || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Gender:</strong> {viewRecord.gender || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Location:</strong> {[viewRecord.locality, viewRecord.city, viewRecord.state, viewRecord.country].filter(Boolean).join(', ')}</div>
                                    <div className="col-md-6"><strong>Qualification:</strong> {viewRecord.qualification || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Experience:</strong> {viewRecord.experience || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Mode:</strong> {viewRecord.teaching_mode || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Fees:</strong> {viewRecord.hourly_fees || 'NULL'}</div>
                                    <div className="col-md-6"><strong>Institute:</strong> {viewRecord.institute_name || 'NULL'}</div>
                                    <div className="col-12"><strong>Subjects:</strong> {Array.isArray(viewRecord.subjects) ? viewRecord.subjects.join(', ') : 'NULL'}</div>
                                    <div className="col-12"><strong>Biography:</strong><p className="mt-1 text-secondary mb-0">{viewRecord.biography || 'NULL'}</p></div>
                                    <div className="col-12">
                                        <strong>Source URL:</strong>{' '}
                                        {viewRecord.source_url ? <a href={viewRecord.source_url} target="_blank" rel="noopener noreferrer">{viewRecord.source_url}</a> : 'NULL'}
                                    </div>
                                    {viewRecord.duplicate_match_reason && (
                                        <div className="col-12 alert alert-warning py-2 mb-0">{viewRecord.duplicate_match_reason}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT BEFORE IMPORT MODAL */}
            {editRecord && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 1060 }} onClick={() => setEditRecord(null)}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <form onSubmit={handleSaveEdit}>
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">Edit Discovered Record Before Import</h5>
                                    <button type="button" className="btn-close" onClick={() => setEditRecord(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-2">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Full Name *</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.teacher_name} onChange={(e) => setEditForm({ ...editForm, teacher_name: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Email</label>
                                            <input type="email" className="form-control form-control-sm" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">Phone</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">WhatsApp</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.whatsapp} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">Experience</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.experience} onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">State</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">City</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label small fw-semibold">Locality</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.locality} onChange={(e) => setEditForm({ ...editForm, locality: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Subjects (comma-separated)</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.subjects} onChange={(e) => setEditForm({ ...editForm, subjects: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-semibold">Qualification</label>
                                            <input type="text" className="form-control form-control-sm" value={editForm.qualification} onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold">Biography</label>
                                            <textarea rows="3" className="form-control form-control-sm" value={editForm.biography} onChange={(e) => setEditForm({ ...editForm, biography: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditRecord(null)}>Cancel</button>
                                    <button type="submit" className="btn btn-sm btn-primary" disabled={savingEdit}>{savingEdit ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
