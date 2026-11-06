import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../Components/Pagination';

export default function Index({ message }) {
    const list = message?.data || message || [];

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        router.delete(`/admin/messages/${id}`);
    };

    return (
        <AdminLayout title="Contact Messages">
            <Head title="Contact Inbox" />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Inquiries &amp; Messages</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Sender</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th className="text-end" style={{ width: '150px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                list.map((msg, idx) => (
                                    <tr key={msg.id} className={msg.is_read !== 1 ? 'fw-bold bg-light' : ''}>
                                        <td>{idx + 1}</td>
                                        <td>{msg.name}</td>
                                        <td className="small text-muted">{msg.email}</td>
                                        <td className="small">{msg.phone}</td>
                                        <td className="small text-truncate" style={{ maxWidth: '250px' }}>
                                            {msg.message}
                                        </td>
                                        <td className="small text-muted">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Link
                                                    href={`/admin/messages/view/${msg.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
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

            {message?.links && <Pagination links={message.links} />}
        </AdminLayout>
    );
}
