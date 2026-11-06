import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Edit({ role, permissions = [], rolePermissions = [] }) {
    const [name, setName] = useState(role?.name || '');
    const [selectedPermissions, setSelectedPermissions] = useState(
        Array.isArray(rolePermissions) ? rolePermissions : Object.values(rolePermissions || {})
    );
    const [errors, setErrors] = useState({});

    const handleTogglePermission = (id) => {
        if (selectedPermissions.includes(id)) {
            setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
        } else {
            setSelectedPermissions([...selectedPermissions, id]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/roles/${role.id}`, {
            name,
            permissions: selectedPermissions,
        }, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title="Edit Role">
            <Head title={`Edit Role: ${role?.name}`} />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Role Name *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold mb-3">Permissions</label>
                        <div className="row g-2">
                            {permissions.map((p) => (
                                <div key={p.id} className="col-sm-6 col-md-4 col-lg-3">
                                    <div className="form-check p-2 border rounded bg-light">
                                        <input
                                            type="checkbox"
                                            className="form-check-input ms-1 me-2"
                                            id={`perm_${p.id}`}
                                            checked={selectedPermissions.includes(p.id)}
                                            onChange={() => handleTogglePermission(p.id)}
                                        />
                                        <label className="form-check-label small" htmlFor={`perm_${p.id}`}>
                                            {p.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Update Role
                        </button>
                        <Link href="/admin/roles" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
