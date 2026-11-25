import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function DemoView({ share, teacherDemo, settings }) {
    const { data, setData, post, processing, errors } = useForm({
        preferred_schedule: share?.preferred_schedule || '',
        student_notes: share?.student_notes || '',
    });

    const [confirmed, setConfirmed] = useState(share?.status === 'booking_requested');

    const handleConfirm = (e) => {
        e.preventDefault();
        post(`/demo-view/${share.token}/confirm`, {
            onSuccess: () => {
                setConfirmed(true);
            },
        });
    };

    const teacher = teacherDemo?.user;
    const teacherProfile = teacherDemo?.teacher;

    const cleanHelpline = (settings?.mobile || '7003578764').replace(/\D+/g, '');
    const waBookingUrl = `https://wa.me/91${cleanHelpline}?text=${encodeURIComponent(
        `Hello The Local Tutors! I watched the demo class for ${teacherDemo?.title} by ${teacher?.name || 'the teacher'}. I would like to book regular classes for ${share?.student_name}.`
    )}`;

    return (
        <FrontLayout>
            <Head>
                <title>{`Recorded Demo Class: ${teacherDemo?.title || 'Specialized Session'} - The Local Tutors`}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Header */}
            <div className="bg-white border-bottom py-4 hero-wrapper">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <span className="badge badge-soft-primary text-primary px-3 py-1 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-1">
                                <i className="bi bi-play-circle-fill text-primary"></i>
                                <span>Exclusive Recorded Demo Class</span>
                            </span>
                            <h1 className="fw-bold display-6 text-dark mb-1">
                                {teacherDemo?.title || 'Specialized Demo Session'}
                            </h1>
                            <div className="d-flex flex-wrap align-items-center gap-2 text-secondary small">
                                <span className="badge bg-light text-secondary border">
                                    <i className="bi bi-journal-text me-1"></i>{teacherDemo?.subject}
                                </span>
                                {teacherDemo?.class_level && (
                                    <span className="badge bg-light text-secondary border">
                                        <i className="bi bi-mortarboard me-1"></i>{teacherDemo?.class_level}
                                    </span>
                                )}
                                <span className="text-muted">• Prepared exclusively for <strong>{share?.student_name}</strong></span>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <span className="badge badge-soft-success text-success px-3 py-2 rounded-pill small fw-semibold">
                                <i className="bi bi-patch-check-fill me-1"></i>Verified Educator
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    {/* Main Video Player & Details */}
                    <div className="col-lg-8">
                        <div className="card card-modern overflow-hidden mb-4 shadow-sm border-0">
                            {/* Responsive 16:9 Video Embed Player */}
                            <div className="position-relative bg-black ratio ratio-16x9">
                                {teacherDemo?.video_embed_url ? (
                                    <iframe
                                        src={teacherDemo.video_embed_url}
                                        title={teacherDemo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-100 h-100"
                                    ></iframe>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center text-white p-4 text-center">
                                        <div>
                                            <i className="bi bi-camera-video-off fs-1 mb-2 d-block text-secondary"></i>
                                            <p className="mb-2">Click below to open the demo video in a new tab:</p>
                                            <a
                                                href={teacherDemo?.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-primary rounded-pill px-4"
                                            >
                                                Open Video Link
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card-body p-4 p-md-4">
                                <h4 className="fw-bold text-dark mb-2">{teacherDemo?.title}</h4>
                                <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-3 pb-3 border-bottom">
                                    <span>
                                        <i className="bi bi-person-fill text-primary me-1"></i>
                                        Taught by <strong>{teacher?.name || 'Verified Educator'}</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                        <i className="bi bi-book text-primary me-1"></i>
                                        {teacherDemo?.subject}
                                    </span>
                                    <span>•</span>
                                    <span className="text-success fw-semibold">
                                        <i className="bi bi-check-circle-fill me-1"></i>1-on-1 Personalized Mentoring Available
                                    </span>
                                </div>

                                {teacherDemo?.notes && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-dark mb-2">About this Demo Session &amp; Topics Covered:</h6>
                                        <p className="text-secondary small lh-lg mb-0" style={{ whiteSpace: 'pre-line' }}>
                                            {teacherDemo.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Pillars of Learning */}
                                <div className="row g-3 pt-3 border-top">
                                    <div className="col-sm-4">
                                        <div className="d-flex align-items-center gap-2 small text-secondary">
                                            <i className="bi bi-check2-circle text-success fs-5"></i>
                                            <span>Concept-First Teaching Methodology</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="d-flex align-items-center gap-2 small text-secondary">
                                            <i className="bi bi-calendar-check text-primary fs-5"></i>
                                            <span>Flexible Weekly Schedule</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="d-flex align-items-center gap-2 small text-secondary">
                                            <i className="bi bi-graph-up-arrow text-primary fs-5"></i>
                                            <span>Monthly Progress Report for Parents</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Educator Bio Card */}
                        <div className="card card-modern p-4 border-0 shadow-sm">
                            <div className="d-flex align-items-center gap-3">
                                <img
                                    src={
                                        teacher?.image
                                            ? (teacher.image.startsWith('http') ? teacher.image : `/user/${teacher.image}`)
                                            : '/front/img/noprofileimage.png'
                                    }
                                    alt={teacher?.name || 'Educator'}
                                    className="rounded-circle border shadow-2xs flex-shrink-0"
                                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = '/front/img/noprofileimage.png';
                                    }}
                                />
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="fw-bold text-dark mb-0">{teacher?.name || 'Verified Educator'}</h5>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small">
                                            Tutor
                                        </span>
                                    </div>
                                    {teacherProfile?.description && /<[a-z][\s\S]*>/i.test(teacherProfile.description) ? (
                                        <div
                                            className="text-secondary small mb-1 mt-1 rich-content"
                                            dangerouslySetInnerHTML={{ __html: teacherProfile.description }}
                                        />
                                    ) : (
                                        <p className="text-secondary small mb-1 mt-1">
                                            {teacherProfile?.description || 'Experienced educator focused on personalized mentoring, board curriculum mastery, and building strong fundamental concepts.'}
                                        </p>
                                    )}
                                    <span className="text-muted small" style={{ fontSize: '11px' }}>
                                        <i className="bi bi-geo-alt me-1"></i>{teacherProfile?.address || 'Kolkata, West Bengal'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Action Sidebar: Confirm Regular Classes */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '90px' }}>
                            {/* Confirmation Card */}
                            <div className="card card-modern p-4 border-0 shadow-sm">
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill small fw-bold mb-3 d-inline-block align-self-start">
                                    Next Step
                                </span>
                                <h5 className="fw-bold text-dark mb-2">Book Regular Classes</h5>
                                <p className="text-secondary small mb-4">
                                    Liked this demo class? Confirm your preferred weekly schedule below or chat with our coordinator on WhatsApp to begin regular sessions.
                                </p>

                                {confirmed ? (
                                    <div className="p-4 bg-success-subtle rounded-4 text-center border border-success-subtle">
                                        <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                                        <h6 className="fw-bold text-dark mb-1">Schedule Request Received!</h6>
                                        <p className="text-secondary small mb-3">
                                            Our academic coordinator will reach out to <strong>{share?.student_phone}</strong> to confirm class dates and fee structure.
                                        </p>
                                        <a
                                            href={waBookingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-success btn-sm rounded-pill px-4 w-100 fw-semibold"
                                        >
                                            <i className="bi bi-whatsapp me-1"></i>Confirm on WhatsApp
                                        </a>
                                    </div>
                                ) : (
                                    <form onSubmit={handleConfirm} className="d-flex flex-column gap-3">
                                        <div>
                                            <label className="form-label small fw-semibold text-secondary">
                                                Preferred Days &amp; Timings <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.preferred_schedule ? 'is-invalid' : ''}`}
                                                placeholder="e.g. Mon, Wed, Fri 5:00 PM or Weekends"
                                                value={data.preferred_schedule}
                                                onChange={(e) => setData('preferred_schedule', e.target.value)}
                                                required
                                            />
                                            {errors.preferred_schedule && (
                                                <div className="invalid-feedback">{errors.preferred_schedule}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="form-label small fw-semibold text-secondary">
                                                Additional Notes / Goals (Optional)
                                            </label>
                                            <textarea
                                                rows="2"
                                                className="form-control"
                                                placeholder="e.g. Focus on upcoming quarterly exams and NCERT exercises"
                                                value={data.student_notes}
                                                onChange={(e) => setData('student_notes', e.target.value)}
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary-gradient rounded-pill py-2 fw-semibold w-100 shadow-sm"
                                            disabled={processing}
                                        >
                                            {processing ? 'Submitting...' : 'Confirm Class Schedule'}
                                        </button>
                                    </form>
                                )}

                                <div className="mt-4 pt-3 border-top text-center">
                                    <span className="text-secondary small d-block mb-2">Want immediate confirmation?</span>
                                    <a
                                        href={waBookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-success rounded-pill px-3 py-2 w-100 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                                    >
                                        <i className="bi bi-whatsapp"></i>
                                        <span>Instant WhatsApp Helpline</span>
                                    </a>
                                </div>
                            </div>

                            {/* Trust Signals Card */}
                            <div className="card card-modern p-4 border-0 shadow-sm bg-light">
                                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                    <i className="bi bi-shield-check text-primary"></i>
                                    <span>The Local Tutors Guarantee</span>
                                </h6>
                                <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
                                    <li className="d-flex align-items-start gap-2">
                                        <i className="bi bi-check-lg text-success mt-1"></i>
                                        <span>Direct 1-on-1 attention with zero crowded batch distractions</span>
                                    </li>
                                    <li className="d-flex align-items-start gap-2">
                                        <i className="bi bi-check-lg text-success mt-1"></i>
                                        <span>Transparent monthly fee structure without hidden upfront charges</span>
                                    </li>
                                    <li className="d-flex align-items-start gap-2">
                                        <i className="bi bi-check-lg text-success mt-1"></i>
                                        <span>Verified qualifications and police/identity background checks</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
