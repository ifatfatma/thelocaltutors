import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function CourseDetails({ course_details, coursecategories = [], feedbacklist = [] }) {
    const { auth } = usePage().props;
    const [rating, setRating] = useState('5');
    const [feedback, setFeedback] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMsg, setReviewMsg] = useState('');
    const [enrollMsg, setEnrollMsg] = useState('');

    const handleEnroll = async () => {
        try {
            const res = await axios.get(`/enrollcourse/ajax?id=${course_details?.id}`);
            if (res.data.status === 200) {
                setEnrollMsg(res.data.message || 'Successfully enrolled in course!');
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert('Please login to enroll in this course.');
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
                setReviewMsg('Thank you for your feedback!');
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
                    <Link href="/all_course" className="btn btn-primary mt-3">Back to Courses</Link>
                </div>
            </FrontLayout>
        );
    }

    return (
        <FrontLayout>
            <Head title={course_details.title} />

            <div className="bg-primary text-white py-5">
                <div className="container">
                    <span className="badge bg-light text-primary mb-2">Course Details</span>
                    <h1 className="fw-bold mb-3">{course_details.title}</h1>
                    <div className="d-flex align-items-center gap-3 text-white-50 small">
                        {(course_details.teacher?.name || course_details.teacher?.user?.name) && (
                            <span><i className="bi bi-person me-1"></i>Instructor: {course_details.teacher?.name || course_details.teacher?.user?.name}</span>
                        )}
                        <span><i className="bi bi-tag me-1"></i>Price: {course_details.price ? `₹${course_details.price}` : 'Free'}</span>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row gy-4">
                    {/* Left: Course Main info */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <img
                                src={course_details.image ? `/course/${course_details.image}` : '/front/img/noimage.jpg'}
                                alt={course_details.title}
                                className="img-fluid w-100"
                                style={{ maxHeight: '420px', objectFit: 'cover' }}
                            />

                            <div className="card-body p-4 p-md-5">
                                <h3 className="fw-bold mb-3">About this Course</h3>
                                <div
                                    className="text-muted mb-4 fs-6"
                                    dangerouslySetInnerHTML={{ __html: course_details.description || 'No description provided.' }}
                                />

                                {course_details.youtube_url && (
                                    <div className="my-4">
                                        <h5 className="fw-bold mb-3">Course Preview Video</h5>
                                        <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
                                            <iframe
                                                src={course_details.youtube_url.replace('watch?v=', 'embed/')}
                                                title="Course Video"
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
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">
                            <h4 className="fw-bold mb-4">Student Feedback &amp; Reviews</h4>

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
                                                placeholder="Write your experience with this course..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm px-4 fw-semibold"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="alert alert-light border mb-4">
                                    <Link href="/login" className="fw-semibold text-primary">Login</Link> to write a review.
                                </div>
                            )}

                            {/* Reviews list */}
                            {feedbacklist.length === 0 ? (
                                <p className="text-muted small">No reviews yet. Be the first to review this course!</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {feedbacklist.map((rev) => (
                                        <div key={rev.id} className="border-bottom pb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className="text-dark">{rev.user?.name || 'Student'}</strong>
                                                <span className="text-warning small">
                                                    {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                                                </span>
                                            </div>
                                            <p className="text-muted small mb-1">{rev.feedback}</p>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                {new Date(rev.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar: Enrolment card */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-primary mb-1">
                                    {course_details.price ? `₹${course_details.price}` : 'Free'}
                                </h2>
                                <span className="text-muted small">Full Lifetime Access</span>
                            </div>

                            {enrollMsg && (
                                <div className="alert alert-success small mb-3">
                                    <i className="bi bi-check-circle me-1"></i>{enrollMsg}
                                </div>
                            )}

                            <button
                                onClick={handleEnroll}
                                className="btn btn-primary w-100 py-2 fw-semibold mb-3 fs-5"
                            >
                                <i className="bi bi-mortarboard-fill me-2"></i>Enroll Now
                            </button>

                            <hr />

                            <h6 className="fw-bold mb-3">Other Categories</h6>
                            <ul className="list-unstyled mb-0">
                                {coursecategories.slice(0, 6).map((c) => (
                                    <li key={c.id} className="mb-2">
                                        <Link
                                            href={`/course/${c.id}/${c.slug}`}
                                            className="text-decoration-none text-muted small d-flex justify-content-between"
                                        >
                                            <span>{c.title}</span>
                                            {c.courses_count !== undefined && (
                                                <span className="badge bg-light text-dark">{c.courses_count}</span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
