import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create({ permissions = [] }) {
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [errors, setErrors] = useState({});

    const handleTogglePermission = (id) => {
        if (selectedPermissions.includes(id)) {
            setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
        } else {
            setSelectedPermissions([...selectedPermissions, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === permissions.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(permissions.map((p) => p.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/admin/roles', {
            name,
            permissions: selectedPermissions,
        }, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title="Create Role">
            <Head title="Create Role" />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Role Name *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="e.g. Manager, Content Editor"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <label className="form-label fw-semibold mb-0">Assign Permissions</label>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="btn btn-sm btn-outline-secondary"
                            >
                                {selectedPermissions.length === permissions.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

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
                            Save Role
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
