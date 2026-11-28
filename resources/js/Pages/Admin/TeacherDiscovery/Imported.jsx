import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Imported({ stats = {}, imported, filters = {} }) {
    const list = imported?.data || [];
    const [f, setF] = useState({
        state: filters.state || '',
        city: filters.city || '',
        subject: filters.subject || '',
        verification_status: filters.verification_status || 'all',
        date: filters.date || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/teacher-discovery/imported', f, { preserveState: true });
    };

    const handleVerifyChange = (id, verification_status) => {
        router.post(`/admin/teacher-discovery/results/${id}/verify`, { verification_status }, { preserveScroll: true });
    };

    const exportQuery = new URLSearchParams({ import_status: 'imported', ...f }).toString();

    return (
        <AdminLayout title="Teacher Discovery — Imported Teachers">
            <Head title="Imported Teachers - Admin" />

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div className="d-flex flex-wrap gap-2">
                    <Link href="/admin/teacher-discovery" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                        <i className="bi bi-search me-1"></i>Search Teachers
                    </Link>
                    <Link href="/admin/teacher-discovery/history" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                        <i className="bi bi-clock-history me-1"></i>Discovery History
                    </Link>
                    <Link href="/admin/teacher-discovery/imported" className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold">
                        <i className="bi bi-person-check me-1"></i>Imported Teachers
                    </Link>
                    <Link href="/admin/teacher-discovery/settings" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                        <i className="bi bi-sliders me-1"></i>Import Settings
                    </Link>
                </div>

                <div className="d-flex gap-2">
                    <a href={`/admin/teacher-discovery/export?format=csv&${exportQuery}`} className="btn btn-sm btn-outline-success rounded-pill px-3">
                        <i className="bi bi-filetype-csv me-1"></i>Export CSV
                    </a>
                    <a href={`/admin/teacher-discovery/export?format=xlsx&${exportQuery}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        <i className="bi bi-file-earmark-excel me-1"></i>Export Excel
                    </a>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                <form onSubmit={handleFilter} className="row g-2 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label small fw-semibold">State</label>
                        <input type="text" className="form-control form-control-sm" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-semibold">City</label>
                        <input type="text" className="form-control form-control-sm" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-semibold">Subject</label>
                        <input type="text" className="form-control form-control-sm" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-semibold">Verification</label>
                        <select className="form-select form-select-sm" value={f.verification_status} onChange={(e) => setF({ ...f, verification_status: e.target.value })}>
                            <option value="all">All</option>
                            <option value="pending_verification">Pending Verification</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-semibold">Date</label>
                        <input type="date" className="form-control form-control-sm" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
                    </div>
                    <div className="col-md-2 d-flex gap-1">
                        <button type="submit" className="btn btn-primary btn-sm flex-fill">Filter</button>
                        <button type="button" onClick={() => router.get('/admin/teacher-discovery/imported')} className="btn btn-outline-secondary btn-sm">Reset</button>
                    </div>
                </form>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                        <thead className="table-light">
                            <tr>
                                <th>Teacher</th>
                                <th>Location</th>
                                <th>Subjects &amp; Qual.</th>
                                <th>Contact</th>
                                <th>Source</th>
                                <th>Verification Status</th>
                                <th className="text-end">Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">No teachers imported yet.</td>
                                </tr>
                            ) : (
                                list.map((rec) => (
                                    <tr key={rec.id}>
                                        <td className="fw-bold text-dark">{rec.teacher_name}</td>
                                        <td>{[rec.locality, rec.city, rec.state].filter(Boolean).join(', ') || '-'}</td>
                                        <td>
                                            <div>{Array.isArray(rec.subjects) ? rec.subjects.join(', ') : '-'}</div>
                                            <div className="text-muted">{rec.qualification || ''}</div>
                                        </td>
                                        <td>
                                            {rec.email && <div>{rec.email}</div>}
                                            {rec.phone && <div>{rec.phone}</div>}
                                        </td>
                                        <td>
                                            {rec.source_url ? (
                                                <a href={rec.source_url} target="_blank" rel="noopener noreferrer">
                                                    {rec.source_name || 'Source'} <i className="bi bi-box-arrow-up-right"></i>
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={rec.verification_status}
                                                onChange={(e) => handleVerifyChange(rec.id, e.target.value)}
                                                style={{ width: '175px' }}
                                            >
                                                <option value="pending_verification">Pending Verification</option>
                                                <option value="verified">Verified (Active)</option>
                                                <option value="rejected">Rejected (Inactive)</option>
                                            </select>
                                        </td>
                                        <td className="text-end">
                                            {rec.imported_user_id && (
                                                <Link href={`/admin/teacher/updatemore/${rec.imported_user_id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                    Manage Teacher
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {imported?.links && <div className="p-3 border-top"><Pagination links={imported.links} /></div>}
            </div>
        </AdminLayout>
    );
}
