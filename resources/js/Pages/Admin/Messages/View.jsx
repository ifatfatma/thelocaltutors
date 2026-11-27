import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function View({ messagesdetails, approvedDemos = [], shares = [] }) {
    const [selectedDemoId, setSelectedDemoId] = useState(approvedDemos[0]?.id || '');
    const [copiedToken, setCopiedToken] = useState(null);

    const handleShareDemo = (e) => {
        e.preventDefault();
        if (!selectedDemoId) {
            alert('Please select an approved demo video.');
            return;
        }

        if (!messagesdetails) return;

        router.post('/admin/demo-shares/create', {
            teacher_demo_id: selectedDemoId,
            student_name: messagesdetails?.name || '',
            student_phone: messagesdetails?.phone || '',
            student_email: messagesdetails?.email || '',
            contact_id: messagesdetails?.id,
        });
    };

    const handleCopy = (token) => {
        const fullUrl = `${window.location.origin}/demo-view/${token}`;
        navigator.clipboard?.writeText(fullUrl)?.catch(() => {});
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 3000);
    };

    return (
        <AdminLayout title="Inquiry & Demo Details">
            <Head title={`Inquiry from ${messagesdetails?.name}`} />

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <div>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 small fw-semibold mb-2 d-inline-block">
                            Student Inquiry / Demo Request
                        </span>
                        <h4 className="fw-bold mb-0 text-dark">Inquiry from {messagesdetails?.name}</h4>
                    </div>
                    <Link href="/admin/messages" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                        &larr; Back to Inbox
                    </Link>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <label className="text-muted small">Student / Sender Name</label>
                        <h6 className="fw-bold text-dark">{messagesdetails?.name}</h6>
                    </div>
                    <div className="col-md-4">
                        <label className="text-muted small">Phone / WhatsApp</label>
                        <h6 className="fw-bold text-dark">
                            <i className="bi bi-whatsapp text-success me-1"></i>
                            {messagesdetails?.phone || '--'}
                        </h6>
                    </div>
                    <div className="col-md-4">
                        <label className="text-muted small">Email Address</label>
                        <h6 className="fw-bold text-dark">
                            <a href={`mailto:${messagesdetails?.email}`} className="text-decoration-none">
                                {messagesdetails?.email}
                            </a>
                        </h6>
                    </div>
                    <div className="col-12 mt-3">
                        <label className="text-muted small">Inquiry Details / Course Requirements</label>
                        <div className="p-3 bg-light rounded-3 text-dark fs-6 lh-base border" style={{ whiteSpace: 'pre-line' }}>
                            {messagesdetails?.message}
                        </div>
                    </div>
                </div>

                {/* Share Demo Video Box */}
                <div className="card border-0 bg-light-subtle rounded-4 p-4 border mt-2">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="p-2 bg-primary text-white rounded-3 d-inline-flex">
                            <i className="bi bi-camera-video-fill"></i>
                        </span>
                        <div>
                            <h5 className="fw-bold text-dark mb-0">Share Recorded Demo Session</h5>
                            <span className="text-muted small">
                                Select an approved teacher demo video to attach and send to this student via WhatsApp or private link.
                            </span>
                        </div>
                    </div>

                    {approvedDemos.length === 0 ? (
                        <div className="p-3 bg-white rounded-3 border text-secondary small">
                            <i className="bi bi-info-circle me-1 text-primary"></i>
                            No approved demo sessions available yet.{' '}
                            <Link href="/admin/teacher-demos" className="text-primary fw-semibold">
                                Review &amp; approve submitted teacher demos
                            </Link>{' '}
                            first.
                        </div>
                    ) : (
                        <form onSubmit={handleShareDemo} className="row g-3 align-items-end">
                            <div className="col-md-8">
                                <label className="form-label small fw-semibold text-secondary">
                                    Select Approved Demo Session
                                </label>
                                <select
                                    className="form-select"
                                    value={selectedDemoId}
                                    onChange={(e) => setSelectedDemoId(e.target.value)}
                                    required
                                >
                                    {approvedDemos.map((demo) => (
                                        <option key={demo.id} value={demo.id}>
                                            {demo.title} — {demo.subject} ({demo.class_level || 'General'}) by {demo.user?.name || 'Educator'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4 fw-semibold w-100 d-inline-flex align-items-center justify-content-center gap-2"
                                >
                                    <i className="bi bi-share-fill"></i>
                                    <span>Attach &amp; Generate Link</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Previously Shared Demos for this Inquiry */}
                    {shares.length > 0 && (
                        <div className="mt-4 pt-3 border-top">
                            <h6 className="fw-bold text-dark mb-3">Demos Shared with this Student:</h6>
                            <div className="d-flex flex-column gap-3">
                                {shares.map((share) => {
                                    const fullUrl = typeof window !== 'undefined'
                                        ? `${window.location.origin}/demo-view/${share.token}`
                                        : `/demo-view/${share.token}`;

                                    const cleanPhone = (messagesdetails?.phone || '').replace(/\D+/g, '');
                                    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                                    const waText = encodeURIComponent(
                                        `Hello ${messagesdetails?.name || 'Student'}, greetings from The Local Tutors!\n\nAs requested, here is your exclusive recorded demo class for ${share.teacher_demo?.subject} (${share.teacher_demo?.class_level}) by ${share.teacher_demo?.user?.name}:\n\n▶ Watch Demo Class: ${fullUrl}\n\nPlease watch and let us know your preferred regular class schedule!`
                                    );
                                    const waLink = `https://wa.me/${waPhone}?text=${waText}`;

                                    return (
                                        <div key={share.id} className="p-3 bg-white rounded-3 border">
                                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                                                <div>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 small fw-semibold me-2">
                                                        {share.status === 'booking_requested'
                                                            ? 'Booking Requested!'
                                                            : share.status === 'watched'
                                                            ? 'Student Watched Video'
                                                            : 'Demo Shared'}
                                                    </span>
                                                    <strong className="text-dark">{share.teacher_demo?.title}</strong>
                                                </div>
                                                <span className="text-muted small">
                                                    Shared on {new Date(share.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="input-group input-group-sm mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control bg-light"
                                                    value={fullUrl}
                                                    readOnly
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(share.token)}
                                                    className={`btn ${copiedToken === share.token ? 'btn-success' : 'btn-outline-secondary'}`}
                                                >
                                                    <i className={`bi ${copiedToken === share.token ? 'bi-check-lg' : 'bi-clipboard'} me-1`}></i>
                                                    {copiedToken === share.token ? 'Copied' : 'Copy Link'}
                                                </button>
                                                <a
                                                    href={waLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-success"
                                                >
                                                    <i className="bi bi-whatsapp me-1"></i>Share via WhatsApp
                                                </a>
                                                <a
                                                    href={`/demo-view/${share.token}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary"
                                                >
                                                    <i className="bi bi-box-arrow-up-right me-1"></i>Open
                                                </a>
                                            </div>

                                            {share.preferred_schedule && (
                                                <div className="p-2 bg-warning-subtle rounded-2 small text-dark mt-2 border border-warning-subtle">
                                                    <strong className="text-warning-emphasis">Student Schedule Request:</strong> {share.preferred_schedule}
                                                    {share.student_notes && (
                                                        <div className="fst-italic text-secondary">"{share.student_notes}"</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="d-flex gap-2 mt-4 pt-2">
                    <a
                        href={`https://wa.me/${(messagesdetails?.phone || '').replace(/\D+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm rounded-pill px-3"
                    >
                        <i className="bi bi-whatsapp me-1"></i>Message on WhatsApp
                    </a>
                    <a
                        href={`mailto:${messagesdetails?.email}?subject=The Local Tutors - Follow up on your query`}
                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    >
                        <i className="bi bi-reply me-1"></i>Reply via Email
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
}
