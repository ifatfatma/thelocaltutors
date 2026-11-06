import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Edit({ user, roles = [], userRoles = [] }) {
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        roles: Array.isArray(userRoles) ? userRoles : Object.values(userRoles || {}),
    });
    const [errors, setErrors] = useState({});

    const handleRoleChange = (roleName) => {
        if (form.roles.includes(roleName)) {
            setForm({ ...form, roles: form.roles.filter((r) => r !== roleName) });
        } else {
            setForm({ ...form, roles: [...form.roles, roleName] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/admin/users/${user.id}`, form, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title={`Edit User: ${user?.name}`}>
            <Head title={`Edit User: ${user?.name}`} />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Name *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Email Address *</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Password (Leave blank to keep unchanged)</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold mb-2">Assign Roles</label>
                            <div className="d-flex flex-wrap gap-3">
                                {roles.map((r, idx) => {
                                    const rName = typeof r === 'string' ? r : r.name;
                                    return (
                                        <div key={idx} className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`role_edit_${idx}`}
                                                checked={form.roles.includes(rName)}
                                                onChange={() => handleRoleChange(rName)}
                                            />
                                            <label className="form-check-label" htmlFor={`role_edit_${idx}`}>
                                                {rName}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Update User
                        </button>
                        <Link href="/admin/users" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
