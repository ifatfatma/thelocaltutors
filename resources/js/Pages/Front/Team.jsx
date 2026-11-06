import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function Team({ teachers = [] }) {
    const list = Array.isArray(teachers) ? teachers : [];
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalHtml, setModalHtml] = useState('');
    const [loading, setLoading] = useState(false);

    const handleViewTeacher = async (teacher) => {
        setSelectedTeacher(teacher);
        setLoading(true);
        setModalHtml('');
        try {
            const res = await axios.get(`/getTeamTeacherDetailsAjax/${teacher.user_id || teacher.id}`);
            if (res.data.status === 200) {
                setModalHtml(res.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FrontLayout>
            <Head title="Our Teachers" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2">Meet Our Expert Teachers</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Teachers</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-dark">Qualified Mentors for Every Subject</h2>
                    <p className="text-muted">Connect directly with experienced educators for personalized tutoring.</p>
                </div>

                {list.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-people fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">No teachers listed at the moment.</h4>
                    </div>
                ) : (
                    <div className="row g-4">
                        {list.map((t) => {
                            const u = t.user || {};
                            return (
                                <div key={t.id} className="col-sm-6 col-md-4 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-3">
                                        <div className="mb-3">
                                            <img
                                                src={u.image ? `/user/${u.image}` : '/front/img/noprofileimage.png'}
                                                onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                                alt={u.name || 'Teacher'}
                                                className="rounded-circle shadow-sm"
                                                style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                                            />
                                        </div>
                                        <h5 className="fw-bold text-dark mb-1">{u.name || 'Teacher'}</h5>
                                        <span className="badge bg-light text-primary align-self-center mb-2">
                                            {t.experience ? `${t.experience} Years Exp` : 'Educator'}
                                        </span>
                                        <p className="text-muted small text-truncate-2 mb-3">
                                            {t.description || 'Experienced educator offering home & online coaching.'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleViewTeacher(t)}
                                            className="btn btn-outline-primary btn-sm w-100 mt-auto rounded-pill"
                                            data-bs-toggle="modal"
                                            data-bs-target="#teamTeacherModal"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            <div className="modal fade" id="teamTeacherModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold">Teacher Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                </div>
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: modalHtml || '<p class="text-muted">No details available.</p>' }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
