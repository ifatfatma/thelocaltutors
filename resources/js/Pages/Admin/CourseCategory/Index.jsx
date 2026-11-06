import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ course_category }) {
    const list = course_category?.data || course_category || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        router.delete(`/admin/course_category/${id}`);
    };

    return (
        <AdminLayout title="Course Categories">
            <Head title="Course Categories" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Categories List</h5>
                    <Link href="/admin/course_category/create" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-circle me-1"></i>Add Category
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Icon / Image</th>
                                <th>Title</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th className="text-end" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((cat, idx) => (
                                    <tr key={cat.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <img
                                                src={cat.image ? `/coursecategory/thumbnail/${cat.image}` : '/front/img/noimage.jpg'}
                                                onError={(e) => { e.target.src = '/front/img/noimage.jpg'; }}
                                                alt={cat.title}
                                                className="rounded-3 shadow-sm"
                                                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td className="fw-semibold text-dark">{cat.title}</td>
                                        <td className="small text-muted">{cat.slug}</td>
                                        <td>
                                            <span className={`badge ${cat.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                {cat.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Link
                                                    href={`/admin/course_category/${cat.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
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

            {course_category?.links && <Pagination links={course_category.links} />}
        </AdminLayout>
    );
}
