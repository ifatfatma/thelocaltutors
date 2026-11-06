import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ users }) {
    const list = users?.data || users || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        router.delete(`/admin/users/${id}`);
    };

    return (
        <AdminLayout title="Manage Users">
            <Head title="Users Management" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Users Directory</h5>
                    <Link href="/admin/users/create" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-circle me-1"></i>Add New User
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Type / Roles</th>
                                <th className="text-end" style={{ width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((u, idx) => {
                                const roles = u.roles ? u.roles.map((r) => r.name || r) : [];
                                return (
                                    <tr key={u.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src={u.image ? `/user/${u.image}` : '/front/img/noprofileimage.png'}
                                                    onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                                    alt={u.name}
                                                    className="rounded-circle"
                                                    style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                                />
                                                <span className="fw-semibold text-dark">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="small text-muted">{u.email || '--'}</td>
                                        <td className="small">{u.mobile || '--'}</td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {u.type && (
                                                    <span className="badge bg-primary-subtle text-primary text-uppercase">
                                                        {u.type}
                                                    </span>
                                                )}
                                                {roles.map((r, rIdx) => (
                                                    <span key={rIdx} className="badge bg-secondary-subtle text-secondary">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link
                                                    href={`/admin/users/${u.id}/edit`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {users?.links && <Pagination links={users.links} />}
        </AdminLayout>
    );
}
