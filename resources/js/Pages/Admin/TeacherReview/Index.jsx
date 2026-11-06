import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ teacher_review }) {
    const list = teacher_review?.data || teacher_review || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this teacher review?')) return;
        router.delete(`/admin/teacher_review/${id}`);
    };

    return (
        <AdminLayout title="Teacher Reviews">
            <Head title="Teacher Reviews" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Student Reviews on Teachers</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Student</th>
                                <th>Teacher</th>
                                <th>Rating</th>
                                <th>Review Message</th>
                                <th>Date</th>
                                <th className="text-end" style={{ width: '120px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        No teacher reviews found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td>{idx + 1}</td>
                                        <td className="fw-semibold text-dark">{item.reviewer?.name || '--'}</td>
                                        <td>{item.teacher?.name || '--'}</td>
                                        <td className="text-warning">
                                            {'★'.repeat(item.teacher_rating || 5)}
                                        </td>
                                        <td className="small text-muted">{item.teacher_review}</td>
                                        <td className="small text-muted">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {teacher_review?.links && <Pagination links={teacher_review.links} />}
        </AdminLayout>
    );
}
