import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function History({ stats = {}, searches, filters = {} }) {
    const list = searches?.data || [];
    const [f, setF] = useState({
        state: filters.state || '',
        city: filters.city || '',
        subject: filters.subject || '',
        status: filters.status || 'all',
        date: filters.date || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get('/admin/teacher-discovery/history', f, { preserveState: true });
    };

    return (
        <AdminLayout title="Teacher Discovery — History">
            <Head title="Discovery History - Admin" />

            <div className="d-flex flex-wrap gap-2 mb-3">
                <Link href="/admin/teacher-discovery" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                    <i className="bi bi-search me-1"></i>Search Teachers
                </Link>
                <Link href="/admin/teacher-discovery/history" className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold">
                    <i className="bi bi-clock-history me-1"></i>Discovery History
                </Link>
                <Link href="/admin/teacher-discovery/imported" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                    <i className="bi bi-person-check me-1"></i>Imported Teachers
                </Link>
                <Link href="/admin/teacher-discovery/settings" className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary">
                    <i className="bi bi-sliders me-1"></i>Import Settings
                </Link>
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
                        <label className="form-label small fw-semibold">Date</label>
                        <input type="date" className="form-control form-control-sm" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small fw-semibold">Status</label>
                        <select className="form-select form-select-sm" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
                            <option value="all">All</option>
                            <option value="completed">Completed</option>
                            <option value="processing">Processing</option>
                            <option value="queued">Queued</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div className="col-md-2 d-flex gap-1">
                        <button type="submit" className="btn btn-primary btn-sm flex-fill">Filter</button>
                        <button type="button" onClick={() => router.get('/admin/teacher-discovery/history')} className="btn btn-outline-secondary btn-sm">Reset</button>
                    </div>
                </form>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Location</th>
                                <th>Subject &amp; Type</th>
                                <th>Provider</th>
                                <th>Found / Dup / Imported</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-5 text-muted">No discovery searches recorded yet.</td>
                                </tr>
                            ) : (
                                list.map((s) => (
                                    <tr key={s.id}>
                                        <td className="fw-bold">#{s.id}</td>
                                        <td>{[s.locality, s.city, s.state, s.country].filter(Boolean).join(', ')}</td>
                                        <td>
                                            <div>{s.subject || 'All Subjects'}</div>
                                            {s.teacher_type && <div className="text-muted">{s.teacher_type}</div>}
                                        </td>
                                        <td><code>{s.search_provider}</code></td>
                                        <td>
                                            <span className="badge bg-info-subtle text-info-emphasis me-1">{s.total_found} found</span>
                                            <span className="badge bg-warning-subtle text-dark me-1">{s.total_duplicates} dup</span>
                                            <span className="badge bg-success-subtle text-success">{s.total_imported} imported</span>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${s.status === 'completed' ? 'bg-success' : s.status === 'failed' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="text-muted">{new Date(s.created_at).toLocaleString()}</td>
                                        <td className="text-end">
                                            <Link href={`/admin/teacher-discovery/searches/${s.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                View Results
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {searches?.links && <div className="p-3 border-top"><Pagination links={searches.links} /></div>}
            </div>
        </AdminLayout>
    );
}
