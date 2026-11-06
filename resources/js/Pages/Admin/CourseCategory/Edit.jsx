import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Edit({ course_category }) {
    const [title, setTitle] = useState(course_category?.title || '');
    const [description, setDescription] = useState(course_category?.description || '');
    const [isActive, setIsActive] = useState(
        course_category?.is_active !== undefined ? String(course_category.is_active) : '1'
    );
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('title', title);
        data.append('description', description);
        data.append('is_active', isActive);
        if (image) data.append('image', image);

        router.post(`/admin/course_category/${course_category.id}`, data, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title={`Edit Category: ${course_category?.title}`}>
            <Head title={`Edit Category: ${course_category?.title}`} />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">Category Title *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Status *</label>
                            <select
                                className="form-select"
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Change Icon / Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Description</label>
                            <textarea
                                rows="4"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Update Category
                        </button>
                        <Link href="/admin/course_category" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
