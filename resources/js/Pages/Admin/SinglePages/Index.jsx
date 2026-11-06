import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ singlepages }) {
    const list = singlepages?.data || singlepages || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this page?')) return;
        router.delete(`/admin/singlepages/${id}`);
    };

    return (
        <AdminLayout title="Single Pages (CMS)">
            <Head title="Single Pages" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">CMS Content Pages</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th>Page Title</th>
                                <th>Key Identifier</th>
                                <th>Status</th>
                                <th className="text-end" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((page) => (
                                <tr key={page.id}>
                                    <td>{page.id}</td>
                                    <td className="fw-semibold text-dark">{page.title}</td>
                                    <td>
                                        <code>{page.key_name || `--`}</code>
                                    </td>
                                    <td>
                                        <span className={`badge ${page.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                            {page.is_active === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-1">
                                            <Link
                                                href={`/admin/singlepages/${page.id}/edit`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(page.id)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {singlepages?.links && <Pagination links={singlepages.links} />}
        </AdminLayout>
    );
}
