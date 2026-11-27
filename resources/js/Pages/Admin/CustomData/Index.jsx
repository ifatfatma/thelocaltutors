import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ customdatas, keyname = 'state', parent_id = 0 }) {
    const list = customdatas?.data || customdatas || [];
    const [name, setName] = useState('');

    const types = [
        { key: 'state', label: 'States' },
        { key: 'board', label: 'Boards' },
        { key: 'qualification', label: 'Qualifications' },
        { key: 'teachmode', label: 'Teaching Modes' },
        { key: 'days', label: 'Days' },
        { key: 'subject', label: 'Subjects' },
        { key: 'teacher_rating', label: 'Teacher Ratings' },
    ];

    const currentType = new URLSearchParams(window.location.search).get('type') || keyname || 'state';

    const handleCreate = (e) => {
        e.preventDefault();
        router.post('/admin/customdata', {
            name,
            type: currentType,
            key_name: currentType,
            parent_id: parent_id || 0,
        }, {
            onSuccess: () => setName(''),
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        router.delete(`/admin/customdata/${id}`);
    };

    return (
        <AdminLayout title="Custom Data Configuration">
            <Head title="Custom Data" />

            {/* Type selector tabs */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
                <div className="d-flex flex-wrap gap-2">
                    {types.map((t) => (
                        <Link
                            key={t.key}
                            href={`/admin/customdata?type=${t.key}`}
                            className={`btn btn-sm ${
                                currentType === t.key ? 'btn-primary' : 'btn-outline-secondary'
                            }`}
                        >
                            {t.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="row g-4">
                {/* Form to add item */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Add to {currentType.toUpperCase()}</h5>
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Item Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. CBSE / Mathematics / Maharashtra"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Add Item
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table of items */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Items List ({currentType})</h5>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '60px' }}>#</th>
                                        <th>Name</th>
                                        <th>Sub-Items</th>
                                        <th className="text-end" style={{ width: '150px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">
                                                No items in this category.
                                            </td>
                                        </tr>
                                    ) : (
                                        list.map((item, idx) => (
                                            <tr key={item.id}>
                                                <td>{idx + 1}</td>
                                                <td className="fw-semibold text-dark">{item.name}</td>
                                                <td>
                                                    {item.subdata_count > 0 ? (
                                                        <Link
                                                            href={`/admin/customdata?type=${currentType}&parent_id=${item.id}`}
                                                            className="badge bg-primary text-decoration-none"
                                                        >
                                                            {item.subdata_count} Sub-items
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted small">0</span>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {customdatas?.links && <Pagination links={customdatas.links} />}
                </div>
            </div>
        </AdminLayout>
    );
}
