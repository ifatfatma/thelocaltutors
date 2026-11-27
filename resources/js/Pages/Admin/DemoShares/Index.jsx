import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ shares, approvedDemos = [], currentStatus = 'all' }) {
    const list = shares?.data || shares || [];
    const [copiedToken, setCopiedToken] = useState(null);

    const handleCopy = (token) => {
        const fullUrl = `${window.location.origin}/demo-view/${token}`;
        navigator.clipboard?.writeText(fullUrl)?.catch(() => {});
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 3000);
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to remove this shared demo record?')) return;
        router.delete(`/admin/demo-shares/${id}`);
    };

    return (
        <AdminLayout title="Shared Demo Links & Bookings">
            <Head title="Shared Demo Classes" />

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Shared Demo Classes &amp; Student Bookings</h4>
                    <p className="text-muted small mb-0">
                        Track students who received demo video links, view watch timestamps, and manage follow-up class bookings.
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <Link href="/admin/teacher-demos" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        <i className="bi bi-camera-video me-1"></i>Review Teacher Demos
                    </Link>
                </div>
            </div>

            {/* Shares Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '40px' }}>#</th>
                                <th>Student Details</th>
                                <th>Demo Session &amp; Educator</th>
                                <th>Status</th>
                                <th>Student Schedule / Notes</th>
                                <th>Shared Date</th>
                                <th className="text-end" style={{ minWidth: '220px' }}>Sharing Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="bi bi-share fs-1 d-block mb-2 text-secondary"></i>
                                        No shared demo sessions recorded yet. Share an approved demo with a student from Teacher Demos or Contact Inbox.
                                    </td>
                                </tr>
                            ) : (
                                list.map((item, idx) => {
                                    const fullUrl = typeof window !== 'undefined'
                                        ? `${window.location.origin}/demo-view/${item.token}`
                                        : `/demo-view/${item.token}`;

                                    const cleanPhone = (item.student_phone || '').replace(/\D+/g, '');
                                    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                                    const waText = encodeURIComponent(
                                        `Hello ${item.student_name}, greetings from The Local Tutors!\n\nHere is your exclusive recorded demo class: ${fullUrl}\n\nPlease watch and let us know your preferred regular class schedule!`
                                    );
                                    const waLink = `https://wa.me/${waPhone}?text=${waText}`;

                                    const statusBadge =
                                        item.status === 'booking_requested'
                                            ? 'bg-success text-white'
                                            : item.status === 'watched'
                                            ? 'bg-info-subtle text-info-emphasis border border-info-subtle'
                                            : 'bg-primary-subtle text-primary border border-primary-subtle';

                                    const statusLabel =
                                        item.status === 'booking_requested'
                                            ? 'Booking Requested!'
                                            : item.status === 'watched'
                                            ? 'Video Watched'
                                            : 'Link Shared';

                                    return (
                                        <tr key={item.id} className={item.status === 'booking_requested' ? 'table-warning' : ''}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{item.student_name}</div>
                                                <div className="small text-muted">
                                                    <i className="bi bi-telephone me-1"></i>{item.student_phone}
                                                </div>
                                                {item.student_email && (
                                                    <div className="small text-muted">{item.student_email}</div>
                                                )}
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-dark">
                                                    {item.teacher_demo?.title || 'Demo Session'}
                                                </div>
                                                <div className="small text-secondary">
                                                    Tutor: <strong>{item.teacher_demo?.user?.name || 'Educator'}</strong> • {item.teacher_demo?.subject}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-1 small fw-semibold ${statusBadge}`}>
                                                    {statusLabel}
                                                </span>
                                                {item.viewed_at && (
                                                    <div className="small text-muted mt-1" style={{ fontSize: '11px' }}>
                                                        Watched: {new Date(item.viewed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {item.preferred_schedule ? (
                                                    <div className="small">
                                                        <strong className="text-dark">Preferred Days:</strong> {item.preferred_schedule}
                                                        {item.student_notes && (
                                                            <div className="text-muted fst-italic">"{item.student_notes}"</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">Awaiting student review</span>
                                                )}
                                            </td>
                                            <td className="small text-muted">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1 flex-wrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(item.token)}
                                                        className={`btn btn-sm ${copiedToken === item.token ? 'btn-success' : 'btn-outline-secondary'}`}
                                                        title="Copy Shareable Demo View Link"
                                                    >
                                                        <i className={`bi ${copiedToken === item.token ? 'bi-check-lg' : 'bi-clipboard'} me-1`}></i>
                                                        {copiedToken === item.token ? 'Copied!' : 'Copy Link'}
                                                    </button>

                                                    <a
                                                        href={waLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-success"
                                                        title="Send via WhatsApp"
                                                    >
                                                        <i className="bi bi-whatsapp me-1"></i>WhatsApp
                                                    </a>

                                                    <a
                                                        href={`/demo-view/${item.token}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Preview Student Page"
                                                    >
                                                        <i className="bi bi-box-arrow-up-right"></i>
                                                    </a>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
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

            {shares?.links && <Pagination links={shares.links} />}
        </AdminLayout>
    );
}
