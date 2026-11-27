import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import { cleanExcerpt } from '../../Utils/text';
import axios from 'axios';

export default function BlogDetails({ blogdetails, bloglist = [], feedbacklist = [] }) {
    const { auth } = usePage().props;
    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedbackMsg('');

        try {
            const res = await axios.get('/blogfeedbackpost', {
                params: {
                    blog_id: blogdetails?.id,
                    rating,
                    blogfeedback: comment,
                },
            });
            if (res.data.status === 200) {
                setFeedbackMsg('Your comment has been submitted for moderation. Thank you!');
                setComment('');
            } else {
                setFeedbackMsg(res.data.message || 'Submission failed.');
            }
        } catch (err) {
            setFeedbackMsg('Please login to leave a comment.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!blogdetails) {
        return (
            <FrontLayout>
                <div className="container py-5 text-center">
                    <div className="p-4 bg-white rounded-4 border d-inline-block shadow-sm">
                        <i className="bi bi-journal-x fs-1 text-secondary mb-3 d-block"></i>
                        <h3 className="fw-bold text-dark">Article Not Found</h3>
                        <p className="text-secondary small mb-4">The article you are looking for may have been moved or unpublished.</p>
                        <Link href="/blogs" className="btn btn-primary-gradient rounded-pill px-4">
                            Browse All Articles
                        </Link>
                    </div>
                </div>
            </FrontLayout>
        );
    }

    const cleanSnippet = cleanExcerpt(blogdetails.description, 150);

    return (
        <FrontLayout>
            <Head>
                <title>{`${blogdetails.title} - The Local Tutors Blog`}</title>
                <meta name="description" content={cleanSnippet} />
                <meta property="og:title" content={blogdetails.title} />
                <meta property="og:description" content={cleanSnippet} />
                <meta property="og:type" content="article" />
            </Head>

            {/* Modern Clean Header */}
            <div className="bg-white border-bottom py-5 hero-wrapper">
                <div className="container">
                    <div className="mx-auto" style={{ maxWidth: '860px' }}>
                        <nav aria-label="breadcrumb" className="mb-3">
                            <ol className="breadcrumb mb-0 small">
                                <li className="breadcrumb-item">
                                    <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link href="/blogs" className="text-secondary text-decoration-none">Blogs</Link>
                                </li>
                                <li className="breadcrumb-item active text-primary fw-semibold text-truncate" aria-current="page" style={{ maxWidth: '300px' }}>
                                    {blogdetails.title}
                                </li>
                            </ol>
                        </nav>

                        <span className="badge badge-soft-primary text-primary px-3 py-1 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-1">
                            <i className="bi bi-tag-fill small"></i>
                            <span>Academic &amp; Learning Insights</span>
                        </span>

                        <h1 className="fw-bold display-6 text-dark mb-3 lh-sm">
                            {blogdetails.title}
                        </h1>

                        <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small pt-2 border-top">
                            <span className="d-inline-flex align-items-center gap-1">
                                <i className="bi bi-calendar3 text-primary"></i>
                                {new Date(blogdetails.created_at).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            <span>•</span>
                            <span className="d-inline-flex align-items-center gap-1">
                                <i className="bi bi-clock text-primary"></i>
                                4 min read
                            </span>
                            <span>•</span>
                            <span className="d-inline-flex align-items-center gap-1">
                                <i className="bi bi-shield-check text-success"></i>
                                Verified Educational Guide
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row gy-4">
                    {/* Main Blog Article */}
                    <div className="col-lg-8">
                        <article className="card card-modern overflow-hidden mb-4">
                            <div className="position-relative" style={{ maxHeight: '440px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                                <img
                                    src={
                                        blogdetails.image && blogdetails.image.startsWith('http')
                                            ? blogdetails.image
                                            : (blogdetails.image ? `/blog/${blogdetails.image}` : '/front/img/noimage.jpg')
                                    }
                                    alt={`Featured cover image for ${blogdetails.title}`}
                                    className="img-fluid w-100 object-fit-cover"
                                    style={{ maxHeight: '440px' }}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                                    }}
                                />
                            </div>

                            <div className="card-body p-4 p-md-5">
                                <div
                                    className="blog-content text-dark fs-6 lh-lg"
                                    dangerouslySetInnerHTML={{ __html: blogdetails.description }}
                                />
                            </div>
                        </article>

                        {/* Comments / Reader Feedback */}
                        <div className="card card-modern p-4 p-md-5 mb-4">
                            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                                <div>
                                    <h4 className="fw-bold mb-1 text-dark">Discussion &amp; Feedback</h4>
                                    <p className="text-secondary small mb-0">Share your thoughts or questions about this topic</p>
                                </div>
                                <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill small">
                                    {feedbacklist.length} {feedbacklist.length === 1 ? 'Comment' : 'Comments'}
                                </span>
                            </div>

                            {feedbackMsg && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {feedbackMsg}
                                </div>
                            )}

                            {auth?.user ? (
                                <form onSubmit={handleSubmitComment} className="mb-5 p-4 bg-light rounded-4 border">
                                    <h6 className="fw-bold mb-3 text-dark">Leave Your Comment</h6>
                                    <div className="row g-3 mb-3">
                                        <div className="col-sm-5">
                                            <label className="form-label small fw-semibold text-secondary">Rating</label>
                                            <select
                                                className="form-select"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                                                <option value="4">⭐⭐⭐⭐ 4 Stars (Very Helpful)</option>
                                                <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                                                <option value="2">⭐⭐ 2 Stars (Average)</option>
                                                <option value="1">⭐ 1 Star (Needs Improvement)</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label small fw-semibold text-secondary">Your Comment / Question</label>
                                            <textarea
                                                rows="3"
                                                className="form-control"
                                                placeholder="Write your feedback, questions, or experience..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary-gradient rounded-pill px-4 fw-semibold"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Post Comment'}
                                    </button>
                                </form>
                            ) : (
                                <div className="p-4 bg-light rounded-4 border text-center mb-4">
                                    <p className="text-secondary mb-2 small">Sign in to participate in the discussion and leave a rating.</p>
                                    <Link href="/login" className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-semibold">
                                        Log In to Comment
                                    </Link>
                                </div>
                            )}

                            {feedbacklist.length === 0 ? (
                                <div className="text-center py-4 text-secondary small">
                                    <i className="bi bi-chat-dots fs-3 d-block mb-2 text-muted"></i>
                                    No comments yet. Be the first to share your thoughts!
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {feedbacklist.map((f) => (
                                        <div key={f.id} className="p-3 rounded-3 bg-light border">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className="text-dark small">{f.user?.name || 'Verified Reader'}</strong>
                                                <span className="text-warning small">
                                                    {(() => {
                                                        const r = Math.min(5, Math.max(0, Math.round(Number(f.rating) || 5)));
                                                        return `${'★'.repeat(r)}${'☆'.repeat(5 - r)}`;
                                                    })()}
                                                </span>
                                            </div>
                                            <p className="text-secondary small mb-1">{f.blogfeedback}</p>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                {new Date(f.created_at).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '90px' }}>
                            {/* Consultation CTA Widget */}
                            <div className="card card-modern p-4 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
                                <span className="badge bg-white text-primary mb-3 px-3 py-1 rounded-pill small fw-bold d-inline-block align-self-start">
                                    Free Consultation
                                </span>
                                <h5 className="fw-bold mb-2">Need a Tutor for Your Child?</h5>
                                <p className="text-white-50 small mb-3">
                                    Get connected with verified home and online teachers for CBSE, ICSE, WBBSE, and Core Mathematics across Kolkata.
                                </p>
                                <div className="d-flex flex-column gap-2 mb-3">
                                    <a
                                        href="https://wa.me/917003578764"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-light rounded-pill fw-semibold text-primary d-inline-flex align-items-center justify-content-center gap-2"
                                    >
                                        <i className="bi bi-whatsapp text-success"></i>
                                        WhatsApp 7003578764
                                    </a>
                                    <Link
                                        href="/contact"
                                        className="btn btn-outline-light rounded-pill fw-semibold"
                                    >
                                        Request Free Trial
                                    </Link>
                                </div>
                                <span className="small text-white-50 text-center" style={{ fontSize: '11px' }}>
                                    100% Free Consultation • No Obligation
                                </span>
                            </div>

                            {/* Recent Articles */}
                            <div className="card card-modern p-4">
                                <h5 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                                    <i className="bi bi-newspaper text-primary"></i>
                                    <span>Recent Articles</span>
                                </h5>
                                <div className="d-flex flex-column gap-3">
                                    {bloglist.map((b) => (
                                        <div key={b.id} className="d-flex gap-3 align-items-start pb-3 border-bottom last-border-0">
                                            <img
                                                src={
                                                    b.image && b.image.startsWith('http')
                                                        ? b.image
                                                        : (b.image ? `/blog/${b.image}` : '/front/img/noimage.jpg')
                                                }
                                                alt={`Thumbnail for ${b.title}`}
                                                className="rounded-3 flex-shrink-0 object-fit-cover"
                                                style={{ width: '72px', height: '62px' }}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80';
                                                }}
                                            />
                                            <div className="flex-grow-1">
                                                <Link
                                                    href={`/blog_details/${b.id}`}
                                                    className="text-dark text-decoration-none fw-semibold small d-block text-hover-primary lh-sm mb-1"
                                                >
                                                    {b.title}
                                                </Link>
                                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                                    <i className="bi bi-calendar3 me-1"></i>
                                                    {new Date(b.created_at).toLocaleDateString('en-IN', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
