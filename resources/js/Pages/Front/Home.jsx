import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function Home({
    pageData,
    popularCategories = [],
    courses = [],
    blogs = [],
    teachers = [],
    stats = { courses: 0, teachers: 0, students: 0 },
    states = [],
    subjects = [],
    boards = [],
    showcaseTeachers = [],
    isShowcaseNearby = false,
}) {
    const [searchState, setSearchState] = useState({
        lookingfor: 'teacher',
        search_state: '0',
        search_district: '0',
        search_city: '0',
        search_subject: '0',
        search_board: '0',
        search_gender: '',
        search_radius: '0',
        user_lat: '',
        user_lng: '',
    });
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [geoActive, setGeoActive] = useState(false);
    const [loadingGeo, setLoadingGeo] = useState(false);
    const [geoMsg, setGeoMsg] = useState('');

    // Hero Showcase Slider State
    const [tutorList, setTutorList] = useState(showcaseTeachers || []);
    const [isNearby, setIsNearby] = useState(isShowcaseNearby || false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isDetecting, setIsDetecting] = useState(false);
    const [showcaseStatusMsg, setShowcaseStatusMsg] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherModalHtml, setTeacherModalHtml] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [teacherRating, setTeacherRating] = useState('5');
    const [teacherReview, setTeacherReview] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');

    useEffect(() => {
        if (showcaseTeachers && showcaseTeachers.length > 0) {
            setTutorList(showcaseTeachers);
            setIsNearby(isShowcaseNearby);
        }
    }, [showcaseTeachers, isShowcaseNearby]);

    // Auto-slide effect
    useEffect(() => {
        if (!isAutoPlay || tutorList.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tutorList.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [isAutoPlay, tutorList.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + tutorList.length) % tutorList.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % tutorList.length);
    };

    const fetchNearbyShowcase = async (lat, lng) => {
        setIsDetecting(true);
        try {
            const res = await axios.get('/getNearbyShowcaseTeachersAjax', {
                params: { lat, lng, radius: 5 }
            });
            if (res.data && res.data.teachers && res.data.teachers.length > 0) {
                setTutorList(res.data.teachers);
                setIsNearby(res.data.is_nearby);
                setCurrentIndex(0);
                if (res.data.is_nearby) {
                    setShowcaseStatusMsg(`Found ${res.data.teachers.length} tutor(s) within 5 km of your location!`);
                } else {
                    setShowcaseStatusMsg('No tutors within 5 km; showing top verified tutors.');
                }
            }
        } catch (e) {
            console.error('Failed to load nearby tutors', e);
        } finally {
            setIsDetecting(false);
        }
    };

    // Auto-detect browser location once on mount
    useEffect(() => {
        if (navigator.geolocation && !isShowcaseNearby) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude.toFixed(6);
                    const lng = pos.coords.longitude.toFixed(6);
                    fetchNearbyShowcase(lat, lng);
                },
                () => {},
                { enableHighAccuracy: true, timeout: 8000 }
            );
        }
    }, []);

    const openTeacherModal = async (teacher) => {
        setSelectedTeacher(teacher);
        setLoadingDetails(true);
        setTeacherModalHtml('');
        setReviewMsg('');

        try {
            const res = await axios.get(`/getTeacherDetailsAjax/${teacher.user_id || teacher.id}`);
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
        setReviewMsg('');
        try {
            const res = await axios.get('/postTeacherReviews', {
                params: {
                    id: selectedTeacher.user_id || selectedTeacher.id,
                    teacher_rating: teacherRating,
                    teacher_review: teacherReview,
                }
            });
            setReviewMsg(res.data.message);
            if (res.data.status === 200) {
                setTeacherReview('');
            }
        } catch (err) {
            setReviewMsg('Please login to post a review or check your input.');
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setGeoMsg('Geolocation is not supported by your browser.');
            return;
        }

        setLoadingGeo(true);
        setGeoMsg('Detecting your GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                setSearchState((prev) => ({
                    ...prev,
                    search_radius: '1',
                    user_lat: lat,
                    user_lng: lng,
                }));

                setLoadingGeo(false);
                setGeoActive(true);
                setGeoMsg('📍 Location acquired! Ready to find tutors within 1 km.');
                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});
                fetchNearbyShowcase(lat, lng);
            },
            (error) => {
                setLoadingGeo(false);
                setGeoActive(false);
                let errText = 'Failed to get location.';
                if (error.code === 1) {
                    errText = 'Location permission denied. Please allow location in your browser.';
                } else if (error.code === 2) {
                    errText = 'Location unavailable. Please check device GPS.';
                } else if (error.code === 3) {
                    errText = 'Location request timed out. Please try again.';
                }
                setGeoMsg(errText);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        setSearchState((prev) => ({ ...prev, search_state: stateId, search_district: '0', search_city: '0' }));
        setDistricts([]);
        setCities([]);

        if (stateId && stateId !== '0') {
            setLoadingDistricts(true);
            try {
                const res = await axios.get(`/get-districts?state_id=${stateId}`);
                setDistricts(res.data || []);
            } catch (err) {
                try {
                    const fallback = await axios.get(`/getDistrictAjax/${stateId}`);
                    setDistricts(fallback.data || []);
                } catch (e2) {
                    console.error('Error fetching districts:', err);
                }
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const distId = e.target.value;
        setSearchState((prev) => ({ ...prev, search_district: distId, search_city: '0' }));
        setCities([]);

        if (distId && distId !== '0') {
            setLoadingCities(true);
            try {
                const res = await axios.get(`/get-cities?district_id=${distId}`);
                setCities(res.data || []);
            } catch (err) {
                try {
                    const fallback = await axios.get(`/getCityAjax/${distId}`);
                    setCities(fallback.data || []);
                } catch (e2) {
                    console.error('Error fetching cities:', err);
                }
            } finally {
                setLoadingCities(false);
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/search', searchState);
    };

    const handleToggleFav = async (courseId) => {
        try {
            const res = await axios.get(`/myfavcourse/ajax?id=${courseId}`);
            alert(res.data.message);
        } catch (err) {
            alert('Please login to save courses.');
        }
    };

    return (
        <FrontLayout>
            <Head title="Home - Find Expert Tutors Near You" />

            {/* Hero Section */}
            <section className="hero-section py-4 py-lg-5 bg-light position-relative overflow-hidden border-bottom">
                <div className="container">
                    {/* Hero Header Row */}
                    <div className="row mb-4">
                        <div className="col-lg-9">
                            <span className="badge bg-primary-subtle text-primary fw-bold mb-2 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1 shadow-xs">
                                <i className="bi bi-patch-check-fill text-primary"></i> Top Rated Learning Platform
                            </span>
                            <h1 className="display-5 fw-bold text-dark lh-sm mb-2">
                                Find the Perfect <span className="text-primary">Tutor</span> in Your Local Area
                            </h1>
                            <p className="lead text-muted mb-0">
                                Connect with qualified home and online teachers, coaching institutes, schools, and colleges for all subjects and boards.
                            </p>
                        </div>
                    </div>

                    {/* Both Boxes Side-by-Side in Exact Alignment */}
                    <div className="row g-4 align-items-stretch">
                        {/* Left Box: Search Form Card */}
                        <div className="col-lg-6 d-flex flex-column">
                            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                                        <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                            <i className="bi bi-search text-primary"></i>
                                            What are you looking for?
                                        </h5>
                                        <span className="badge bg-light text-muted border small fw-normal">Find Tutors</span>
                                    </div>

                                    <form onSubmit={handleSearch}>
                                        <div className="row g-2">
                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted mb-1 fw-semibold">Category</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.lookingfor}
                                                    onChange={(e) => setSearchState({ ...searchState, lookingfor: e.target.value })}
                                                >
                                                    <option value="teacher">Tutors / Teachers</option>
                                                    <option value="coaching-center">Coaching Center</option>
                                                    <option value="schools">Schools</option>
                                                    <option value="college">Colleges</option>
                                                    <option value="university">Universities</option>
                                                </select>
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted mb-1 fw-semibold">State</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.search_state}
                                                    onChange={handleStateChange}
                                                >
                                                    <option value="0">Select State</option>
                                                    {states.map((s) => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted mb-1 fw-semibold">District</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.search_district}
                                                    onChange={handleDistrictChange}
                                                    disabled={searchState.search_state === '0' || loadingDistricts}
                                                >
                                                    <option value="0">
                                                        {loadingDistricts ? 'Loading Districts...' : 'Select District'}
                                                    </option>
                                                    {districts.map((d) => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted mb-1 fw-semibold">City</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.search_city}
                                                    onChange={(e) => setSearchState((prev) => ({ ...prev, search_city: e.target.value }))}
                                                    disabled={searchState.search_district === '0' || loadingCities}
                                                >
                                                    <option value="0">
                                                        {loadingCities
                                                            ? 'Loading Cities...'
                                                            : (searchState.search_district !== '0' && cities.length === 0)
                                                                ? 'No Cities Found'
                                                                : 'Select City'}
                                                    </option>
                                                    {cities.map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted mb-1 fw-semibold">Subject</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.search_subject}
                                                    onChange={(e) => setSearchState({ ...searchState, search_subject: e.target.value })}
                                                >
                                                    <option value="0">Select Subject</option>
                                                    {subjects.map((sub) => (
                                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-sm-6">
                                                <label className="form-label small text-muted mb-1 fw-semibold">Board</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.search_board}
                                                    onChange={(e) => setSearchState({ ...searchState, search_board: e.target.value })}
                                                >
                                                    <option value="0">Select Board</option>
                                                    {boards.map((b) => (
                                                        <option key={b.id} value={b.id}>{b.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label small text-muted mb-1 fw-semibold">Search Distance / Radius</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={searchState.search_radius}
                                                    onChange={(e) => setSearchState({ ...searchState, search_radius: e.target.value })}
                                                >
                                                    <option value="0">All Locations (City-wide)</option>
                                                    <option value="1">Within 1 KM (Nearest)</option>
                                                    <option value="2">Within 2 KM</option>
                                                    <option value="3">Within 3 KM</option>
                                                    <option value="5">Within 5 KM</option>
                                                    <option value="10">Within 10 KM</option>
                                                </select>
                                            </div>

                                            <div className="col-12 mt-2">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold ${
                                                        geoActive ? 'btn-success text-white' : 'btn-outline-primary'
                                                    }`}
                                                    onClick={handleUseCurrentLocation}
                                                    disabled={loadingGeo}
                                                >
                                                    {loadingGeo ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            <span>Detecting your GPS location...</span>
                                                        </>
                                                    ) : geoActive ? (
                                                        <>
                                                            <i className="bi bi-geo-alt-fill"></i>
                                                            <span>📍 Browsing Near You (1 km Radius Active)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-crosshair"></i>
                                                            <span>Use My Current Location (Search 1 km Radius)</span>
                                                        </>
                                                    )}
                                                </button>
                                                {geoMsg && (
                                                    <div className={`small text-center mt-1 fw-semibold ${geoActive ? 'text-success' : 'text-danger'}`}>
                                                        {geoMsg}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3">
                                                <i className="bi bi-search"></i>
                                                <span>Search Now</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right Box: Teacher Showcase Card in Identical Alignment */}
                        <div className="col-lg-6 d-flex flex-column">
                            {tutorList.length === 0 ? (
                                <div className="card shadow-sm border-0 rounded-4 p-4 text-center bg-white h-100 d-flex flex-column justify-content-center">
                                    <div className="py-4">
                                        <i className="bi bi-person-workspace fs-1 text-primary mb-3 d-inline-block"></i>
                                        <h4 className="fw-bold text-dark">Verified Local Tutors</h4>
                                        <p className="text-muted small mb-3">
                                            Connect with top-rated home & online educators across Kolkata and West Bengal.
                                        </p>
                                        <Link href="/search?lookingfor=teacher" className="btn btn-primary rounded-pill px-4">
                                            Browse Tutors
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between position-relative overflow-hidden"
                                    onMouseEnter={() => setIsAutoPlay(false)}
                                    onMouseLeave={() => setIsAutoPlay(true)}
                                >
                                    {/* Top Accent Gradient Bar */}
                                    <div
                                        className="position-absolute top-0 start-0 end-0"
                                        style={{
                                            height: '4px',
                                            background: isNearby
                                                ? 'linear-gradient(90deg, #198754, #20c997)'
                                                : 'linear-gradient(90deg, #0d6efd, #0dcaf0)'
                                        }}
                                    />

                                    {/* Card Header matching left card's header */}
                                    <div>
                                        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2">
                                            <div>
                                                {isNearby ? (
                                                    <span className="badge bg-success text-white px-3 py-1 rounded-pill fw-semibold shadow-xs d-inline-flex align-items-center gap-1">
                                                        <span className="spinner-grow spinner-grow-sm text-white" style={{ width: '7px', height: '7px' }}></span>
                                                        <span>Tutors Near You ({tutorList.length})</span>
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-primary text-white px-3 py-1 rounded-pill fw-semibold shadow-xs d-inline-flex align-items-center gap-1">
                                                        <i className="bi bi-patch-check-fill text-warning"></i>
                                                        <span>Top Verified Tutors</span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge bg-light text-muted border small px-2 py-1">
                                                    {currentIndex + 1} of {tutorList.length}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1 small d-inline-flex align-items-center gap-1"
                                                    onClick={() => {
                                                        if (navigator.geolocation) {
                                                            setIsDetecting(true);
                                                            navigator.geolocation.getCurrentPosition(
                                                                (pos) => fetchNearbyShowcase(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6)),
                                                                () => setIsDetecting(false),
                                                                { enableHighAccuracy: true, timeout: 8000 }
                                                            );
                                                        }
                                                    }}
                                                    disabled={isDetecting}
                                                    title="Detect GPS location for nearest tutors"
                                                >
                                                    <i className={`bi bi-crosshair ${isDetecting ? 'spinner-border spinner-border-sm' : ''}`}></i>
                                                    <span>{isDetecting ? 'Detecting...' : 'Near Me'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {showcaseStatusMsg && (
                                            <div className="alert alert-info py-1 px-3 small rounded-3 mb-2">
                                                {showcaseStatusMsg}
                                            </div>
                                        )}

                                        {/* Teacher Content */}
                                        {(() => {
                                            const teacher = tutorList[currentIndex] || tutorList[0];
                                            if (!teacher) return null;
                                            return (
                                                <div>
                                                    {/* Profile Header */}
                                                    <div className="d-flex align-items-center gap-3 mb-3">
                                                        <div className="position-relative flex-shrink-0">
                                                            <img
                                                                src={teacher.image ? `/user/${teacher.image}` : '/front/img/noprofileimage.png'}
                                                                onError={(e) => { e.target.src = '/front/img/noprofileimage.png'; }}
                                                                alt={teacher.name}
                                                                className="rounded-circle shadow-sm border border-2 border-primary-subtle"
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                            />
                                                            <span
                                                                className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"
                                                                title="Available for Tuition"
                                                                style={{ width: '13px', height: '13px' }}
                                                            />
                                                        </div>

                                                        <div className="flex-grow-1 min-w-0">
                                                            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2 flex-wrap">
                                                                <span className="text-truncate">{teacher.name}</span>
                                                                <span className="badge bg-light text-secondary border small fw-normal">
                                                                    {teacher.gender || 'Teacher'}
                                                                </span>
                                                            </h5>

                                                            <div className="d-flex flex-wrap gap-1 align-items-center mb-1">
                                                                {teacher.distance !== null && teacher.distance !== undefined ? (
                                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 d-inline-flex align-items-center gap-1 small">
                                                                        <i className="bi bi-geo-alt-fill"></i>
                                                                        {Number(teacher.distance) < 1
                                                                            ? `${Math.round(Number(teacher.distance) * 1000)} meters away`
                                                                            : `${Number(teacher.distance).toFixed(1)} km away`}
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 d-inline-flex align-items-center gap-1 small">
                                                                        <i className="bi bi-shield-check"></i>
                                                                        Verified Educator
                                                                    </span>
                                                                )}

                                                                {teacher.experience && (
                                                                    <span className="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1 small">
                                                                        {teacher.experience} Years Exp
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {(teacher.city_name || teacher.state_name) && (
                                                                <div className="text-muted small text-truncate">
                                                                    <i className="bi bi-geo-alt me-1 text-primary"></i>
                                                                    {[teacher.city_name, teacher.state_name].filter(Boolean).join(', ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Details Grid */}
                                                    <div className="bg-light rounded-3 p-3 mb-3 small">
                                                        {teacher.qualification_name && (
                                                            <div className="row g-1 mb-1">
                                                                <span className="col-4 text-muted fw-semibold">Qualification:</span>
                                                                <span className="col-8 text-dark fw-medium text-truncate">{teacher.qualification_name}</span>
                                                            </div>
                                                        )}

                                                        {teacher.subject_names && (
                                                            <div className="row g-1 mb-1">
                                                                <span className="col-4 text-muted fw-semibold">Subjects:</span>
                                                                <span className="col-8 text-dark fw-medium text-truncate-2">{teacher.subject_names}</span>
                                                            </div>
                                                        )}

                                                        {teacher.board_names && (
                                                            <div className="row g-1 mb-1">
                                                                <span className="col-4 text-muted fw-semibold">Board:</span>
                                                                <span className="col-8 text-dark text-truncate">{teacher.board_names}</span>
                                                            </div>
                                                        )}

                                                        {teacher.teaching_mode_name && (
                                                            <div className="row g-1 mb-1">
                                                                <span className="col-4 text-muted fw-semibold">Mode:</span>
                                                                <span className="col-8 text-dark text-truncate">{teacher.teaching_mode_name}</span>
                                                            </div>
                                                        )}

                                                        {teacher.timings && (
                                                            <div className="row g-1">
                                                                <span className="col-4 text-muted fw-semibold">Timings:</span>
                                                                <span className="col-8 text-dark text-truncate">{teacher.timings}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    {teacher.description && (
                                                        <p className="text-muted small mb-3 text-truncate-2 fst-italic">
                                                            "{teacher.description}"
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Card Footer matching left card's bottom line */}
                                    <div className="pt-2 border-top d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => openTeacherModal(tutorList[currentIndex] || tutorList[0])}
                                            className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1 shadow-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#homeTeacherModal"
                                        >
                                            <i className="bi bi-info-circle"></i>
                                            <span>View Full Profile</span>
                                        </button>

                                        {/* Slider Prev / Dots / Next */}
                                        <div className="d-flex align-items-center gap-1">
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm rounded-circle border shadow-xs d-inline-flex align-items-center justify-content-center p-0"
                                                onClick={prevSlide}
                                                style={{ width: '30px', height: '30px' }}
                                                title="Previous Tutor"
                                            >
                                                <i className="bi bi-chevron-left small"></i>
                                            </button>

                                            <div className="d-flex align-items-center gap-1 px-1">
                                                {tutorList.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`btn p-0 rounded-pill ${idx === currentIndex ? 'bg-primary' : 'bg-secondary-subtle'}`}
                                                        style={{
                                                            width: idx === currentIndex ? '18px' : '6px',
                                                            height: '6px',
                                                            border: 'none',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onClick={() => setCurrentIndex(idx)}
                                                        title={`Slide ${idx + 1}`}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm rounded-circle border shadow-xs d-inline-flex align-items-center justify-content-center p-0"
                                                onClick={nextSlide}
                                                style={{ width: '30px', height: '30px' }}
                                                title="Next Tutor"
                                            >
                                                <i className="bi bi-chevron-right small"></i>
                                            </button>
                                        </div>

                                        <Link
                                            href={`/search?lookingfor=teacher&search_state=${(tutorList[currentIndex] || tutorList[0])?.state || 0}&search_city=${(tutorList[currentIndex] || tutorList[0])?.city || 0}`}
                                            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                        >
                                            Explore &rarr;
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Banner */}
            <section className="stats-section py-4 bg-primary text-white">
                <div className="container">
                    <div className="row text-center gy-3">
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">{stats.courses || 120}+</h2>
                            <p className="text-white-50 mb-0 small">Active Courses</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">{stats.teachers || 250}+</h2>
                            <p className="text-white-50 mb-0 small">Verified Teachers</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">{stats.students || 1500}+</h2>
                            <p className="text-white-50 mb-0 small">Enrolled Students</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h2 className="fw-bold mb-0">99%</h2>
                            <p className="text-white-50 mb-0 small">Success &amp; Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="categories-section py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-primary fw-bold text-uppercase small">Top Categories</span>
                        <h2 className="fw-bold text-dark">Explore by Course Category</h2>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {popularCategories.map((cat) => (
                            <div key={cat.id} className="col-6 col-md-4 col-lg-3">
                                <Link
                                    href={`/course/${cat.id}/${cat.slug}`}
                                    className="card h-100 text-center border-0 shadow-sm rounded-4 p-4 text-decoration-none hover-shadow transition"
                                >
                                    <div className="category-img mb-3">
                                        <img
                                            src={cat.image ? `/coursecategory/${cat.image}` : '/front/img/noimage.jpg'}
                                            alt={cat.title}
                                            className="img-fluid rounded-circle"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{cat.title}</h5>
                                    <span className="text-muted small">View Courses &rarr;</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            {courses.length > 0 && (
                <section className="courses-section py-5 bg-light">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <span className="text-primary fw-bold text-uppercase small">Featured Offerings</span>
                                <h2 className="fw-bold text-dark mb-0">Popular Courses</h2>
                            </div>
                            <Link href="/all_course" className="btn btn-outline-primary btn-sm">
                                View All Courses
                            </Link>
                        </div>

                        <div className="row g-4">
                            {courses.map((course) => (
                                <div key={course.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="position-relative">
                                            <img
                                                src={course.image ? `/course/${course.image}` : '/front/img/noimage.jpg'}
                                                alt={course.title}
                                                className="card-img-top"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <button
                                                onClick={() => handleToggleFav(course.id)}
                                                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm"
                                                title="Save to favorites"
                                            >
                                                <i className="bi bi-heart text-danger"></i>
                                            </button>
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column">
                                            <span className="badge bg-secondary-subtle text-secondary align-self-start mb-2">
                                                {course.category?.title || 'General'}
                                            </span>
                                            <h5 className="fw-bold mb-2">
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="text-dark text-decoration-none"
                                                >
                                                    {course.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small flex-grow-1">
                                                {course.short_description || (course.description ? course.description.substring(0, 90) + '...' : '')}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                                <span className="fw-bold text-primary fs-5">
                                                    {course.price ? `₹${course.price}` : 'Free'}
                                                </span>
                                                <Link
                                                    href={`/course_details/${course.id}/${course.slug || 'detail'}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Become a Mentor Banner */}
            <section className="cta-section py-5 bg-dark text-white position-relative">
                <div className="container py-lg-4">
                    <div className="row align-items-center gy-4">
                        <div className="col-lg-7">
                            <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2 rounded-pill">
                                Teach &amp; Earn
                            </span>
                            <h2 className="display-6 fw-bold mb-3">
                                {pageData?.title || 'Become a Tutor or Mentor on Our Platform'}
                            </h2>
                            <div
                                className="lead text-white-50 mb-4"
                                dangerouslySetInnerHTML={{
                                    __html: pageData?.description || 'Share your expertise, teach students in your local community or online, and grow your career with us.',
                                }}
                            />
                            <div className="d-flex gap-3">
                                <Link href="/register" className="btn btn-primary px-4 py-2 fw-semibold">
                                    Become a Mentor
                                </Link>
                                <Link href="/about" className="btn btn-outline-light px-4 py-2">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5 text-center">
                            <img
                                src="/front/img/bg-img/c-1.png"
                                alt="Become Mentor"
                                className="img-fluid rounded-4"
                                style={{ maxHeight: '320px' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Blogs */}
            {blogs.length > 0 && (
                <section className="blogs-section py-5">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <span className="text-primary fw-bold text-uppercase small">News &amp; Articles</span>
                                <h2 className="fw-bold text-dark mb-0">From Our Blog</h2>
                            </div>
                            <Link href="/blogs" className="btn btn-outline-primary btn-sm">
                                Read All Blogs
                            </Link>
                        </div>

                        <div className="row g-4">
                            {blogs.slice(0, 3).map((blog) => (
                                <div key={blog.id} className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                        <img
                                            src={blog.image ? `/blog/${blog.image}` : '/front/img/noimage.jpg'}
                                            alt={blog.title}
                                            className="card-img-top"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-4 d-flex flex-column">
                                            <span className="text-muted small mb-2">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                            <h5 className="fw-bold mb-2">
                                                <Link href={`/blog_details/${blog.id}`} className="text-dark text-decoration-none">
                                                    {blog.title}
                                                </Link>
                                            </h5>
                                            <p className="text-muted small flex-grow-1">
                                                {blog.short_description || (blog.description ? blog.description.substring(0, 90) + '...' : '')}
                                            </p>
                                            <Link href={`/blog_details/${blog.id}`} className="text-primary fw-semibold small text-decoration-none mt-2">
                                                Read More &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            {/* Teacher Details Modal */}
            <div className="modal fade" id="homeTeacherModal" tabIndex="-1" aria-labelledby="homeTeacherModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-4 border-0 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold" id="homeTeacherModalLabel">
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
