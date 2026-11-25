import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import { cleanExcerpt } from '../../Utils/text';
import axios from 'axios';

export default function CourseDetails({ course_details, coursecategories = [], feedbacklist = [] }) {
    const { auth, settings } = usePage().props;
    const [rating, setRating] = useState('5');
    const [feedback, setFeedback] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMsg, setReviewMsg] = useState('');
    const [enrollMsg, setEnrollMsg] = useState('');

    // Quick Trial / Inquiry Modal State
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({
        name: auth?.user?.name || '',
        phone: auth?.user?.mobile || '',
        email: auth?.user?.email || '',
        student_class: 'Class 9–10',
        learning_mode: course_details?.teaching_mode || 'Home Tuition / Online',
        course_subject: course_details?.title || course_details?.name || 'Academic Course',
        message: 'I would like to schedule a free trial class for this course.',
    });
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState('');
    const [inquiryError, setInquiryError] = useState('');

    const [enrolling, setEnrolling] = useState(false);

    const handleEnroll = async () => {
        if (!auth?.user) {
            alert('Please login as a student to enroll in this course.');
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        setEnrolling(true);
        try {
            const res = await axios.get(`/enrollcourse/ajax?id=${course_details?.id}`);
            if (res.data.status === 200) {
                setEnrollMsg(res.data.message || 'Successfully enrolled in course!');
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert('Please login to enroll in this course.');
        } finally {
            setEnrolling(false);
        }
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setInquirySubmitting(true);
        setInquirySuccess('');
        setInquiryError('');

        try {
            const res = await axios.post('/contactpost', inquiryForm);
            if (res.data.status === 200) {
                setInquirySuccess(res.data.message || 'Trial inquiry received! Our coordinator will contact you shortly.');
            } else {
                setInquiryError(res.data.message || 'Failed to submit inquiry.');
            }
        } catch (err) {
            setInquiryError('Could not submit inquiry. Please check your details and try again.');
        } finally {
            setInquirySubmitting(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        setReviewMsg('');
        try {
            const res = await axios.get('/feedbackpost', {
                params: {
                    course_id: course_details?.id,
                    rating,
                    feedback,
                },
            });
            if (res.data.status === 200) {
                setReviewMsg('Thank you for your feedback! It will appear once approved.');
                setFeedback('');
            } else {
                setReviewMsg(res.data.message || 'Could not submit feedback.');
            }
        } catch (err) {
            setReviewMsg('Please login to leave a review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (!course_details) {
        return (
            <FrontLayout>
                <div className="container py-5 text-center">
                    <h3>Course not found</h3>
                    <Link href="/all_course" className="btn btn-primary rounded-pill mt-3">Browse Courses</Link>
                </div>
            </FrontLayout>
        );
    }

    const courseTitle = course_details.title || course_details.name || 'Academic Course';
    const instructorName = course_details.teacher?.name || course_details.teacher?.user?.name || 'Verified Senior Faculty';
    const cleanDescription = cleanExcerpt(course_details.description, 150);

    return (
        <FrontLayout>
            <Head>
                <title>{`${courseTitle} - The Local Tutors`}</title>
                <meta name="description" content={`${courseTitle} taught by ${instructorName}. ${cleanDescription}`} />
            </Head>

            {/* Breadcrumb banner */}
            <div className="bg-white border-bottom py-5 hero-wrapper">
                <div className="container">
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span className="badge badge-soft-primary text-primary px-3 py-1 rounded-pill fw-semibold small">
                            {course_details.category?.title || 'Academic Course'}
                        </span>
                        <span className="badge badge-soft-success text-success px-3 py-1 rounded-pill fw-semibold small">
                            <i className="bi bi-shield-check me-1"></i>Verified Syllabus
                        </span>
                    </div>

                    <h1 className="fw-bold display-6 text-dark mb-3">{courseTitle}</h1>

                    <div className="d-flex align-items-center gap-3 text-secondary small flex-wrap">
                        <span>
                            <i className="bi bi-person-badge-fill text-primary me-1"></i>
                            Instructor: <strong>{instructorName}</strong>
                        </span>
                        <span>
                            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                            Mode: <strong>{course_details.teaching_mode || 'Home / Online'}</strong>
                        </span>
                        <span>
                            <i className="bi bi-clock-fill text-warning me-1"></i>
                            Session: <strong>{course_details.duration ? `${course_details.duration} mins / class` : '60 mins'}</strong>
                        </span>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row gy-4">
                    {/* Left: Course Main info */}
                    <div className="col-lg-8">
                        <div className="card card-modern overflow-hidden mb-4">
                            <img
                                src={course_details.image && course_details.image.startsWith('http') ? course_details.image : (course_details.image ? `/course/${course_details.image}` : '/front/img/noimage.jpg')}
                                alt={`Curriculum banner for ${courseTitle}`}
                                className="img-fluid w-100"
                                style={{ maxHeight: '420px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80';
                                }}
                            />

                            <div className="card-body p-4 p-md-5">
                                <h3 className="fw-bold text-dark mb-3">About this Course &amp; Curriculum</h3>
                                <div
                                    className="course-description-content text-secondary mb-4 fs-6 lh-lg"
                                    dangerouslySetInnerHTML={{ __html: course_details.description || '<p class="text-muted">No detailed syllabus outline provided.</p>' }}
                                />

                                <style>{`
                                    .course-description-content h1, 
                                    .course-description-content h2, 
                                    .course-description-content h3,
                                    .course-description-content h4 {
                                        color: #0f172a;
                                        font-weight: 700;
                                        margin-top: 1.5rem;
                                        margin-bottom: 0.75rem;
                                    }
                                    .course-description-content ul, 
                                    .course-description-content ol {
                                        padding-left: 1.5rem;
                                        margin-bottom: 1rem;
                                    }
                                    .course-description-content li {
                                        margin-bottom: 0.35rem;
                                    }
                                    .course-description-content blockquote {
                                        border-left: 4px solid #0284c7;
                                        padding-left: 1rem;
                                        font-style: italic;
                                        color: #475569;
                                        margin: 1rem 0;
                                    }
                                    .course-description-content p {
                                        margin-bottom: 0.85rem;
                                    }
                                `}</style>

                                {course_details.youtube_url && (
                                    <div className="my-4">
                                        <h5 className="fw-bold mb-3">Course Preview Video</h5>
                                        <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
                                            <iframe
                                                src={course_details.youtube_url.replace('watch?v=', 'embed/')}
                                                title={`Preview video for ${courseTitle}`}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {/* Course FAQs */}
                                {course_details.faq && course_details.faq.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="fw-bold mb-3">Frequently Asked Questions</h4>
                                        <div className="accordion" id="faqAccordion">
                                            {course_details.faq.map((f, i) => (
                                                <div className="accordion-item" key={f.id || i}>
                                                    <h2 className="accordion-header" id={`heading${i}`}>
                                                        <button
                                                            className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapse${i}`}
                                                            aria-expanded={i === 0 ? 'true' : 'false'}
                                                        >
                                                            {f.question}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse${i}`}
                                                        className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                                                        data-bs-parent="#faqAccordion"
                                                    >
                                                        <div className="accordion-body text-muted">
                                                            {f.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews & Feedback Section */}
                        <div className="card card-modern p-4 p-md-5 mb-4">
                            <h4 className="fw-bold text-dark mb-4">Verified Student Reviews</h4>

                            {reviewMsg && (
                                <div className="alert alert-info">{reviewMsg}</div>
                            )}

                            {/* Review Form */}
                            {auth?.user ? (
                                <form onSubmit={handleFeedbackSubmit} className="mb-5 p-3 bg-light rounded-3">
                                    <h6 className="fw-bold mb-3">Leave a Review</h6>
                                    <div className="row g-2 mb-3">
                                        <div className="col-sm-4">
                                            <label className="form-label small fw-semibold">Rating</label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                                <option value="3">⭐⭐⭐ (3 Stars)</option>
                                                <option value="2">⭐⭐ (2 Stars)</option>
                                                <option value="1">⭐ (1 Star)</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold">Your Comment</label>
                                            <textarea
                                                rows="3"
                                                className="form-control"
                                                placeholder="Share your experience with this course..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary-gradient btn-sm px-4 fw-semibold"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="alert alert-light border mb-4 small">
                                    <Link href="/login" className="fw-semibold text-primary">Login</Link> to post a review after enrolling.
                                </div>
                            )}

                            {/* Reviews list */}
                            {feedbacklist.length === 0 ? (
                                <div className="text-center py-4 bg-light rounded-3">
                                    <i className="bi bi-star text-warning fs-3 mb-2 d-block"></i>
                                    <p className="text-secondary small mb-0">No public reviews yet for this specific batch. Be the first to review!</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {feedbacklist.map((rev) => (
                                        <div key={rev.id} className="border-bottom pb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className="text-dark">{rev.user?.name || 'Verified Student'}</strong>
                                                <span className="text-warning small">
                                                    {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                                                </span>
                                            </div>
                                            <p className="text-secondary small mb-1">{rev.feedback}</p>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                {new Date(rev.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar: Enrolment & Quick Trial Inquiry */}
                    <div className="col-lg-4">
                        <div className="card card-modern p-4 sticky-top" style={{ top: '90px' }}>
                            <div className="text-center mb-3">
                                <span className="text-muted small text-uppercase fw-semibold d-block mb-1">
                                    {course_details.price_type === 'per_month' ? 'Monthly Tuition Fee' : 'Course Fee'}
                                </span>
                                <h2 className="fw-bold text-primary display-6 mb-0">
                                    {course_details.price ? `₹${Number(course_details.price).toLocaleString('en-IN')}` : 'Free'}
                                </h2>
                                <span className="text-muted small">
                                    {course_details.price_type === 'per_month' ? 'per student / month' : 'one-time complete fee'}
                                </span>
                            </div>

                            <div className="text-center mb-4">
                                <span className="badge badge-soft-success text-success px-3 py-2 rounded-pill small fw-semibold">
                                    <i className="bi bi-patch-check-fill me-1"></i>Free Trial Class Available
                                </span>
                            </div>

                            {enrollMsg && (
                                <div className="alert alert-success small mb-3">
                                    <i className="bi bi-check-circle me-1"></i>{enrollMsg}
                                </div>
                            )}

                            <div className="d-grid gap-2 mb-4">
                                <button
                                    onClick={() => setShowInquiryModal(true)}
                                    className="btn btn-primary-gradient py-2 fw-semibold"
                                >
                                    <i className="bi bi-calendar-check me-2"></i>Book a Free Trial Class
                                </button>
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="btn btn-outline-primary py-2 fw-semibold"
                                >
                                    {enrolling ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Enrolling...
                                        </>
                                    ) : (
                                        'Instant Enroll'
                                    )}
                                </button>
                            </div>

                            {/* Key Course Specifications */}
                            <div className="border-top pt-3">
                                <h6 className="fw-bold text-dark mb-3">Program Specifics</h6>
                                <ul className="list-unstyled small d-flex flex-column gap-2 mb-0 text-secondary">
                                    <li className="d-flex justify-content-between">
                                        <span><i className="bi bi-geo-alt me-2 text-primary"></i>Learning Mode:</span>
                                        <strong className="text-dark">{course_details.teaching_mode || 'Home / Online'}</strong>
                                    </li>
                                    <li className="d-flex justify-content-between">
                                        <span><i className="bi bi-clock me-2 text-primary"></i>Session Duration:</span>
                                        <strong className="text-dark">{course_details.duration ? `${course_details.duration} mins` : '60 mins'}</strong>
                                    </li>
                                    <li className="d-flex justify-content-between">
                                        <span><i className="bi bi-layers me-2 text-primary"></i>Target Level:</span>
                                        <strong className="text-dark">Class 9–12 / Foundation</strong>
                                    </li>
                                    <li className="d-flex justify-content-between">
                                        <span><i className="bi bi-shield-check me-2 text-primary"></i>Educator Status:</span>
                                        <strong className="text-success">Verified Background</strong>
                                    </li>
                                    <li className="d-flex justify-content-between">
                                        <span><i className="bi bi-journal-check me-2 text-primary"></i>Curriculum:</span>
                                        <strong className="text-dark">CBSE, ICSE &amp; WBBSE</strong>
                                    </li>
                                </ul>
                            </div>

                            {/* Direct Call / WhatsApp Helpline */}
                            <div className="border-top mt-4 pt-3 text-center">
                                <p className="small text-muted mb-2">Need advice on syllabus or teacher match?</p>
                                <a
                                    href="https://wa.me/917003578764?text=Hello%20The%20Local%20Tutors,%20I%20am%20interested%20in%20a%20demo%20class"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                                >
                                    <i className="bi bi-whatsapp"></i>
                                    <span>WhatsApp Coordinator: 7003578764</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trial Inquiry Modal */}
            {showInquiryModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <div>
                                    <span className="badge badge-soft-primary text-primary small px-2 py-1 rounded-pill mb-1">Trial Session</span>
                                    <h5 className="modal-title fw-bold text-dark">Schedule Your Demo Class</h5>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowInquiryModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {inquirySuccess ? (
                                    <div className="p-4 text-center">
                                        <div className="p-3 bg-success-subtle text-success rounded-circle d-inline-flex mb-3">
                                            <i className="bi bi-check2-circle fs-1"></i>
                                        </div>
                                        <h5 className="fw-bold text-dark">Inquiry Submitted!</h5>
                                        <p className="text-secondary small mb-3">{inquirySuccess}</p>
                                        <button
                                            type="button"
                                            className="btn btn-primary-gradient btn-sm rounded-pill px-4"
                                            onClick={() => setShowInquiryModal(false)}
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInquirySubmit}>
                                        {inquiryError && <div className="alert alert-danger small py-2">{inquiryError}</div>}

                                        <div className="mb-2">
                                            <label className="form-label small fw-semibold">Parent / Student Name *</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={inquiryForm.name}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="row g-2 mb-2">
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold">Phone / WhatsApp *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control form-control-sm"
                                                    placeholder="10-digit number"
                                                    value={inquiryForm.phone}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label small fw-semibold">Student Class / Level</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={inquiryForm.student_class}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_class: e.target.value })}
                                                >
                                                    <option value="Class 1–5">Class 1–5 (Primary)</option>
                                                    <option value="Class 6–8">Class 6–8 (Middle)</option>
                                                    <option value="Class 9–10">Class 9–10 (Board)</option>
                                                    <option value="Class 11–12">Class 11–12 (Higher Sec)</option>
                                                    <option value="College / Competitive">College / Competitive</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label small fw-semibold">Preferred Mode</label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={inquiryForm.learning_mode}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, learning_mode: e.target.value })}
                                            >
                                                <option value="Home Tuition">Home Tuition (In-person)</option>
                                                <option value="Interactive Online">Interactive 1-on-1 Online</option>
                                                <option value="Either Mode">Either Mode</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">Special Instructions or Doubts (Optional)</label>
                                            <textarea
                                                rows="2"
                                                className="form-control form-control-sm"
                                                value={inquiryForm.message}
                                                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className="btn btn-primary-gradient py-2 fw-semibold"
                                                disabled={inquirySubmitting}
                                            >
                                                {inquirySubmitting ? 'Sending Request...' : 'Confirm Demo Request'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FrontLayout>
    );
}
