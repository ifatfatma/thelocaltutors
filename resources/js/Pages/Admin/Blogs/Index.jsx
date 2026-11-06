import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ blog }) {
    const list = blog?.data || blog || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        router.delete(`/admin/blog/${id}`);
    };

    return (
        <AdminLayout title="Manage Blogs">
            <Head title="Blogs Management" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">All Blog Posts</h5>
                    <Link href="/admin/blog/create" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-circle me-1"></i>Add New Blog
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Author / Date</th>
                                <th>Status</th>
                                <th className="text-end" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No blogs published yet.
                                    </td>
                                </tr>
                            ) : (
                                list.map((b, idx) => (
                                    <tr key={b.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <img
                                                src={b.blog_image ? `/blog/thumbnail/${b.blog_image}` : '/front/img/noimage.jpg'}
                                                onError={(e) => { e.target.src = '/front/img/noimage.jpg'; }}
                                                alt={b.title}
                                                className="rounded-3 shadow-sm"
                                                style={{ width: '50px', height: '40px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td className="fw-semibold text-dark">{b.title}</td>
                                        <td className="small text-muted">
                                            {b.blog_by || 'Admin'} &bull; {b.date || new Date(b.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className={`badge ${b.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                {b.is_active === 1 ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Link
                                                    href={`/admin/blog/${b.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(b.id)}
                                                    className="btn btn-sm btn-outline-danger"
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

            {blog?.links && <Pagination links={blog.links} />}
        </AdminLayout>
    );
}
