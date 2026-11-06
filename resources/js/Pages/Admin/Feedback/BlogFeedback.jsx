import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function BlogFeedback({ blogfeedback }) {
    const list = blogfeedback?.data || blogfeedback || [];

    const handleAccept = (id) => {
        router.get(`/admin/blogfeedback/accept/${id}`);
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        router.delete(`/admin/blogfeedback/${id}/delete`);
    };

    return (
        <AdminLayout title="Blog Comments &amp; Feedback">
            <Head title="Blog Comments" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Comments Moderation</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>User</th>
                                <th>Blog Post</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th className="text-end" style={{ width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        No blog comments found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td className="fw-semibold text-dark">{item.user?.name || '--'}</td>
                                        <td className="small">{item.blog?.title || '--'}</td>
                                        <td className="text-warning">
                                            {'★'.repeat(item.rating || 5)}
                                        </td>
                                        <td className="small text-muted">{item.blogfeedback}</td>
                                        <td>
                                            <span className={`badge ${item.is_active === 1 ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {item.is_active === 1 ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                {item.is_active !== 1 && (
                                                    <button
                                                        onClick={() => handleAccept(item.id)}
                                                        className="btn btn-sm btn-outline-success"
                                                        title="Approve"
                                                    >
                                                        <i className="bi bi-check-lg"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {blogfeedback?.links && <Pagination links={blogfeedback.links} />}
        </AdminLayout>
    );
}
