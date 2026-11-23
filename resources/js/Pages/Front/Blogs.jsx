import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import { cleanExcerpt } from '../../Utils/text';

export default function Blogs({ bloglist = [] }) {
    const list = Array.isArray(bloglist) ? bloglist : (bloglist?.data || []);

    return (
        <FrontLayout>
            <Head>
                <title>Educational Blogs &amp; Study Guides - The Local Tutors</title>
                <meta name="description" content="Read expert tips on board exam preparation, TIF Core Mathematics, Artificial Intelligence, and computer literacy from verified educators in Kolkata." />
            </Head>

            {/* Header */}
            <div className="bg-white border-bottom py-5 hero-wrapper">
                <div className="container text-center">
                    <span className="badge badge-soft-primary text-primary px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-2 shadow-2xs">
                        <i className="bi bi-book-half text-primary"></i>
                        <span>Academic Insights &amp; Guidance</span>
                    </span>
                    <h1 className="fw-bold display-6 text-dark mb-2">Educational Guides &amp; Insights</h1>
                    <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
                        Practical study methodologies, board exam strategies for CBSE, ICSE, and WBBSE, and guides on mathematics, AI, and computer skills.
                    </p>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0 small">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-secondary text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">Blogs</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5 flex-grow-1 d-flex flex-column justify-content-center">
                {list.length === 0 ? (
                    <div className="text-center py-5 my-auto bg-white rounded-4 border p-5">
                        <div className="rounded-circle bg-light d-inline-flex p-4 mb-3 shadow-xs">
                            <i className="bi bi-newspaper fs-1 text-primary"></i>
                        </div>
                        <h4 className="fw-bold text-dark">No Blog Posts Published Yet</h4>
                        <p className="text-muted mx-auto" style={{ maxWidth: '420px' }}>
                            We are currently preparing insightful articles, exam tips, and study resources. Check back soon!
                        </p>
                        <Link href="/" className="btn btn-primary-gradient rounded-pill px-4 py-2 mt-3 fw-semibold shadow-xs">Back to Home</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((blog) => {
                            const cleanDesc = cleanExcerpt(
                                blog.short_desc || blog.short_description || blog.description,
                                110,
                                'Read our in-depth academic study guide and exam tips.'
                            );

                            return (
                                <div key={blog.id} className="col-md-6 col-lg-4">
                                    <div className="card card-modern h-100 overflow-hidden d-flex flex-column">
                                        <div className="position-relative overflow-hidden" style={{ height: '210px', backgroundColor: '#e2e8f0' }}>
                                            <img
                                                src={blog.image && blog.image.startsWith('http') ? blog.image : (blog.image ? `/blog/${blog.image}` : '/front/img/default-blog.png')}
                                                alt={`Cover image for ${blog.title}`}
                                                className="w-100 h-100 object-fit-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80';
                                                }}
                                            />
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column flex-grow-1">
                                            <div className="text-muted small mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                                                <i className="bi bi-calendar-event"></i>
                                                <span>{blog.date || (blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Recent')}</span>
                                                {blog.blog_by && (
                                                    <>
                                                        <span>&bull;</span>
                                                        <span>{blog.blog_by}</span>
                                                    </>
                                                )}
                                            </div>
                                            <h5 className="fw-bold mb-2">
                                                <Link
                                                    href={`/blog_details/${blog.id}`}
                                                    className="text-dark text-decoration-none text-hover-primary"
                                                >
                                                    {blog.title}
                                                </Link>
                                            </h5>
                                            <p className="text-secondary small flex-grow-1 mb-3">
                                                {cleanDesc}
                                            </p>
                                            <Link
                                                href={`/blog_details/${blog.id}`}
                                                className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 fw-semibold align-self-start mt-auto"
                                            >
                                                Read Article &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}
