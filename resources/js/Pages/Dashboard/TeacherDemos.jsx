import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function TeacherDemos({ demos, teacher }) {
    const list = demos?.data || demos || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        subject: '',
        class_level: '',
        video_url: '',
        notes: '',
    });

    const [activeEmbedPreview, setActiveEmbedPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/demos', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to remove this demo submission?')) return;
        router.delete(`/dashboard/demos/${id}`);
    };

    return (
        <FrontLayout>
            <Head>
                <title>Recorded Demo Sessions - The Local Tutors</title>
            </Head>

            {/* Header */}
            <div className="bg-white border-bottom py-4 hero-wrapper">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-2">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/dashboard" className="text-secondary text-decoration-none">Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">
                                Demo Sessions
                            </li>
                        </ol>
                    </nav>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <span className="badge badge-soft-primary text-primary px-3 py-1 rounded-pill fw-semibold mb-2">
                                <i className="bi bi-camera-video-fill me-1"></i>Teacher Portal
                            </span>
                            <h2 className="fw-bold text-dark mb-1">My Recorded Demo Sessions</h2>
                            <p className="text-secondary small mb-0">
                                Submit 10–20 minute sample teaching videos (YouTube or Google Drive) so students and parents can preview your teaching pedagogy.
                            </p>
                        </div>
                        <Link href="/dashboard" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                            <i className="bi bi-arrow-left me-1"></i>Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    {/* Submit Demo Form */}
                    <div className="col-lg-5">
                        <div className="card card-modern p-4 p-md-4 sticky-top" style={{ top: '90px' }}>
                            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                                <span className="p-2 bg-primary-subtle text-primary rounded-3 d-inline-flex">
                                    <i className="bi bi-cloud-arrow-up-fill fs-5"></i>
                                </span>
                                <div>
                                    <h5 className="fw-bold mb-0 text-dark">Submit New Demo Session</h5>
                                    <span className="text-muted small">Super Admin reviews and approves all demos</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div>
                                    <label className="form-label small fw-semibold text-secondary">
                                        Demo Class Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Linear Equations & Graphs - Concept Clarity"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                <div className="row g-2">
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Subject <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Mathematics"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                        />
                                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Class / Board Level
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Class 10 CBSE"
                                            value={data.class_level}
                                            onChange={(e) => setData('class_level', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label small fw-semibold text-secondary">
                                        Recorded Video URL (YouTube or Google Drive) <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light text-secondary border-end-0">
                                            <i className="bi bi-link-45deg"></i>
                                        </span>
                                        <input
                                            type="url"
                                            className={`form-control border-start-0 ${errors.video_url ? 'is-invalid' : ''}`}
                                            placeholder="https://www.youtube.com/watch?v=... or Drive link"
                                            value={data.video_url}
                                            onChange={(e) => setData('video_url', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-text text-muted" style={{ fontSize: '11px' }}>
                                        Accepts standard YouTube links, YouTube Shorts, or public/unlisted Google Drive links.
                                    </div>
                                    {errors.video_url && <div className="text-danger small mt-1">{errors.video_url}</div>}
                                </div>

                                <div>
                                    <label className="form-label small fw-semibold text-secondary">
                                        Session Notes &amp; Topics Covered
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        placeholder="Briefly describe what concepts you solved and your problem-solving approach..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="p-3 bg-light rounded-3 small text-secondary">
                                    <i className="bi bi-shield-check text-primary me-1"></i>
                                    <strong>Super Admin Review:</strong> Once submitted, your demo is placed under review. Once approved, it can be shared with students requesting demo sessions.
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary-gradient rounded-pill py-2 fw-semibold w-100 shadow-sm"
                                    disabled={processing}
                                >
                                    {processing ? 'Submitting...' : 'Submit Demo for Approval'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Submitted Demos List */}
                    <div className="col-lg-7">
                        <div className="card card-modern p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                                <div>
                                    <h5 className="fw-bold text-dark mb-1">Your Submitted Demos</h5>
                                    <span className="text-secondary small">Total submissions: {list.length}</span>
                                </div>
                            </div>

                            {list.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="p-3 bg-light rounded-circle d-inline-flex mb-3">
                                        <i className="bi bi-camera-video fs-1 text-secondary"></i>
                                    </div>
                                    <h5 className="fw-bold text-dark">No Demo Sessions Yet</h5>
                                    <p className="text-secondary small mb-0" style={{ maxWidth: '360px', margin: '0 auto' }}>
                                        Submit a video demo on the left to showcase your teaching style to interested parents and students.
                                    </p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {list.map((demo) => {
                                        const badgeClass =
                                            demo.status === 'approved'
                                                ? 'bg-success-subtle text-success border-success-subtle'
                                                : demo.status === 'rejected'
                                                ? 'bg-danger-subtle text-danger border-danger-subtle'
                                                : 'bg-warning-subtle text-warning-emphasis border-warning-subtle';

                                        const badgeText =
                                            demo.status === 'approved'
                                                ? 'Approved & Ready'
                                                : demo.status === 'rejected'
                                                ? 'Needs Revision'
                                                : 'Pending Admin Review';

                                        return (
                                            <div key={demo.id} className="p-3 rounded-4 bg-light border transition">
                                                <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                                                    <div>
                                                        <span className={`badge border rounded-pill px-3 py-1 fw-semibold small mb-2 d-inline-block ${badgeClass}`}>
                                                            {badgeText}
                                                        </span>
                                                        <h6 className="fw-bold text-dark mb-1">{demo.title}</h6>
                                                        <div className="d-flex flex-wrap align-items-center gap-2 text-secondary small">
                                                            <span className="badge bg-white text-secondary border">
                                                                <i className="bi bi-journal-bookmark me-1"></i>{demo.subject}
                                                            </span>
                                                            {demo.class_level && (
                                                                <span className="badge bg-white text-secondary border">
                                                                    <i className="bi bi-mortarboard me-1"></i>{demo.class_level}
                                                                </span>
                                                            )}
                                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                                {new Date(demo.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveEmbedPreview(activeEmbedPreview === demo.id ? null : demo.id)}
                                                            className="btn btn-sm btn-white bg-white border rounded-pill px-3 text-secondary"
                                                        >
                                                            <i className={`bi ${activeEmbedPreview === demo.id ? 'bi-eye-slash' : 'bi-play-circle'} me-1`}></i>
                                                            {activeEmbedPreview === demo.id ? 'Hide Video' : 'Preview'}
                                                        </button>
                                                        {demo.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleDelete(demo.id)}
                                                                className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                style={{ width: '32px', height: '32px' }}
                                                                title="Delete Submission"
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {demo.notes && (
                                                    <p className="text-secondary small mb-2 bg-white p-2 rounded-2 border">
                                                        {demo.notes}
                                                    </p>
                                                )}

                                                {demo.admin_feedback && (
                                                    <div className="p-2 rounded-2 bg-white border border-warning-subtle small text-dark mb-2">
                                                        <strong className="text-warning-emphasis">Admin Feedback:</strong> {demo.admin_feedback}
                                                    </div>
                                                )}

                                                {/* In-place preview */}
                                                {activeEmbedPreview === demo.id && (
                                                    <div className="mt-3 rounded-3 overflow-hidden bg-black ratio ratio-16x9">
                                                        <iframe
                                                            src={demo.video_embed_url || demo.video_url}
                                                            title={demo.title}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
