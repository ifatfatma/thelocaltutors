import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import axios from 'axios';

export default function SearchResults({ lists, searchdetails = {}, custom_lookups = {} }) {
    const teacherList = lists?.data || lists || [];
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [teacherModalHtml, setTeacherModalHtml] = useState('');
    const [teacherRating, setTeacherRating] = useState('5');
    const [teacherReview, setTeacherReview] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');
    const [locating, setLocating] = useState(false);
    const [locatingMsg, setLocatingMsg] = useState('');

    const currentRadius = searchdetails?.search_radius ? Number(searchdetails.search_radius) : 0;

    const handleDetectCurrentLocation = (targetRadius = 1) => {
        if (!navigator.geolocation) {
            setLocatingMsg('Geolocation is not supported by your browser.');
            return;
        }

        setLocating(true);
        setLocatingMsg('Detecting your GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});

                setLocating(false);
                setLocatingMsg('');

                router.get('/search', {
                    ...searchdetails,
                    search_radius: targetRadius,
                    user_lat: lat,
                    user_lng: lng,
                }, { preserveState: true });
            },
            (error) => {
                setLocating(false);
                let msg = 'Unable to access your location.';
                if (error.code === 1) {
                    msg = 'Location permission denied. Please allow location access in your browser.';
                }
                setLocatingMsg(msg);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const updateRadius = (newRadius) => {
        if (newRadius > 0 && (!searchdetails?.user_lat || !searchdetails?.user_lng)) {
            handleDetectCurrentLocation(newRadius);
            return;
        }

        router.get('/search', {
            ...searchdetails,
            search_radius: newRadius,
        }, { preserveState: true });
    };

    const resolveSubjects = (teacher) => {
        if (teacher.subject_names) return teacher.subject_names;
        if (!teacher.subjects) return '';
        const parts = teacher.subjects.toString().split(',').map(s => s.trim()).filter(Boolean);
        const resolved = parts.map(p => custom_lookups[p] || (isNaN(p) ? p : '')).filter(Boolean);
        return resolved.join(', ');
    };

    const resolveQualification = (teacher) => {
        if (teacher.qualification_name) return teacher.qualification_name;
        if (!teacher.qualification) return '';
        const parts = teacher.qualification.toString().split(',').map(s => s.trim()).filter(Boolean);
        const resolved = parts.map(p => custom_lookups[p] || (isNaN(p) ? p : '')).filter(Boolean);
        return resolved.join(', ');
    };

    const resolveBoard = (teacher) => {
        if (teacher.board_names) return teacher.board_names;
        if (!teacher.board) return '';
        const parts = teacher.board.toString().split(',').map(s => s.trim()).filter(Boolean);
        const resolved = parts.map(p => custom_lookups[p] || (isNaN(p) ? p : '')).filter(Boolean);
        return resolved.join(', ');
    };

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

            <div className="container py-4">
                {/* Geolocation & Radius Filter Bar */}
                <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-light">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-geo-alt-fill text-danger fs-4"></i>
                            <div>
                                <h6 className="fw-bold mb-0 text-dark">Radius &amp; Location Filter</h6>
                                <p className="text-muted small mb-0">
                                    {currentRadius > 0
                                        ? `Filtering tutors within ${currentRadius} km of your browsing location`
                                        : 'Showing tutors without distance limit'}
                                </p>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="small fw-semibold text-secondary me-1">Radius:</span>
                            <div className="btn-group btn-group-sm" role="group">
                                <button
                                    type="button"
                                    className={`btn ${currentRadius === 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => updateRadius(1)}
                                    disabled={locating}
                                >
                                    1 KM (Nearest)
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${currentRadius === 2 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => updateRadius(2)}
                                    disabled={locating}
                                >
                                    2 KM
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${currentRadius === 5 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => updateRadius(5)}
                                    disabled={locating}
                                >
                                    5 KM
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${currentRadius === 10 ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => updateRadius(10)}
                                    disabled={locating}
                                >
                                    10 KM
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${currentRadius === 0 ? 'btn-secondary text-white' : 'btn-outline-secondary'}`}
                                    onClick={() => updateRadius(0)}
                                    disabled={locating}
                                >
                                    All Locations
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 ms-lg-2"
                                onClick={() => handleDetectCurrentLocation(1)}
                                disabled={locating}
                                title="Re-detect GPS location and search 1 km"
                            >
                                <i className="bi bi-crosshair"></i>
                                <span>{locating ? 'Detecting...' : 'Near Me (1 km)'}</span>
                            </button>
                        </div>
                    </div>

                    {locatingMsg && (
                        <div className="alert alert-info py-1 px-3 small mt-2 mb-0">
                            {locatingMsg}
                        </div>
                    )}
                </div>

                {teacherList.length === 0 ? (
                    <div className="text-center py-5">
                        <i className={`bi ${currentRadius > 0 ? 'bi-geo-alt' : 'bi-person-x'} fs-1 text-muted`}></i>
                        <h4 className="mt-3 text-muted">
                            {currentRadius > 0
                                ? `No teachers found within ${currentRadius} km of your location.`
                                : 'No teachers matched your current search filters.'}
                        </h4>
                        <p className="text-muted small">
                            {currentRadius > 0
                                ? 'Try expanding the radius to 5 km or browsing all teachers in your city.'
                                : 'Try broadening your search criteria or checking back soon.'}
                        </p>
                        <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                            {currentRadius > 0 && (
                                <>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={() => updateRadius(5)}
                                    >
                                        Expand to 5 KM
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => updateRadius(0)}
                                    >
                                        View All Tutors
                                    </button>
                                </>
                            )}
                            <Link href="/" className="btn btn-outline-secondary">Modify Search</Link>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {teacherList.map((teacher) => (
                            <div key={teacher.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center d-flex flex-column">
                                    <div className="mx-auto mb-3 position-relative">
                                        <img
                                            src={teacher.image ? `/user/${teacher.image}` : '/front/img/noprofileimage.png'}
                                            onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                            alt={teacher.name}
                                            className="rounded-circle shadow-sm"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{teacher.name}</h5>
                                    <span className="badge bg-primary-subtle text-primary align-self-center mb-2">
                                        {teacher.gender || 'Teacher'}
                                    </span>

                                    {teacher.distance !== undefined && teacher.distance !== null && (
                                        <div className="mb-2">
                                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                                <i className="bi bi-geo-alt-fill me-1"></i>
                                                {Number(teacher.distance) < 1
                                                    ? `${Math.round(Number(teacher.distance) * 1000)} meters away`
                                                    : `${Number(teacher.distance).toFixed(1)} km away`}
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-start small text-muted mb-3 flex-grow-1">
                                        {resolveQualification(teacher) && (
                                            <div className="mb-1">
                                                <strong>Qualification:</strong> {resolveQualification(teacher)}
                                            </div>
                                        )}
                                        {resolveSubjects(teacher) && (
                                            <div className="mb-1">
                                                <strong>Subjects:</strong> {resolveSubjects(teacher)}
                                            </div>
                                        )}
                                        {resolveBoard(teacher) && (
                                            <div className="mb-1">
                                                <strong>Board:</strong> {resolveBoard(teacher)}
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
