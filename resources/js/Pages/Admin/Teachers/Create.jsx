import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        is_active: '1',
        type: 'teacher',
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((k) => data.append(k, form[k]));
        if (image) data.append('image', image);

        router.post('/admin/teacher', data, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title="Add New Teacher">
            <Head title="Create Teacher" />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
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

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Email *</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Mobile *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                value={form.mobile}
                                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                required
                            />
                            {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Username *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Password *</label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Status *</label>
                            <select
                                className="form-select"
                                value={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.value })}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Profile Photo (200x200)</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Add Teacher
                        </button>
                        <Link href="/admin/teacher" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
