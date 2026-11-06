import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function View({ messagesdetails }) {
    return (
        <AdminLayout title="View Message">
            <Head title="Message Details" />

            <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h5 className="fw-bold mb-0">Message From {messagesdetails?.name}</h5>
                    <Link href="/admin/messages" className="btn btn-sm btn-secondary">
                        &larr; Back to Inbox
                    </Link>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <label className="text-muted small">Sender Name</label>
                        <h6 className="fw-bold text-dark">{messagesdetails?.name}</h6>
                    </div>
                    <div className="col-md-4">
                        <label className="text-muted small">Email Address</label>
                        <h6 className="fw-bold text-dark">
                            <a href={`mailto:${messagesdetails?.email}`} className="text-decoration-none">
                                {messagesdetails?.email}
                            </a>
                        </h6>
                    </div>
                    <div className="col-md-4">
                        <label className="text-muted small">Phone Number</label>
                        <h6 className="fw-bold text-dark">{messagesdetails?.phone || '--'}</h6>
                    </div>
                    <div className="col-12 mt-3">
                        <label className="text-muted small">Message</label>
                        <div className="p-3 bg-light rounded-3 text-dark fs-6 lh-base">
                            {messagesdetails?.message}
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <a
                        href={`mailto:${messagesdetails?.email}?subject=Reply to your query`}
                        className="btn btn-primary btn-sm"
                    >
                        <i className="bi bi-reply me-1"></i>Reply via Email
                    </a>
                    <Link href="/admin/messages" className="btn btn-outline-secondary btn-sm">
                        Back to Inbox
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
