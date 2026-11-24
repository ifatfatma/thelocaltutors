import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function PlatformFeedback({ feedbacks, stats = { total: 0, pending: 0, approved: 0 }, currentStatus = 'all' }) {
    const list = feedbacks?.data || feedbacks || [];

    const handleAccept = (id) => {
        router.get(`/admin/platform-feedback/accept/${id}`);
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this platform feedback?')) return;
        router.delete(`/admin/platform-feedback/${id}`);
    };

    return (
        <AdminLayout title="Platform Feedback &amp; Suggestions">
            <Head title="Platform Feedback Moderation" />

            {/* Filter Tabs */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-wrap gap-2">
                        <Link
                            href="/admin/platform-feedback"
                            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                                currentStatus === 'all' ? 'btn-primary' : 'btn-light border'
                            }`}
                        >
                            All Feedback ({stats.total || 0})
                        </Link>
                        <Link
                            href="/admin/platform-feedback?status=pending"
                            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                                currentStatus === 'pending' ? 'btn-warning text-dark' : 'btn-light border'
                            }`}
                        >
                            <i className="bi bi-clock-history me-1"></i>Pending Approval ({stats.pending || 0})
                        </Link>
                        <Link
                            href="/admin/platform-feedback?status=approved"
                            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                                currentStatus === 'approved' ? 'btn-success' : 'btn-light border'
                            }`}
                        >
                            <i className="bi bi-check2-circle me-1"></i>Approved ({stats.approved || 0})
                        </Link>
                    </div>

                    <div className="small text-muted">
                        <i className="bi bi-shield-check me-1 text-primary"></i>
                        General website &amp; platform experience feedback submitted by students, parents, and tutors.
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="card-header bg-white py-3 px-4 d-flex align-items-center justify-content-between border-bottom">
                    <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                        <i className="bi bi-chat-heart-fill text-danger"></i>Platform Feedback Queue
                    </h5>
                    <span className="badge bg-light text-secondary border">
                        Showing {list.length} records
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small text-uppercase text-secondary">
                            <tr>
                                <th style={{ width: '50px' }} className="ps-4">#</th>
                                <th>Sender</th>
                                <th>Role</th>
                                <th>Category</th>
                                <th>Rating</th>
                                <th>Feedback Message</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className="text-end pe-4" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-5 text-muted">
                                        <div className="p-3 bg-light rounded-circle d-inline-flex mb-2">
                                            <i className="bi bi-chat-dots fs-3 text-secondary"></i>
                                        </div>
                                        <div>No platform feedback records found in this view.</div>
                                    </td>
                                </tr>
                            ) : (
                                list.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td className="ps-4 text-muted small">{idx + 1}</td>
                                        <td>
                                            <div className="fw-bold text-dark">{item.name || item.user?.name || 'Anonymous'}</div>
                                            <div className="text-muted small" style={{ fontSize: '11px' }}>
                                                {item.email || item.user?.email || item.phone || '--'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-secondary border rounded-pill px-2 py-1 small">
                                                {item.role || 'Visitor'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small">
                                                {item.category || 'Platform Experience'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-warning fw-bold">
                                                {'★'.repeat(item.rating || 5)}
                                            </span>
                                            <span className="small text-muted ms-1">({item.rating || 5}.0)</span>
                                        </td>
                                        <td className="small text-secondary" style={{ maxWidth: '300px' }}>
                                            "{item.feedback}"
                                        </td>
                                        <td>
                                            {item.is_active === 1 ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
                                                    <i className="bi bi-check-circle-fill me-1"></i>Approved
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2 py-1">
                                                    <i className="bi bi-hourglass-split me-1"></i>Pending Approval
                                                </span>
                                            )}
                                        </td>
                                        <td className="small text-muted">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="d-flex justify-content-end gap-1">
                                                {item.is_active !== 1 && (
                                                    <button
                                                        onClick={() => handleAccept(item.id)}
                                                        className="btn btn-sm btn-success rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1 shadow-2xs"
                                                        title="Approve feedback"
                                                    >
                                                        <i className="bi bi-check-lg"></i>
                                                        <span>Approve</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    title="Delete feedback"
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

            {feedbacks?.links && <Pagination links={feedbacks.links} />}
        </AdminLayout>
    );
}
