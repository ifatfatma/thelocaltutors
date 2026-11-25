import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import RichTextEditor from '../../../components/RichTextEditor';

export default function Create({ teacherlist = [], coursecatlist = [] }) {
    const [form, setForm] = useState({
        name: '',
        category_id: coursecatlist[0]?.id || '',
        teacher_id: teacherlist[0]?.id || '',
        teaching_mode: 'Home / Online',
        price: '0',
        price_type: 'one_time',
        duration: '',
        description: '',
        youtube_url: '',
        is_active: '1',
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach((k) => data.append(k, form[k]));
        if (image) data.append('image', image);

        router.post('/admin/course', data, {
            onError: (errs) => setErrors(errs),
        });
    };

    return (
        <AdminLayout title="Add New Course">
            <Head title="Create Course" />

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
                            <label className="form-label fw-semibold">Teaching Mode *</label>
                            <select
                                className="form-select"
                                value={form.teaching_mode}
                                onChange={(e) => setForm({ ...form, teaching_mode: e.target.value })}
                            >
                                <option value="Home / Online">Both (Home &amp; Online)</option>
                                <option value="Home Tuition">Home Tuition (Offline)</option>
                                <option value="Interactive Online">Interactive Online</option>
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
                            <label className="form-label fw-semibold">Pricing Model *</label>
                            <select
                                className="form-select"
                                value={form.price_type}
                                onChange={(e) => setForm({ ...form, price_type: e.target.value })}
                            >
                                <option value="one_time">One-Time Complete Course Fee</option>
                                <option value="per_month">Per Month (Monthly Tuition Fee)</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Duration (Hours/Days)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. 40 Hours"
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">YouTube Preview URL</label>
                            <input
                                type="url"
                                className="form-control"
                                placeholder="https://www.youtube.com/watch?v=..."
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
                            <label className="form-label fw-semibold">Thumbnail Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
                                <span>Description / Syllabus</span>
                                <span className="text-muted fw-normal small">Rich HTML Editor</span>
                            </label>
                            <RichTextEditor
                                value={form.description}
                                onChange={(val) => setForm({ ...form, description: val })}
                                placeholder="Write detailed course syllabus, what students will learn, highlights..."
                                minHeight="220px"
                            />
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Save Course
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
