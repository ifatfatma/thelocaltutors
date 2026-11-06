import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
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
                    <h3>Article not found</h3>
                    <Link href="/blogs" className="btn btn-primary mt-3">Back to Blogs</Link>
                </div>
            </FrontLayout>
        );
    }

    return (
        <FrontLayout>
            <Head title={blogdetails.title} />

            <div className="bg-primary text-white py-5">
                <div className="container">
                    <span className="badge bg-light text-primary mb-2">Blog Post</span>
                    <h1 className="fw-bold mb-3">{blogdetails.title}</h1>
                    <div className="text-white-50 small">
                        <i className="bi bi-calendar3 me-1"></i>
                        Published on {new Date(blogdetails.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row gy-4">
                    {/* Main Blog Content */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                            <img
                                src={blogdetails.image ? `/blog/${blogdetails.image}` : '/front/img/noimage.jpg'}
                                alt={blogdetails.title}
                                className="img-fluid w-100"
                                style={{ maxHeight: '420px', objectFit: 'cover' }}
                            />

                            <div className="card-body p-4 p-md-5">
                                <div
                                    className="blog-content text-muted fs-6 lh-lg"
                                    dangerouslySetInnerHTML={{ __html: blogdetails.description }}
                                />
                            </div>
                        </div>

                        {/* Comments / Feedback */}
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">
                            <h4 className="fw-bold mb-4">Comments &amp; Feedback</h4>

                            {feedbackMsg && (
                                <div className="alert alert-info">{feedbackMsg}</div>
                            )}

                            {auth?.user ? (
                                <form onSubmit={handleSubmitComment} className="mb-5 p-3 bg-light rounded-3">
                                    <h6 className="fw-bold mb-3">Leave a Comment</h6>
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
                                            <label className="form-label small fw-semibold">Your Thoughts</label>
                                            <textarea
                                                rows="3"
                                                className="form-control"
                                                placeholder="Share your thoughts on this article..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm px-4 fw-semibold"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Posting...' : 'Submit Comment'}
                                    </button>
                                </form>
                            ) : (
                                <div className="alert alert-light border mb-4">
                                    <Link href="/login" className="fw-semibold text-primary">Login</Link> to post a comment.
                                </div>
                            )}

                            {feedbacklist.length === 0 ? (
                                <p className="text-muted small">No comments yet.</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {feedbacklist.map((f) => (
                                        <div key={f.id} className="border-bottom pb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <strong className="text-dark">{f.user?.name || 'Reader'}</strong>
                                                <span className="text-warning small">
                                                    {'★'.repeat(f.rating || 5)}{'☆'.repeat(5 - (f.rating || 5))}
                                                </span>
                                            </div>
                                            <p className="text-muted small mb-1">{f.blogfeedback}</p>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                {new Date(f.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Recent posts */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-3">Recent Articles</h5>
                            <div className="d-flex flex-column gap-3">
                                {bloglist.map((b) => (
                                    <div key={b.id} className="d-flex gap-3 align-items-center">
                                        <img
                                            src={b.image ? `/blog/${b.image}` : '/front/img/noimage.jpg'}
                                            alt={b.title}
                                            className="rounded-3 flex-shrink-0"
                                            style={{ width: '70px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <Link
                                                href={`/blog_details/${b.id}`}
                                                className="text-dark text-decoration-none fw-semibold small d-block"
                                            >
                                                {b.title}
                                            </Link>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                {new Date(b.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
