import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

const TYPE_TABS = [
    { key: 'all', label: 'All Institutions', icon: 'bi-grid' },
    { key: 'coaching_institute', label: 'Coaching Institutes', icon: 'bi-building' },
    { key: 'school', label: 'Schools', icon: 'bi-backpack4' },
    { key: 'college', label: 'Colleges', icon: 'bi-mortarboard' },
    { key: 'university', label: 'Universities', icon: 'bi-bank' },
];

export default function Index({ institutions, counts = {}, filters = {} }) {
    const list = institutions?.data || [];
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (nextType, nextStatus, nextSearch = search) => {
        const params = {};
        if (nextType && nextType !== 'all') params.type = nextType;
        if (nextStatus && nextStatus !== 'all') params.status = nextStatus;
        if (nextSearch && nextSearch.trim()) params.search = nextSearch.trim();
        router.get('/admin/institutions', params, { preserveState: true });
    };

    const handleQuickStatus = (id, payload) => {
        router.post(`/admin/institutions/${id}/status`, payload, { preserveScroll: true });
    };

    const handleDelete = (id, name) => {
        if (!confirm(`Delete institution "${name}"?`)) return;
        router.delete(`/admin/institutions/${id}`, { preserveScroll: true });
    };

    const activeType = filters.type || 'all';
    const activeStatus = filters.status || 'all';

    return (
        <AdminLayout title="Manage Institutions">
            <Head title="Manage Institutions - Admin" />

            {/* Top Action Bar */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div className="d-flex flex-wrap gap-2">
                    {TYPE_TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => applyFilter(t.key, activeStatus)}
                            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                                activeType === t.key ? 'btn-primary text-white' : 'btn-white bg-white border text-secondary'
                            }`}
                        >
                            <i className={`bi ${t.icon} me-1`}></i>
                            {t.label} <span className="badge bg-light text-dark ms-1">{counts[t.key] || 0}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => applyFilter(activeType, activeStatus === 'pending' ? 'all' : 'pending')}
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                            activeStatus === 'pending' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'
                        }`}
                    >
                        <i className="bi bi-hourglass-split me-1"></i>
                        Pending Queue <span className="badge bg-dark text-white ms-1">{counts.pending || 0}</span>
                    </button>
                </div>

                <Link
                    href={`/admin/institutions/create${activeType !== 'all' ? `?type=${activeType}` : ''}`}
                    className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold"
                >
                    <i className="bi bi-plus-lg me-1"></i>Add Institution
                </Link>
            </div>

            {/* Search & Status Filter */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilter(activeType, activeStatus, search);
                    }}
                    className="row g-2 align-items-center"
                >
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search by institution name, city, state, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select form-select-sm"
                            value={activeStatus}
                            onChange={(e) => applyFilter(activeType, e.target.value, search)}
                        >
                            <option value="all">All Verification Statuses</option>
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button type="submit" className="btn btn-primary btn-sm px-3">Search</button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                                setSearch('');
                                applyFilter('all', 'all', '');
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Institution</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Owner</th>
                                <th>Stats</th>
                                <th>Approval &amp; Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        No institutions found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                list.map((inst) => (
                                    <tr key={inst.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                {inst.logo ? (
                                                    <img src={inst.logo} alt={inst.name} className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                ) : (
                                                    <div className="rounded bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                        <i className="bi bi-building"></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="fw-bold text-dark">
                                                        {inst.name}{' '}
                                                        {inst.verified_badge && <i className="bi bi-patch-check-fill text-primary" title="Verified"></i>}
                                                    </div>
                                                    <div className="small text-muted">{inst.email || inst.phone || 'No contact'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                                                {inst.type_label}
                                            </span>
                                        </td>
                                        <td className="small">
                                            {[inst.city, inst.state].filter(Boolean).join(', ') || <span className="text-muted">Not set</span>}
                                        </td>
                                        <td className="small">
                                            {inst.user ? (
                                                <span>{inst.user.name}</span>
                                            ) : (
                                                <span className="badge bg-light text-secondary border">Admin-Created</span>
                                            )}
                                        </td>
                                        <td className="small text-muted">
                                            <div>{inst.programs_count || 0} programs</div>
                                            <div>{inst.inquiries_count || 0} inquiries</div>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column gap-1">
                                                <span
                                                    className={`badge rounded-pill align-self-start ${
                                                        inst.verification_status === 'approved'
                                                            ? 'bg-success'
                                                            : inst.verification_status === 'rejected'
                                                            ? 'bg-danger'
                                                            : 'bg-warning text-dark'
                                                    }`}
                                                >
                                                    {inst.verification_status}
                                                </span>
                                                <div className="d-flex gap-1">
                                                    {inst.verification_status !== 'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuickStatus(inst.id, { verification_status: 'approved', is_active: true })}
                                                            className="btn btn-success btn-sm py-0 px-2"
                                                            style={{ fontSize: '11px' }}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {inst.verification_status !== 'rejected' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuickStatus(inst.id, { verification_status: 'rejected' })}
                                                            className="btn btn-outline-danger btn-sm py-0 px-2"
                                                            style={{ fontSize: '11px' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuickStatus(inst.id, { is_active: !inst.is_active })}
                                                        className={`btn btn-sm py-0 px-2 ${inst.is_active ? 'btn-outline-secondary' : 'btn-secondary'}`}
                                                        style={{ fontSize: '11px' }}
                                                    >
                                                        {inst.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuickStatus(inst.id, { verified_badge: !inst.verified_badge })}
                                                        className={`btn btn-sm py-0 px-2 ${inst.verified_badge ? 'btn-info text-white' : 'btn-outline-info'}`}
                                                        style={{ fontSize: '11px' }}
                                                        title="Toggle Verified Badge"
                                                    >
                                                        <i className="bi bi-patch-check"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-1">
                                                {inst.verification_status === 'approved' && inst.is_active && (
                                                    <a
                                                        href={`/institutions/${inst.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-info"
                                                        title="View Public Page"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </a>
                                                )}
                                                <Link href={`/admin/institutions/${inst.id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit">
                                                    <i className="bi bi-pencil"></i>
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(inst.id, inst.name)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {institutions?.links && <div className="mt-3"><Pagination links={institutions.links} /></div>}
        </AdminLayout>
    );
}
