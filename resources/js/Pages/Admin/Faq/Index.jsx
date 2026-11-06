import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ faq }) {
    const list = faq?.data || faq || [];
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState('1');
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            router.put(`/admin/faq/${editingId}`, {
                title,
                description,
                is_active: isActive,
            }, {
                onSuccess: () => {
                    setEditingId(null);
                    setTitle('');
                    setDescription('');
                },
            });
        } else {
            router.post('/admin/faq', {
                title,
                description,
                is_active: isActive,
            }, {
                onSuccess: () => {
                    setTitle('');
                    setDescription('');
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        router.delete(`/admin/faq/${id}`);
    };

    return (
        <AdminLayout title="Manage Site FAQs">
            <Head title="Site FAQs" />

            <div className="row g-4">
                {/* Form */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Question *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
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

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Answer *</label>
                                <textarea
                                    rows="5"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary w-100">
                                    {editingId ? 'Update FAQ' : 'Save FAQ'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setEditingId(null);
                                            setTitle('');
                                            setDescription('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">All FAQs</h5>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '50px' }}>#</th>
                                        <th>Question</th>
                                        <th>Status</th>
                                        <th className="text-end" style={{ width: '130px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">
                                                No FAQs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((f, idx) => (
                                            <tr key={f.id}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    <div className="fw-semibold text-dark">{f.title}</div>
                                                    <div className="small text-muted text-truncate" style={{ maxWidth: '350px' }}>
                                                        {f.description}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${f.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                                        {f.is_active === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(f.id);
                                                                setTitle(f.title || '');
                                                                setDescription(f.description || '');
                                                                setIsActive(f.is_active !== undefined ? String(f.is_active) : '1');
                                                            }}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(f.id)}
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

                    {faq?.links && <Pagination links={faq.links} />}
                </div>
            </div>
        </AdminLayout>
    );
}
