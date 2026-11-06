import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ courses }) {
    const list = courses?.data || courses || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        router.delete(`/admin/course/${id}`);
    };

    return (
        <AdminLayout title="Manage Courses">
            <Head title="Courses Management" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">All Courses</h5>
                    <Link href="/admin/course/create" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-circle me-1"></i>Add New Course
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Thumbnail</th>
                                <th>Course Title</th>
                                <th>Category</th>
                                <th>Instructor</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th className="text-end" style={{ width: '160px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((c, idx) => (
                                    <tr key={c.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <img
                                                src={c.image ? `/course/thumbnail/${c.image}` : '/front/img/noimage.jpg'}
                                                onError={(e) => { e.target.src = '/front/img/noimage.jpg'; }}
                                                alt={c.name || c.title}
                                                className="rounded-3 shadow-sm"
                                                style={{ width: '50px', height: '40px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td className="fw-semibold text-dark">{c.name || c.title}</td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                {c.category?.title || '--'}
                                            </span>
                                        </td>
                                        <td className="small text-muted">{c.teacher?.name || '--'}</td>
                                        <td className="fw-bold text-primary">{c.price ? `₹${c.price}` : 'Free'}</td>
                                        <td>
                                            <span className={`badge ${c.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                {c.is_active === 1 ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Link
                                                    href={`/admin/course/${c.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
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

            {courses?.links && <Pagination links={courses.links} />}
        </AdminLayout>
    );
}
