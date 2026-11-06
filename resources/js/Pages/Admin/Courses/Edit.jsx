import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Edit({ course, teacherlist = [], coursecatlist = [] }) {
    const [form, setForm] = useState({
        name: course?.name || '',
        category_id: course?.category_id || '',
        teacher_id: course?.teacher_id || '',
        price: course?.price || '0',
        duration: course?.duration || '',
        description: course?.description || '',
        youtube_url: course?.youtube_url || '',
        is_active: course?.is_active !== undefined ? String(course.is_active) : '1',
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('_method', 'PUT');
        Object.keys(form).forEach((k) => data.append(k, form[k]));
        if (image) data.append('image', image);

        router.post(`/admin/course/${course.id}`, data, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title={`Edit Course: ${course?.name}`}>
            <Head title={`Edit Course: ${course?.name}`} />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">Course Name / Title *</label>
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
                            <label className="form-label fw-semibold">Category *</label>
                            <select
                                className="form-select"
                                value={form.category_id}
                                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {coursecatlist.map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Instructor / Teacher</label>
                            <select
                                className="form-select"
                                value={form.teacher_id}
                                onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                            >
                                <option value="0">Select Teacher</option>
                                {teacherlist.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Fee / Price (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Duration (Hours/Days)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">YouTube Preview URL</label>
                            <input
                                type="url"
                                className="form-control"
                                value={form.youtube_url}
                                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Status *</label>
                            <select
                                className="form-select"
                                value={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.value })}
                            >
                                <option value="1">Active / Published</option>
                                <option value="0">Draft / Hidden</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Change Thumbnail</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold">Description / Syllabus</label>
                            <textarea
                                rows="6"
                                className="form-control"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Update Course
                        </button>
                        <Link href="/admin/course" className="btn btn-outline-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
