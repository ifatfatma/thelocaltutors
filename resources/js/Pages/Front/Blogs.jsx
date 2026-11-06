import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function Blogs({ bloglist = [] }) {
    const list = Array.isArray(bloglist) ? bloglist : (bloglist?.data || []);

    return (
        <FrontLayout>
            <Head title="Blogs & Articles" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2">Blogs &amp; Insights</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Blogs</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                {list.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-newspaper fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">No blog posts published yet.</h4>
                        <Link href="/" className="btn btn-primary mt-3">Back to Home</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((blog) => (
                            <div key={blog.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                    <img
                                        src={blog.image ? `/blog/${blog.image}` : '/front/img/noimage.jpg'}
                                        alt={blog.title}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                                            <i className="bi bi-calendar-event"></i>
                                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h5 className="fw-bold mb-2">
                                            <Link
                                                href={`/blog_details/${blog.id}`}
                                                className="text-dark text-decoration-none"
                                            >
                                                {blog.title}
                                            </Link>
                                        </h5>
                                        <p className="text-muted small flex-grow-1">
                                            {blog.short_description || (blog.description ? blog.description.substring(0, 95) + '...' : '')}
                                        </p>
                                        <Link
                                            href={`/blog_details/${blog.id}`}
                                            className="text-primary fw-semibold small text-decoration-none mt-3"
                                        >
                                            Read Article &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FrontLayout>
    );
}
