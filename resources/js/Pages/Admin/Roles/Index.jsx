import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ roles }) {
    const list = roles?.data || roles || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        router.delete(`/admin/roles/${id}`);
    };

    return (
        <AdminLayout title="Manage Roles">
            <Head title="Roles Management" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Roles List</h5>
                    <Link href="/admin/roles/create" className="btn btn-primary btn-sm">
                        <i className="bi bi-plus-circle me-1"></i>Add New Role
                    </Link>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th>Role Name</th>
                                <th>Assigned Permissions</th>
                                <th className="text-end" style={{ width: '200px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((role, idx) => (
                                <tr key={role.id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <span className="fw-semibold text-dark">{role.name}</span>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                role.permissions.map((p) => (
                                                    <span key={p.id || p.name} className="badge bg-secondary-subtle text-secondary small">
                                                        {p.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-muted small">No permissions</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link
                                                href={`/admin/roles/${role.id}/edit`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>
                                            {role.name !== 'Super Admin' && (
                                                <button
                                                    onClick={() => handleDelete(role.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {roles?.links && <Pagination links={roles.links} />}
        </AdminLayout>
    );
}
