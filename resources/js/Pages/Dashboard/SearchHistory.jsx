import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';

export default function SearchHistory({ searchlist }) {
    const list = searchlist?.data || searchlist || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this search history record?')) return;
        router.delete(`/searchhistory/${id}/delete`);
    };

    return (
        <FrontLayout>
            <Head title="Search History" />

            <div className="bg-primary text-white py-4">
                <div className="container">
                    <h2 className="fw-bold mb-1">Search History</h2>
                    <p className="text-white-50 mb-0">Review and re-run your previous queries</p>
                </div>
            </div>

            <div className="container py-5">
                {list.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-clock-history fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">No search history recorded yet.</h4>
                        <Link href="/" className="btn btn-primary mt-2">Start a Search</Link>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Looking For</th>
                                        <th>Subject</th>
                                        <th>Location</th>
                                        <th>Board / Mode</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item) => (
                                        <tr key={item.id}>
                                            <td className="small text-muted">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-subtle text-primary text-capitalize">
                                                    {item.lookingfor || 'Teacher'}
                                                </span>
                                            </td>
                                            <td className="small">{item.subject || 'All Subjects'}</td>
                                            <td className="small">
                                                {[item.city, item.district].filter(Boolean).join(', ') || 'Any'}
                                            </td>
                                            <td className="small">{item.board || 'Any'}</td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Link
                                                        href={`/searchhistory/result/${item.id}`}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="bi bi-arrow-repeat me-1"></i>View Results
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
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
                )}

                {searchlist?.links && <Pagination links={searchlist.links} />}
            </div>
        </FrontLayout>
    );
}
