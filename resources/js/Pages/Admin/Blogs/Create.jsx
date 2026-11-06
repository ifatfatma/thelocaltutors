import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Create() {
    const [form, setForm] = useState({
        title: '',
        short_description: '',
        description: '',
        blog_by: 'Admin',
        date: new Date().toISOString().split('T')[0],
        is_active: '1',
    });
    const [blogImage, setBlogImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((k) => data.append(k, form[k]));
        if (blogImage) data.append('blog_image', blogImage);

        router.post('/admin/blog', data, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title="Add New Blog Post">
            <Head title="Create Blog" />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">Blog Title *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Author</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.blog_by}
                                onChange={(e) => setForm({ ...form, blog_by: e.target.value })}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Publish Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Status *</label>
                            <select
                                className="form-select"
                                value={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.value })}
                            >
                                <option value="1">Published</option>
                                <option value="0">Draft</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Blog Featured Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => setBlogImage(e.target.files[0])}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Short Excerpt</label>
                            <textarea
                                rows="2"
                                className="form-control"
                                placeholder="Short snippet for listings..."
                                value={form.short_description}
                                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Full Blog Content</label>
                            <textarea
                                rows="8"
                                className="form-control"
                                placeholder="Write full article here..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Publish Blog
                        </button>
                        <Link href="/admin/blog" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
