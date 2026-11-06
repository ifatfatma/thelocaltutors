import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import axios from 'axios';

export default function SearchResults({ lists, searchdetails }) {
    const teacherList = lists?.data || lists || [];
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [teacherModalHtml, setTeacherModalHtml] = useState('');
    const [teacherRating, setTeacherRating] = useState('5');
    const [teacherReview, setTeacherReview] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');

    const openTeacherModal = async (teacher) => {
        setSelectedTeacher(teacher);
        setLoadingDetails(true);
        setTeacherModalHtml('');
        setReviewMsg('');

        try {
            const res = await axios.get(`/getTeacherDetailsAjax/${teacher.id}`);
            if (res.data.status === 200) {
                setTeacherModalHtml(res.data.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handlePostTeacherReview = async () => {
        if (!selectedTeacher) return;
        try {
            const res = await axios.get('/postTeacherReviews', {
                params: {
                    id: selectedTeacher.id,
                    teacher_rating: teacherRating,
                    teacher_review: teacherReview,
                },
            });
            setReviewMsg(res.data.message || 'Feedback submitted!');
            if (res.data.status === 200) {
                setTeacherReview('');
            }
        } catch (err) {
            setReviewMsg('Please login to post a teacher review.');
        }
    };

    return (
        <FrontLayout>
            <Head title="Search Tutors & Teachers" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2">Search Results &amp; Tutors Directory</h1>
                    <p className="text-white-50 mb-0">Browse qualified verified mentors near you</p>
                </div>
            </div>

            <div className="container py-5">
                {teacherList.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-person-x fs-1 text-muted"></i>
                        <h4 className="mt-3 text-muted">No teachers matched your current search filters.</h4>
                        <p className="text-muted small">Try broadening your search criteria or checking back soon.</p>
                        <Link href="/" className="btn btn-primary mt-2">Modify Search</Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {teacherList.map((teacher) => (
                            <div key={teacher.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center d-flex flex-column">
                                    <div className="mx-auto mb-3">
                                        <img
                                            src={teacher.image ? `/user/${teacher.image}` : '/front/img/noprofileimage.png'}
                                            onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                            alt={teacher.name}
                                            className="rounded-circle shadow-sm"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{teacher.name}</h5>
                                    <span className="badge bg-primary-subtle text-primary align-self-center mb-3">
                                        {teacher.gender || 'Teacher'}
                                    </span>

                                    <div className="text-start small text-muted mb-3 flex-grow-1">
                                        {teacher.qualification && (
                                            <div className="mb-1">
                                                <strong>Qualification:</strong> {teacher.qualification}
                                            </div>
                                        )}
                                        {teacher.subjects && (
                                            <div className="mb-1">
                                                <strong>Subjects:</strong> {teacher.subjects}
                                            </div>
                                        )}
                                        {teacher.description && (
                                            <div className="text-truncate-2 mt-2">
                                                {teacher.description}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openTeacherModal(teacher)}
                                        className="btn btn-outline-primary btn-sm w-100 rounded-3 mt-auto"
                                        data-bs-toggle="modal"
                                        data-bs-target="#teacherModal"
                                    >
                                        <i className="bi bi-info-circle me-1"></i>View Full Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {lists?.links && <Pagination links={lists.links} />}
            </div>

            {/* Teacher Details Modal */}
            <div className="modal fade" id="teacherModal" tabIndex="-1" aria-labelledby="teacherModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-4 border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold" id="teacherModalLabel">
                                {selectedTeacher?.name || 'Teacher Profile'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            {loadingDetails ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <div className="mt-2 text-muted small">Loading teacher details...</div>
                                </div>
                            ) : (
                                <div>
                                    {teacherModalHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: teacherModalHtml }} />
                                    ) : (
                                        <div className="text-center py-3">
                                            <p className="text-muted">No additional profile details found.</p>
                                        </div>
                                    )}

                                    {/* Direct review post in modal */}
                                    <div className="card border-0 bg-light p-3 mt-4 rounded-3">
                                        <h6 className="fw-bold mb-2">Write feedback for this teacher</h6>
                                        {reviewMsg && <div className="alert alert-info py-2 small">{reviewMsg}</div>}
                                        <div className="row g-2">
                                            <div className="col-sm-4">
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={teacherRating}
                                                    onChange={(e) => setTeacherRating(e.target.value)}
                                                >
                                                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                                    <option value="3">⭐⭐⭐ 3 Stars</option>
                                                    <option value="2">⭐⭐ 2 Stars</option>
                                                    <option value="1">⭐ 1 Star</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <textarea
                                                    rows="2"
                                                    className="form-control form-control-sm"
                                                    placeholder="Share your experience with this teacher..."
                                                    value={teacherReview}
                                                    onChange={(e) => setTeacherReview(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    onClick={handlePostTeacherReview}
                                                    className="btn btn-dark btn-sm"
                                                >
                                                    Submit Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
