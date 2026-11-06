import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Show({ teacher }) {
    const more = teacher?.teachermore || {};

    return (
        <AdminLayout title="Teacher Information">
            <Head title={`Teacher: ${teacher?.name}`} />

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Teacher Details</h5>
                    <div className="d-flex gap-2">
                        <Link href={`/admin/teacher/updatemore/${teacher?.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-gear me-1"></i>Update More
                        </Link>
                        <Link href="/admin/teacher" className="btn btn-sm btn-secondary">
                            &larr; Back
                        </Link>
                    </div>
                </div>

                <div className="card-body p-4">
                    <div className="row g-4 align-items-start mb-4">
                        <div className="col-auto">
                            <img
                                src={teacher?.image ? `/user/${teacher.image}` : '/front/img/noprofileimage.png'}
                                onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                alt={teacher?.name}
                                className="rounded-4 shadow-sm"
                                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="col">
                            <h4 className="fw-bold text-dark mb-1">{teacher?.name}</h4>
                            <p className="text-muted mb-2">{teacher?.email} &bull; {teacher?.mobile}</p>
                            <span className={`badge ${teacher?.is_active === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                {teacher?.is_active === 1 ? 'Active Account' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <tbody>
                                <tr>
                                    <th className="table-light" style={{ width: '220px' }}>Gender</th>
                                    <td>{more.gender || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">WhatsApp</th>
                                    <td>{more.whatsapp || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Experience</th>
                                    <td>{more.experience ? `${more.experience} Years` : '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Qualification</th>
                                    <td>{more.qualification || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Teaching Mode</th>
                                    <td>{more.teaching_mode || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Board</th>
                                    <td>{more.board || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Subjects</th>
                                    <td>{more.subjects || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Days Available</th>
                                    <td>{more.days || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Address</th>
                                    <td>{more.address || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Location (City, District, State)</th>
                                    <td>{[more.city, more.district, more.state].filter(Boolean).join(', ') || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="table-light">Bio / Description</th>
                                    <td>{more.description || '--'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
