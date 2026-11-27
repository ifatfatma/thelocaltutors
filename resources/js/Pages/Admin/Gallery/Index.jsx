import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ gallery }) {
    const list = gallery?.data || gallery || [];
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [isActive, setIsActive] = useState('1');
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', title);
        data.append('is_active', isActive);
        if (image) data.append('gallery_image', image);

        if (editingId) {
            data.append('_method', 'PUT');
            router.post(`/admin/gallery/${editingId}`, data, {
                onSuccess: () => {
                    setEditingId(null);
                    setTitle('');
                    setImage(null);
                },
            });
        } else {
            router.post('/admin/gallery', data, {
                onSuccess: () => {
                    setTitle('');
                    setImage(null);
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this gallery item?')) return;
        router.delete(`/admin/gallery/${id}`);
    };

    return (
        <AdminLayout title="Manage Gallery">
            <Head title="Gallery Management" />

            <div className="row g-4">
                {/* Form card */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">{editingId ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Photo Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Annual Student Seminar"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Status</label>
                                <select
                                    className="form-select"
                                    value={isActive}
                                    onChange={(e) => setIsActive(e.target.value)}
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Photo File</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required={!editingId}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary w-100">
                                    {editingId ? 'Update Photo' : 'Upload Photo'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setEditingId(null);
                                            setTitle('');
                                            setImage(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List card */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Gallery Photos</h5>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Photo</th>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th className="text-end" style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                No gallery photos found.
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((item, idx) => (
                                            <tr key={item.id}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    <img
                                                        src={`/gallery/thumbnail/${item.gallery_image}`}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = `/gallery/${item.gallery_image}`;
                                                        }}
                                                        alt={item.title}
                                                        className="rounded-3 shadow-sm"
                                                        style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td className="fw-semibold text-dark">{item.title || 'Untitled'}</td>
                                                <td>
                                                    <span className={`badge ${item.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                        {item.is_active === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(item.id);
                                                                setTitle(item.title || '');
                                                                setIsActive(item.is_active !== undefined ? String(item.is_active) : '1');
                                                            }}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="btn btn-sm btn-outline-danger"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {gallery?.links && <Pagination links={gallery.links} />}
                </div>
            </div>
        </AdminLayout>
    );
}
