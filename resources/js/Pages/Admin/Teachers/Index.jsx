import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ teachers, sq = '' }) {
    const list = teachers?.data || teachers || [];
    const [search, setSearch] = useState(sq);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/teacher', { sq: search });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this teacher?')) return;
        router.delete(`/admin/teacher/${id}`);
    };

    return (
        <AdminLayout title="Teachers Management">
            <Head title="Teachers Directory" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <h5 className="mb-0 fw-bold">Teachers Directory</h5>
                    <div className="d-flex gap-2">
                        <form onSubmit={handleSearch} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search teacher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="btn btn-outline-secondary btn-sm">
                                Search
                            </button>
                        </form>
                        <Link href="/admin/teacher/create" className="btn btn-primary btn-sm flex-shrink-0">
                            <i className="bi bi-plus-circle me-1"></i>Add Teacher
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th className="text-end" style={{ width: '220px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        No teachers found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((t, idx) => (
                                    <tr key={t.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <img
                                                src={t.image ? `/user/thumbnail/${t.image}` : '/front/img/noprofileimage.png'}
                                                onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                                alt={t.name}
                                                className="rounded-circle shadow-sm"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td className="fw-semibold text-dark">{t.name}</td>
                                        <td className="small text-muted">{t.email || '--'}</td>
                                        <td className="small">{t.mobile || '--'}</td>
                                        <td>
                                            <span className={`badge ${t.is_active === 1 ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {t.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="small text-muted">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Link
                                                    href={`/admin/teacher/${t.id}`}
                                                    className="btn btn-sm btn-outline-info"
                                                    title="View Profile"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>
                                                <Link
                                                    href={`/admin/teacher/${t.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Edit Basic"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <Link
                                                    href={`/admin/teacher/updatemore/${t.id}`}
                                                    className="btn btn-sm btn-outline-secondary"
                                                    title="Update Details"
                                                >
                                                    <i className="bi bi-gear"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
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

            {teachers?.links && <Pagination links={teachers.links} />}
        </AdminLayout>
    );
}
