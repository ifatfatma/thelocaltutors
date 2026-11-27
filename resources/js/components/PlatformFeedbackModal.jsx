import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function PlatformFeedbackModal({ isOpen, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const [form, setForm] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.mobile || '',
        role: user.type === 'teacher' ? 'Teacher / Tutor' : (user.type === 'student' ? 'Student' : 'Parent'),
        category: 'Platform Experience',
        rating: 5,
        feedback: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/platform-feedback', form);
            if (res.data.status === 200) {
                setSuccessMsg(res.data.message || 'Thank you! Your feedback has been received and will be displayed after administrator review.');
                setForm({
                    ...form,
                    feedback: '',
                });
            } else {
                setErrorMsg(res.data.message || 'Failed to submit feedback.');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Could not submit feedback. Please check your message and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(5px)',
                zIndex: 1070,
                overflowY: 'auto',
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-4 border-0 shadow-xl overflow-hidden">
                    <div className="modal-header bg-primary text-white py-3 px-4 border-0">
                        <div className="d-flex align-items-center gap-2">
                            <div className="p-2 bg-white bg-opacity-25 rounded-circle d-inline-flex">
                                <i className="bi bi-chat-heart-fill fs-5"></i>
                            </div>
                            <div>
                                <h5 className="modal-title fw-bold mb-0">Share Your Feedback</h5>
                                <span className="small text-white-50">Help us improve The Local Tutors community</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {successMsg ? (
                                <div className="text-center py-4">
                                    <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex mb-3 fs-2">
                                        <i className="bi bi-check-circle-fill"></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2">Feedback Received!</h5>
                                    <p className="text-secondary small mb-4">{successMsg}</p>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn btn-primary rounded-pill px-4"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {errorMsg && (
                                        <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Role & Rating */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-sm-6">
                                            <label className="form-label small fw-semibold text-secondary">
                                                I am a
                                            </label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={form.role}
                                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Parent">Parent</option>
                                                <option value="Teacher / Tutor">Teacher / Tutor</option>
                                                <option value="Visitor">Website Visitor</option>
                                            </select>
                                        </div>

                                        <div className="col-sm-6">
                                            <label className="form-label small fw-semibold text-secondary">
                                                Overall Rating
                                            </label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={form.rating}
                                                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                                            >
                                                <option value="5">⭐⭐⭐⭐⭐ 5.0 (Excellent)</option>
                                                <option value="4">⭐⭐⭐⭐ 4.0 (Good)</option>
                                                <option value="3">⭐⭐⭐ 3.0 (Average)</option>
                                                <option value="2">⭐⭐ 2.0 (Needs Improvement)</option>
                                                <option value="1">⭐ 1.0 (Poor)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Name & Contact */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-sm-6">
                                            <label className="form-label small fw-semibold text-secondary">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="e.g. Rahul Sharma"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label small fw-semibold text-secondary">
                                                Feedback Topic
                                            </label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={form.category}
                                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            >
                                                <option value="Platform Experience">Platform &amp; Website Experience</option>
                                                <option value="Tutor Quality">Teacher / Tutor Quality</option>
                                                <option value="Matching Speed">Tutor Matching Service</option>
                                                <option value="General Suggestion">General Improvement Idea</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Feedback Message */}
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">
                                            Your Feedback / Experience <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            rows="4"
                                            className="form-control form-control-sm"
                                            placeholder="What do you love about The Local Tutors, or how can we improve your experience?"
                                            value={form.feedback}
                                            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="p-2 bg-light rounded-3 small text-muted d-flex align-items-center gap-2">
                                        <i className="bi bi-shield-lock-fill text-primary"></i>
                                        <span>Submissions are moderated by the administrator before being displayed publicly.</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {!successMsg && (
                            <div className="modal-footer bg-light px-4 py-3 border-top d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !form.feedback.trim()}
                                    className="btn btn-primary-gradient rounded-pill px-4 fw-semibold btn-sm shadow-xs"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send-fill me-1"></i>
                                            Send Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
