import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ demos, counts = {}, currentStatus = 'all' }) {
    const list = demos?.data || demos || [];

    const [selectedDemo, setSelectedDemo] = useState(null);
    const [actionModal, setActionModal] = useState(null); // 'status' | 'share' | null
    const [statusToSet, setStatusToSet] = useState('approved');
    const [adminFeedback, setAdminFeedback] = useState('');

    // Share modal state
    const [studentName, setStudentName] = useState('');
    const [studentPhone, setStudentPhone] = useState('');
    const [studentEmail, setStudentEmail] = useState('');

    const handleOpenStatusModal = (demo, status) => {
        setSelectedDemo(demo);
        setStatusToSet(status);
        setAdminFeedback(demo.admin_feedback || '');
        setActionModal('status');
    };

    const handleSaveStatus = (e) => {
        e.preventDefault();
        if (!selectedDemo) return;

        router.post(`/admin/teacher-demos/${selectedDemo.id}/status`, {
            status: statusToSet,
            admin_feedback: adminFeedback,
        }, {
            onSuccess: () => {
                setActionModal(null);
                setSelectedDemo(null);
            },
        });
    };

    const handleOpenShareModal = (demo) => {
        setSelectedDemo(demo);
        setStudentName('');
        setStudentPhone('');
        setStudentEmail('');
        setActionModal('share');
    };

    const handleShareSubmit = (e) => {
        e.preventDefault();
        if (!selectedDemo) return;

        router.post('/admin/demo-shares/create', {
            teacher_demo_id: selectedDemo.id,
            student_name: studentName,
            student_phone: studentPhone,
            student_email: studentEmail,
        }, {
            onSuccess: () => {
                setActionModal(null);
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this demo submission?')) return;
        router.delete(`/admin/teacher-demos/${id}`);
    };

    return (
        <AdminLayout title="Teacher Demo Submissions">
            <Head title="Teacher Demos Review" />

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Recorded Teacher Demos</h4>
                    <p className="text-muted small mb-0">
                        Review, approve, and share video demo sessions submitted by verified teachers with student inquiries.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/admin/demo-shares" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        <i className="bi bi-share me-1"></i>View Shared Demos &amp; Bookings
                    </Link>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                <Link
                    href="/admin/teacher-demos"
                    className={`btn btn-sm rounded-pill px-3 ${
                        currentStatus === 'all' ? 'btn-primary' : 'btn-light border text-secondary'
                    }`}
                >
                    All Demos ({counts.all || 0})
                </Link>
                <Link
                    href="/admin/teacher-demos?status=pending"
                    className={`btn btn-sm rounded-pill px-3 ${
                        currentStatus === 'pending' ? 'btn-warning text-dark' : 'btn-light border text-secondary'
                    }`}
                >
                    Pending Review ({counts.pending || 0})
                </Link>
                <Link
                    href="/admin/teacher-demos?status=approved"
                    className={`btn btn-sm rounded-pill px-3 ${
                        currentStatus === 'approved' ? 'btn-success' : 'btn-light border text-secondary'
                    }`}
                >
                    Approved &amp; Ready ({counts.approved || 0})
                </Link>
                <Link
                    href="/admin/teacher-demos?status=rejected"
                    className={`btn btn-sm rounded-pill px-3 ${
                        currentStatus === 'rejected' ? 'btn-danger' : 'btn-light border text-secondary'
                    }`}
                >
                    Rejected ({counts.rejected || 0})
                </Link>
            </div>

            {/* Demos Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '40px' }}>#</th>
                                <th>Demo Session Details</th>
                                <th>Educator</th>
                                <th>Subject &amp; Level</th>
                                <th>Status</th>
                                <th>Submission Date</th>
                                <th className="text-end" style={{ minWidth: '220px' }}>Review &amp; Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="bi bi-camera-video fs-1 d-block mb-2 text-secondary"></i>
                                        No demo submissions found under this filter.
                                    </td>
                                </tr>
                            ) : (
                                list.map((demo, idx) => {
                                    const badgeClass =
                                        demo.status === 'approved'
                                            ? 'bg-success-subtle text-success border border-success-subtle'
                                            : demo.status === 'rejected'
                                            ? 'bg-danger-subtle text-danger border border-danger-subtle'
                                            : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';

                                    return (
                                        <tr key={demo.id}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{demo.title}</div>
                                                <div className="small text-muted text-truncate" style={{ maxWidth: '280px' }}>
                                                    <a
                                                        href={demo.video_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-decoration-none text-primary"
                                                    >
                                                        <i className="bi bi-box-arrow-up-right me-1 small"></i>
                                                        {demo.video_url}
                                                    </a>
                                                </div>
                                                {demo.notes && (
                                                    <div className="small text-secondary mt-1 fst-italic">
                                                        "{demo.notes}"
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-dark">{demo.user?.name || 'Educator'}</div>
                                                <div className="small text-muted">{demo.user?.mobile || demo.user?.email}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border me-1">
                                                    {demo.subject}
                                                </span>
                                                {demo.class_level && (
                                                    <span className="badge bg-light text-secondary border">
                                                        {demo.class_level}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-1 fw-semibold small ${badgeClass}`}>
                                                    {demo.status.toUpperCase()}
                                                </span>
                                                {demo.admin_feedback && (
                                                    <div className="small text-muted mt-1" style={{ fontSize: '11px' }}>
                                                        Note: {demo.admin_feedback}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="small text-muted">
                                                {new Date(demo.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1 flex-wrap">
                                                    {demo.status !== 'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenStatusModal(demo, 'approved')}
                                                            className="btn btn-sm btn-outline-success"
                                                            title="Approve Demo"
                                                        >
                                                            <i className="bi bi-check-lg me-1"></i>Approve
                                                        </button>
                                                    )}

                                                    {demo.status === 'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenShareModal(demo)}
                                                            className="btn btn-sm btn-primary"
                                                            title="Share with Student"
                                                        >
                                                            <i className="bi bi-share me-1"></i>Share Demo
                                                        </button>
                                                    )}

                                                    {demo.status !== 'rejected' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenStatusModal(demo, 'rejected')}
                                                            className="btn btn-sm btn-outline-warning text-dark"
                                                            title="Reject / Request Revision"
                                                        >
                                                            <i className="bi bi-x-circle me-1"></i>Reject
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(demo.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {demos?.links && <Pagination links={demos.links} />}

            {/* Status Modal (Approve / Reject) */}
            {actionModal === 'status' && selectedDemo && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <form onSubmit={handleSaveStatus}>
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold">
                                        {statusToSet === 'approved' ? 'Approve Demo Session' : 'Reject Demo Session'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setActionModal(null)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <p className="small text-secondary mb-3">
                                        Reviewing demo: <strong>{selectedDemo.title}</strong> by <strong>{selectedDemo.user?.name}</strong>.
                                    </p>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Admin Remarks / Feedback for Teacher (Optional)
                                        </label>
                                        <textarea
                                            rows="3"
                                            className="form-control"
                                            placeholder={
                                                statusToSet === 'approved'
                                                    ? 'e.g. Excellent explanation of fundamental concepts.'
                                                    : 'e.g. Please provide a video with clearer audio or landscape video orientation.'
                                            }
                                            value={adminFeedback}
                                            onChange={(e) => setAdminFeedback(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {selectedDemo.video_embed_url && (
                                        <div className="rounded-3 overflow-hidden bg-black ratio ratio-16x9 mb-3">
                                            <iframe
                                                src={selectedDemo.video_embed_url}
                                                title={selectedDemo.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer border-top">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setActionModal(null)}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn rounded-pill px-4 fw-semibold ${
                                            statusToSet === 'approved' ? 'btn-success' : 'btn-danger'
                                        }`}
                                    >
                                        Confirm {statusToSet === 'approved' ? 'Approval' : 'Rejection'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal: Attach demo to student inquiry */}
            {actionModal === 'share' && selectedDemo && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <form onSubmit={handleShareSubmit}>
                                <div className="modal-header border-bottom">
                                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                        <i className="bi bi-share text-primary"></i>
                                        <span>Share Demo with Student</span>
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setActionModal(null)}></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="p-3 bg-light rounded-3 mb-3 small">
                                        <div className="fw-bold text-dark">{selectedDemo.title}</div>
                                        <div className="text-secondary">
                                            Educator: <strong>{selectedDemo.user?.name}</strong> • Subject: <strong>{selectedDemo.subject}</strong>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Student / Parent Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Ramesh Ghosh"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Student Phone / WhatsApp Number <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="e.g. 9830012345"
                                            value={studentPhone}
                                            onChange={(e) => setStudentPhone(e.target.value)}
                                            required
                                        />
                                        <div className="form-text small text-muted">
                                            Used to generate the 1-click WhatsApp share button.
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Student Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="e.g. student@gmail.com"
                                            value={studentEmail}
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setActionModal(null)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
                                        Generate Share Link &amp; WhatsApp Action
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
