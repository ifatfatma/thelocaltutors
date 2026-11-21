import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import Pagination from '../../Components/Pagination';
import axios from 'axios';

const CATEGORIES = [
    {
        id: 'teacher',
        name: 'Tutors / Teachers',
        icon: 'bi-person-video3',
        badgeColor: 'bg-primary-subtle text-primary',
        description: 'Private home & online mentors',
    },
    {
        id: 'coaching-center',
        name: 'Coaching Institutes',
        icon: 'bi-building-check',
        badgeColor: 'bg-success-subtle text-success',
        description: 'NEET, JEE & Board institutes',
    },
    {
        id: 'schools',
        name: 'Schools',
        icon: 'bi-backpack-fill',
        badgeColor: 'bg-warning-subtle text-warning-emphasis',
        description: 'CBSE, ICSE & State schools',
    },
    {
        id: 'college',
        name: 'Colleges',
        icon: 'bi-mortarboard-fill',
        badgeColor: 'bg-info-subtle text-info-emphasis',
        description: 'Undergraduate & Degree colleges',
    },
    {
        id: 'university',
        name: 'Universities',
        icon: 'bi-bank2',
        badgeColor: 'bg-danger-subtle text-danger',
        description: 'Higher education institutions',
    },
    {
        id: 'course',
        name: 'Courses & Classes',
        icon: 'bi-journal-bookmark-fill',
        badgeColor: 'bg-purple-subtle text-purple',
        description: 'Skill development & test prep',
    },
];

const DEFAULT_SUBJECTS = [
    { id: 1, name: 'Mathematics', board: 'All Boards', category: 'Science' },
    { id: 2, name: 'Physics', board: 'CBSE / ICSE / State', category: 'Science' },
    { id: 3, name: 'Chemistry', board: 'CBSE / ICSE / State', category: 'Science' },
    { id: 4, name: 'Biology', board: 'NEET / WBBSE / CBSE', category: 'Medical' },
    { id: 5, name: 'Computer Science & Coding', board: 'All Boards', category: 'Technology' },
    { id: 6, name: 'English Literature & Grammar', board: 'All Boards', category: 'Language' },
    { id: 7, name: 'NEET Medical Preparation', board: 'National', category: 'Competitive Exam' },
    { id: 8, name: 'JEE Main & Advanced Maths', board: 'National', category: 'Engineering' },
    { id: 9, name: 'Economics & Commerce', board: 'CBSE / ISC / State', category: 'Commerce' },
    { id: 10, name: 'Accountancy & Business Studies', board: 'All Boards', category: 'Commerce' },
    { id: 11, name: 'Social Studies & History', board: 'All Boards', category: 'Humanities' },
    { id: 12, name: 'Bengali & Regional Languages', board: 'WBBSE', category: 'Language' },
];

const QUICK_AREAS = [
    { name: 'Garden Reach', lat: '22.531200', lng: '88.301500' },
    { name: 'Behala', lat: '22.498800', lng: '88.312900' },
    { name: 'Park Circus', lat: '22.541100', lng: '88.363900' },
    { name: 'Salt Lake', lat: '22.586700', lng: '88.417800' },
    { name: 'Howrah', lat: '22.602200', lng: '88.349800' },
];

export default function SearchResults({
    lists,
    searchdetails = {},
    custom_lookups = {},
    states = [],
    subjects = [],
    boards = [],
}) {
    const teacherList = lists?.data || lists || [];
    const totalCount = lists?.total !== undefined ? lists.total : teacherList.length;

    // Search Bar States
    const [primaryCategory, setPrimaryCategory] = useState(searchdetails?.lookingfor || 'teacher');
    const [searchQuery, setSearchQuery] = useState(searchdetails?.keyword || '');
    const [selectedSubjectId, setSelectedSubjectId] = useState(searchdetails?.search_subject || '0');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchBarRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    // Active Category Object
    const activeCategoryObj = useMemo(() => {
        return CATEGORIES.find((c) => c.id === primaryCategory) || CATEGORIES[0];
    }, [primaryCategory]);

    // Available subjects list
    const allAvailableSubjects = useMemo(() => {
        if (subjects && subjects.length > 0) {
            return subjects.map((sub, idx) => ({
                id: sub.id,
                name: sub.name,
                board: 'All Boards',
                category: 'Subject',
                icon: 'bi-book',
            }));
        }
        return DEFAULT_SUBJECTS;
    }, [subjects]);

    // Matching suggestions for search input
    const matchingSuggestions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return allAvailableSubjects.slice(0, 5);
        return allAvailableSubjects
            .filter((sub) =>
                sub.name.toLowerCase().includes(q) ||
                (sub.board && sub.board.toLowerCase().includes(q)) ||
                (sub.category && sub.category.toLowerCase().includes(q))
            )
            .slice(0, 8);
    }, [searchQuery, allAvailableSubjects]);

    // Close suggestions and category dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter Mode & Radius from props
    const filterMode = searchdetails?.filter_mode || 'all';
    const currentRadius = searchdetails?.search_radius ? Number(searchdetails.search_radius) : 0;
    const currentArea = searchdetails?.area || '';

    // Handle Search Bar submit
    const handlePrimarySearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        setIsCategoryDropdownOpen(false);

        router.get('/search', {
            ...searchdetails,
            lookingfor: primaryCategory,
            keyword: searchQuery.trim(),
            search_subject: selectedSubjectId,
            filter_mode: filterMode,
            page: 1,
        }, { preserveState: false, preserveScroll: true });
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.name);
        setSelectedSubjectId(String(suggestion.id));
        setShowSuggestions(false);

        router.get('/search', {
            ...searchdetails,
            lookingfor: primaryCategory,
            keyword: suggestion.name,
            search_subject: String(suggestion.id),
            filter_mode: filterMode,
            page: 1,
        }, { preserveState: false, preserveScroll: true });
    };

    // Filter Mode toggle (All vs Near Me)
    const handleFilterModeChange = (newMode) => {
        router.get('/search', {
            ...searchdetails,
            filter_mode: newMode,
            page: 1,
        }, { preserveState: false, preserveScroll: true });
    };

    // Geolocation detection
    const [locating, setLocating] = useState(false);
    const [locatingMsg, setLocatingMsg] = useState('');

    const handleDetectCurrentLocation = (targetRadius = 1) => {
        if (!navigator.geolocation) {
            setLocatingMsg('Geolocation is not supported by your browser.');
            return;
        }

        setLocating(true);
        setLocatingMsg('Detecting GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});

                setLocating(false);
                setLocatingMsg('');

                router.get('/search', {
                    ...searchdetails,
                    filter_mode: 'near_me',
                    search_radius: targetRadius,
                    user_lat: lat,
                    user_lng: lng,
                    page: 1,
                }, { preserveState: false, preserveScroll: true });
            },
            (error) => {
                setLocating(false);
                let msg = 'Unable to access your location.';
                if (error.code === 1) {
                    msg = 'Location permission denied. Please allow location access in your browser.';
                } else if (error.code === 2) {
                    msg = 'Location position unavailable. Check device GPS.';
                } else if (error.code === 3) {
                    msg = 'Location request timed out. Please try again.';
                }
                setLocatingMsg(msg);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Quick Area click
    const handleQuickAreaClick = (area) => {
        router.get('/search', {
            ...searchdetails,
            area: area.name,
            user_lat: area.lat,
            user_lng: area.lng,
            filter_mode: filterMode,
            page: 1,
        }, { preserveState: false, preserveScroll: true });
    };

    // -------------------------------------------------------------
    // Customize Search & Filters Modal State & Logic
    // -------------------------------------------------------------
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [modalSubjectInput, setModalSubjectInput] = useState(searchdetails?.keyword || '');
    const [showModalSubjectSuggestions, setShowModalSubjectSuggestions] = useState(false);

    const [modalForm, setModalForm] = useState({
        lookingfor: searchdetails?.lookingfor || 'teacher',
        search_state: String(searchdetails?.search_state || '0'),
        search_district: String(searchdetails?.search_district || '0'),
        search_city: String(searchdetails?.search_city || '0'),
        search_subject: String(searchdetails?.search_subject || '0'),
        search_board: String(searchdetails?.search_board || '0'),
        search_gender: searchdetails?.search_gender || '',
        search_radius: String(searchdetails?.search_radius || '0'),
        user_lat: searchdetails?.user_lat || '',
        user_lng: searchdetails?.user_lng || '',
    });

    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [modalGeoLoading, setModalGeoLoading] = useState(false);
    const [modalGeoActive, setModalGeoActive] = useState(Boolean(searchdetails?.user_lat));
    const [modalGeoMsg, setModalGeoMsg] = useState('');

    const matchingModalSubjects = useMemo(() => {
        const q = modalSubjectInput.trim().toLowerCase();
        if (!q) return allAvailableSubjects.slice(0, 6);
        return allAvailableSubjects
            .filter((sub) =>
                sub.name.toLowerCase().includes(q) ||
                (sub.category && sub.category.toLowerCase().includes(q))
            )
            .slice(0, 8);
    }, [modalSubjectInput, allAvailableSubjects]);

    const handleStateChange = async (e) => {
        const stateId = e.target.value;
        setModalForm((prev) => ({ ...prev, search_state: stateId, search_district: '0', search_city: '0' }));
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
                } catch (e2) {}
            } finally {
                setLoadingDistricts(false);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const distId = e.target.value;
        setModalForm((prev) => ({ ...prev, search_district: distId, search_city: '0' }));
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
                } catch (e2) {}
            } finally {
                setLoadingCities(false);
            }
        }
    };

    const handleModalGpsDetect = () => {
        if (!navigator.geolocation) {
            setModalGeoMsg('Geolocation is not supported by your browser.');
            return;
        }

        setModalGeoLoading(true);
        setModalGeoMsg('Detecting your GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                setModalForm((prev) => ({
                    ...prev,
                    search_radius: prev.search_radius === '0' ? '5' : prev.search_radius,
                    user_lat: lat,
                    user_lng: lng,
                }));

                setModalGeoLoading(false);
                setModalGeoActive(true);
                setModalGeoMsg('📍 Location detected successfully!');
                axios.get(`/savelatlong/${lat}/${lng}`).catch(() => {});
            },
            (err) => {
                setModalGeoLoading(false);
                setModalGeoActive(false);
                setModalGeoMsg('Could not detect location. Please check browser permissions.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleApplyModalFilters = (e) => {
        e.preventDefault();
        setShowFilterModal(false);

        router.get('/search', {
            ...searchdetails,
            lookingfor: modalForm.lookingfor,
            search_state: modalForm.search_state,
            search_district: modalForm.search_district,
            search_city: modalForm.search_city,
            search_board: modalForm.search_board,
            search_subject: modalForm.search_subject,
            search_gender: modalForm.search_gender,
            search_radius: modalForm.search_radius,
            keyword: modalSubjectInput.trim() || searchQuery.trim(),
            user_lat: modalForm.user_lat,
            user_lng: modalForm.user_lng,
            filter_mode: filterMode,
            page: 1,
        }, { preserveState: false, preserveScroll: true });
    };

    // Remove single filter
    const handleRemoveFilter = (filterKey) => {
        const next = { ...searchdetails };
        if (filterKey === 'keyword') {
            next.keyword = '';
            setSearchQuery('');
        } else if (filterKey === 'category') {
            next.lookingfor = 'teacher';
            setPrimaryCategory('teacher');
        } else if (filterKey === 'subject') {
            next.search_subject = '0';
            setSelectedSubjectId('0');
        } else if (filterKey === 'board') {
            next.search_board = '0';
        } else if (filterKey === 'radius') {
            next.search_radius = 0;
        } else if (filterKey === 'gender') {
            next.search_gender = '';
        } else if (filterKey === 'area') {
            next.area = '';
        } else if (filterKey === 'filter_mode') {
            next.filter_mode = 'all';
        }

        router.get('/search', next, { preserveState: false, preserveScroll: true });
    };

    // Has active filters
    const hasActiveFilters = Boolean(
        searchdetails?.keyword ||
        (searchdetails?.lookingfor && searchdetails.lookingfor !== 'teacher') ||
        (searchdetails?.search_subject && searchdetails.search_subject !== '0') ||
        (searchdetails?.search_board && searchdetails.search_board !== '0') ||
        (searchdetails?.search_radius && Number(searchdetails.search_radius) > 0) ||
        searchdetails?.search_gender ||
        searchdetails?.area ||
        searchdetails?.filter_mode === 'near_me'
    );

    // -------------------------------------------------------------
    // Full Profile Modal
    // -------------------------------------------------------------
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
            const res = await axios.get(`/getTeacherDetailsAjax/${teacher.id || teacher.user_id}`);
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
                    id: selectedTeacher.id || selectedTeacher.user_id,
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
            <Head title="Search Results - Find Verified Tutors Near You" />

            {/* ============================================================== */}
            {/* 1. TOP SECTION: Primary Search Bar + Just Right Side Filter Button */}
            {/* ============================================================== */}
            <section className="bg-light py-4 border-bottom position-relative">
                <div className="container">
                    <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-3">
                        {/* Main Search Bar Pill */}
                        <div className="flex-grow-1 position-relative" ref={searchBarRef} style={{ zIndex: 30 }}>
                            <form
                                onSubmit={handlePrimarySearchSubmit}
                                className="shadow-sm rounded-pill bg-white p-2 border d-flex flex-wrap align-items-center gap-2"
                            >
                                {/* Sleek Custom-Styled Modern Category Dropdown */}
                                <div className="position-relative" ref={categoryDropdownRef}>
                                    <button
                                        type="button"
                                        className="btn border-0 d-flex align-items-center gap-2 py-2 px-3 rounded-pill bg-light text-dark fw-semibold transition"
                                        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        aria-expanded={isCategoryDropdownOpen}
                                    >
                                        <div
                                            className={`rounded-circle p-1 d-flex align-items-center justify-content-center ${activeCategoryObj.badgeColor}`}
                                            style={{ width: '26px', height: '26px' }}
                                        >
                                            <i className={`bi ${activeCategoryObj.icon}`} style={{ fontSize: '0.85rem' }}></i>
                                        </div>
                                        <span style={{ fontSize: '0.92rem' }}>{activeCategoryObj.name}</span>
                                        <i
                                            className="bi bi-chevron-down text-muted small ms-1"
                                            style={{
                                                transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.25s ease',
                                                fontSize: '0.75rem',
                                            }}
                                        ></i>
                                    </button>

                                    {/* Custom Dropdown Menu with Icons & Descriptions */}
                                    {isCategoryDropdownOpen && (
                                        <div
                                            className="position-absolute start-0 mt-2 bg-white rounded-4 shadow-xl border overflow-hidden p-2"
                                            style={{ minWidth: '280px', zIndex: 1060 }}
                                        >
                                            <div className="px-3 py-2 text-muted small fw-semibold border-bottom mb-1 d-flex align-items-center justify-content-between">
                                                <span>SELECT CATEGORY</span>
                                                <i className="bi bi-grid-3x3-gap-fill text-primary"></i>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                {CATEGORIES.map((cat) => {
                                                    const isSelected = cat.id === primaryCategory;
                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            className={`btn w-100 text-start d-flex align-items-center justify-content-between px-3 py-2 rounded-3 border-0 transition ${
                                                                isSelected ? 'bg-primary-subtle text-primary fw-bold' : 'hover-bg-light text-dark'
                                                            }`}
                                                            style={{ fontSize: '0.88rem' }}
                                                            onClick={() => {
                                                                setPrimaryCategory(cat.id);
                                                                setIsCategoryDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    className={`rounded-3 p-2 d-flex align-items-center justify-content-center ${cat.badgeColor}`}
                                                                    style={{ width: '32px', height: '32px' }}
                                                                >
                                                                    <i className={`bi ${cat.icon}`}></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold lh-sm">{cat.name}</div>
                                                                    <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                                                                        {cat.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {isSelected && <i className="bi bi-check2 text-primary fs-5 ms-2"></i>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="vr text-secondary opacity-25 my-1 d-none d-sm-block"></div>

                                {/* Dynamic Auto-Suggest Search Input */}
                                <div className="flex-grow-1 position-relative d-flex align-items-center px-2">
                                    <i className="bi bi-search text-muted me-2"></i>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none py-2 ps-1"
                                        placeholder="Search subject, course, or topic (e.g. Mathematics, Physics, NEET)..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        autoComplete="off"
                                        style={{ fontSize: '0.95rem' }}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-link text-muted p-0 me-2"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedSubjectId('0');
                                            }}
                                            title="Clear input"
                                        >
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    )}
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs"
                                    style={{ minHeight: '44px' }}
                                >
                                    <span>Search</span>
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </form>

                            {/* Auto-Suggestions Dropdown Card */}
                            {showSuggestions && matchingSuggestions.length > 0 && (
                                <div
                                    className="position-absolute start-0 end-0 mt-2 bg-white rounded-4 shadow-xl border overflow-hidden p-2"
                                    style={{ zIndex: 1050, maxHeight: '350px', overflowY: 'auto' }}
                                >
                                    <div className="d-flex align-items-center justify-content-between px-3 py-1 border-bottom text-muted small">
                                        <span className="fw-semibold">
                                            <i className="bi bi-stars text-warning me-1"></i> Matching Subjects &amp; Courses
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm p-0 text-muted"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            Close &times;
                                        </button>
                                    </div>
                                    <div className="list-group list-group-flush pt-1">
                                        {matchingSuggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-3 border-0 rounded-3 my-1"
                                                onClick={() => handleSelectSuggestion(item)}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        className="bg-primary-subtle text-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                        style={{ width: '32px', height: '32px' }}
                                                    >
                                                        <i className={`bi ${item.icon || 'bi-book'}`}></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold text-dark small">{item.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                                                            {item.board} &bull; {item.category}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="badge bg-light text-secondary border small">
                                                    {item.category}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* JUST ON THE RIGHT SIDE OF THE SEARCH BAR: Customize Search & Filters Button */}
                        <div className="flex-shrink-0 d-flex align-items-center">
                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-xs bg-white w-100 justify-content-center"
                                style={{ minHeight: '52px', fontSize: '0.92rem' }}
                                onClick={() => setShowFilterModal(true)}
                            >
                                <i className="bi bi-sliders2 fs-5 text-primary"></i>
                                <span>Customize Search &amp; Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 2. RESULTS CONTAINER: Local Directory Header & Tutor Cards Grid */}
            {/* ============================================================== */}
            <div className="container py-4 py-lg-5">
                {/* Header Card matching uploaded design */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-light">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small text-uppercase mb-2 d-inline-block">
                                LOCAL DIRECTORY
                            </span>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                <h3 className="fw-bold text-dark mb-0">Find Qualified Tutors Near You</h3>
                                <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-semibold fs-6">
                                    {totalCount} Available
                                </span>
                            </div>
                            <p className="text-muted small mb-0">
                                {filterMode === 'near_me'
                                    ? 'Displaying strictly tutors within your local regional area (sorted by distance)'
                                    : 'Displaying all tutors with regional ("Near Me") educators prioritized first'}
                            </p>
                        </div>

                        {/* Filter Mode Dropdown & GPS Button */}
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            {/* Filter: All vs Near Me Dropdown */}
                            <div className="d-flex align-items-center gap-1 bg-white px-3 py-2 rounded-pill border shadow-xs">
                                <i className="bi bi-filter-circle-fill text-primary small"></i>
                                <span className="small fw-semibold text-secondary me-1">Filter:</span>
                                <select
                                    className="form-select form-select-sm border-0 bg-transparent fw-bold text-dark ps-1 pe-4 py-0"
                                    style={{ width: 'auto', cursor: 'pointer', fontSize: '0.88rem' }}
                                    value={filterMode}
                                    onChange={(e) => handleFilterModeChange(e.target.value)}
                                    aria-label="Filter tutors by proximity"
                                >
                                    <option value="all">All</option>
                                    <option value="near_me">Near Me</option>
                                </select>
                            </div>

                            {/* Near Me (GPS) Button */}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
                                onClick={() => handleDetectCurrentLocation(1)}
                                disabled={locating}
                                title="Detect GPS location for nearest tutors"
                            >
                                <i className={`bi bi-crosshair ${locating ? 'spinner-border spinner-border-sm' : ''}`}></i>
                                <span>{locating ? 'Detecting...' : 'Near Me (GPS)'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Area Chips Row */}
                    <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top flex-wrap">
                        <span className="text-muted small fw-semibold me-1 d-inline-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                            <i className="bi bi-pin-map text-primary"></i>
                            <strong>Quick Area:</strong>
                        </span>
                        {QUICK_AREAS.map((loc) => {
                            const isSelected = currentArea && currentArea.toLowerCase().includes(loc.name.toLowerCase());
                            return (
                                <button
                                    key={loc.name}
                                    type="button"
                                    className={`btn py-0 px-3 rounded-pill border transition ${
                                        isSelected ? 'btn-primary text-white shadow-xs' : 'btn-outline-secondary bg-white'
                                    }`}
                                    style={{ fontSize: '0.78rem', lineHeight: '1.8' }}
                                    onClick={() => handleQuickAreaClick(loc)}
                                    title={`Show tutors nearest to ${loc.name}`}
                                >
                                    {loc.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Filter Chips */}
                    {hasActiveFilters && (
                        <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top flex-wrap">
                            <span className="small text-muted fw-semibold">Active Filters:</span>

                            {filterMode === 'near_me' && (
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                    <span>Filter: Near Me</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-1"
                                        style={{ fontSize: '0.55rem' }}
                                        onClick={() => handleRemoveFilter('filter_mode')}
                                    ></button>
                                </span>
                            )}

                            {searchdetails?.keyword && (
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                    <span>Keyword: "{searchdetails.keyword}"</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-1"
                                        style={{ fontSize: '0.55rem' }}
                                        onClick={() => handleRemoveFilter('keyword')}
                                    ></button>
                                </span>
                            )}

                            {searchdetails?.lookingfor && searchdetails.lookingfor !== 'teacher' && (
                                <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                    <span>Category: {activeCategoryObj.name}</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-1"
                                        style={{ fontSize: '0.55rem' }}
                                        onClick={() => handleRemoveFilter('category')}
                                    ></button>
                                </span>
                            )}

                            {searchdetails?.area && (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                    <span>Area: {searchdetails.area}</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-1"
                                        style={{ fontSize: '0.55rem' }}
                                        onClick={() => handleRemoveFilter('area')}
                                    ></button>
                                </span>
                            )}

                            {currentRadius > 0 && (
                                <span className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                    <span>Radius: {currentRadius} KM</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-1"
                                        style={{ fontSize: '0.55rem' }}
                                        onClick={() => handleRemoveFilter('radius')}
                                    ></button>
                                </span>
                            )}

                            {searchdetails?.search_gender && (
                                <span className="badge bg-secondary-subtle text-secondary border rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1 small">
                                    <span>Gender: {searchdetails.search_gender}</span>
                                    <button
                                        type="button"
                                        className="btn-close ms-1"
                                        style={{ fontSize: '0.55rem' }}
                                        onClick={() => handleRemoveFilter('gender')}
                                    ></button>
                                </span>
                            )}

                            <button
                                type="button"
                                className="btn btn-sm btn-link text-muted p-0 small text-decoration-none ms-2"
                                onClick={() => router.get('/search', { lookingfor: 'teacher', filter_mode: 'all' })}
                            >
                                Clear All
                            </button>
                        </div>
                    )}

                    {locatingMsg && (
                        <div className="alert alert-info py-2 px-3 small mt-3 mb-0 rounded-3 d-flex align-items-center justify-content-between">
                            <span>{locatingMsg}</span>
                            <button
                                type="button"
                                className="btn-close small p-1"
                                onClick={() => setLocatingMsg('')}
                            ></button>
                        </div>
                    )}
                </div>

                {/* ============================================================== */}
                {/* 3. CARD-BOX GRID: Matching the uploaded layout */}
                {/* ============================================================== */}
                {teacherList.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm p-4">
                        <i className={`bi ${currentRadius > 0 ? 'bi-geo-alt' : 'bi-person-x'} fs-1 text-muted`}></i>
                        <h4 className="mt-3 text-dark fw-bold">
                            {currentRadius > 0
                                ? `No tutors found within ${currentRadius} km of your location.`
                                : 'No tutors matched your current search filters.'}
                        </h4>
                        <p className="text-muted small">
                            {currentRadius > 0
                                ? 'Try expanding the radius to 10 km or browsing all tutors in your city.'
                                : 'Try broadening your search keywords or removing some filters.'}
                        </p>
                        <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
                            {currentRadius > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-primary rounded-pill px-4"
                                    onClick={() => handleRemoveFilter('radius')}
                                >
                                    View All Locations
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-primary rounded-pill px-4"
                                onClick={() => router.get('/search', { lookingfor: 'teacher', filter_mode: 'all' })}
                            >
                                Reset Search Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {teacherList.map((teacher, idx) => (
                            <div key={teacher.id || teacher.user_id || idx} className="col">
                                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center d-flex flex-column bg-white transition position-relative overflow-hidden">
                                    {/* Avatar & Online Badge */}
                                    <div className="position-relative d-inline-block mx-auto mb-3">
                                        <img
                                            src={
                                                teacher.image
                                                    ? teacher.image.startsWith('http')
                                                        ? teacher.image
                                                        : `/user/${teacher.image}`
                                                    : '/front/img/noprofileimage.png'
                                            }
                                            onError={(e) => {
                                                e.target.src = '/front/img/noprofileimage.png';
                                            }}
                                            alt={teacher.name}
                                            className="rounded-circle shadow-xs border border-2 border-light-subtle"
                                            style={{ width: '92px', height: '92px', objectFit: 'cover' }}
                                        />
                                        <span
                                            className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                                            style={{ width: '15px', height: '15px', transform: 'translate(-2px, -2px)' }}
                                            title="Online & Available"
                                        />
                                    </div>

                                    {/* Name */}
                                    <h5 className="fw-bold text-dark mb-1 text-truncate" title={teacher.name}>
                                        {teacher.name}
                                    </h5>

                                    {/* Badges Row */}
                                    <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2">
                                        <span
                                            className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                                            style={{ fontSize: '0.76rem' }}
                                        >
                                            <i className="bi bi-patch-check-fill text-primary"></i>
                                            <span>Verified Educator</span>
                                        </span>
                                        {teacher.gender && (
                                            <span
                                                className="badge bg-light text-secondary border rounded-pill px-2 py-1 small fw-normal"
                                                style={{ fontSize: '0.74rem' }}
                                            >
                                                {teacher.gender}
                                            </span>
                                        )}
                                    </div>

                                    {/* Proximity Distance Badge */}
                                    {teacher.distance !== undefined && teacher.distance !== null && (
                                        <div className="mb-2">
                                            <span
                                                className="badge rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1 shadow-2xs"
                                                style={{
                                                    backgroundColor: '#e8f5e9',
                                                    color: '#2e7d32',
                                                    border: '1px solid #c8e6c9',
                                                    fontSize: '0.78rem',
                                                }}
                                            >
                                                <i className="bi bi-geo-alt-fill text-success"></i>
                                                <span>
                                                    {Number(teacher.distance) < 0.1
                                                        ? 'In your neighborhood'
                                                        : Number(teacher.distance) < 1
                                                        ? `${Math.round(Number(teacher.distance) * 1000)} meters away`
                                                        : `${Number(teacher.distance).toFixed(1)} km away`}
                                                </span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {teacher.address && (
                                        <div
                                            className="text-muted small text-truncate d-flex align-items-center justify-content-center gap-1 mb-3 px-2"
                                            style={{ fontSize: '0.8rem' }}
                                            title={teacher.address}
                                        >
                                            <i className="bi bi-pin-map text-danger flex-shrink-0"></i>
                                            <span className="text-truncate">{teacher.address}</span>
                                        </div>
                                    )}

                                    {/* Academic Details Gray Box */}
                                    <div
                                        className="rounded-3 p-3 mb-3 text-start small flex-grow-1"
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    >
                                        <div className="row g-1 mb-1">
                                            <span className="col-4 text-secondary fw-bold" style={{ fontSize: '0.82rem' }}>
                                                Qualification:
                                            </span>
                                            <span className="col-8 text-dark fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
                                                {teacher.qualification_name || 'Graduation'}
                                            </span>
                                        </div>
                                        <div className="row g-1 mb-1">
                                            <span className="col-4 text-secondary fw-bold" style={{ fontSize: '0.82rem' }}>
                                                Subjects:
                                            </span>
                                            <span className="col-8 text-dark fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
                                                {teacher.subject_names || 'General Subjects'}
                                            </span>
                                        </div>
                                        <div className="row g-1 mb-1">
                                            <span className="col-4 text-secondary fw-bold" style={{ fontSize: '0.82rem' }}>
                                                Board:
                                            </span>
                                            <span className="col-8 text-dark fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
                                                {teacher.board_names || 'All Boards'}
                                            </span>
                                        </div>
                                        <div className="row g-1 mb-1">
                                            <span className="col-4 text-secondary fw-bold" style={{ fontSize: '0.82rem' }}>
                                                Mode:
                                            </span>
                                            <span className="col-8 text-dark fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
                                                {teacher.teaching_mode_name || 'Online / Offline'}
                                            </span>
                                        </div>
                                        <div className="row g-1">
                                            <span className="col-4 text-secondary fw-bold" style={{ fontSize: '0.82rem' }}>
                                                Timings:
                                            </span>
                                            <span className="col-8 text-dark fw-bold text-truncate" style={{ fontSize: '0.82rem' }}>
                                                {teacher.timings || 'Flexible Hours'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description Quote */}
                                    {teacher.description && (
                                        <p
                                            className="text-muted small fst-italic text-truncate-2 mb-3 px-1"
                                            style={{ fontSize: '0.82rem' }}
                                        >
                                            "{teacher.description}"
                                        </p>
                                    )}

                                    {/* Action Footer */}
                                    <div className="pt-3 border-top mt-auto d-flex align-items-center justify-content-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openTeacherModal(teacher)}
                                            className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
                                            data-bs-toggle="modal"
                                            data-bs-target="#teacherProfileModal"
                                        >
                                            <i className="bi bi-info-circle"></i>
                                            <span>View Full Profile</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openTeacherModal(teacher)}
                                            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                            data-bs-toggle="modal"
                                            data-bs-target="#teacherProfileModal"
                                        >
                                            <span>Explore</span> &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {lists?.links && lists.links.length > 3 && (
                    <div className="mt-5 d-flex justify-content-center">
                        <Pagination links={lists.links} />
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* 4. CUSTOMIZE SEARCH & FILTERS MODAL */}
            {/* ============================================================== */}
            {showFilterModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowFilterModal(false);
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
                            <div className="modal-header bg-light border-bottom py-3 px-4">
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center"
                                        style={{ width: '38px', height: '38px' }}
                                    >
                                        <i className="bi bi-sliders2 fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold text-dark mb-0">Customize Search &amp; Filters</h5>
                                        <p className="text-muted small mb-0">Refine preferences to find matching tutors in your area</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowFilterModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body p-4">
                                <form onSubmit={handleApplyModalFilters}>
                                    <div className="row g-3">
                                        {/* Category */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">
                                                <i className="bi bi-grid text-primary me-1"></i> Category
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                value={modalForm.lookingfor}
                                                onChange={(e) => setModalForm({ ...modalForm, lookingfor: e.target.value })}
                                            >
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Subject with Auto-Suggest */}
                                        <div className="col-md-6 position-relative">
                                            <label className="form-label small fw-bold text-dark mb-1 d-flex justify-content-between">
                                                <span><i className="bi bi-book text-primary me-1"></i> Subject / Course</span>
                                                <span className="text-muted fw-normal small">Auto-suggest</span>
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-3 pe-4"
                                                    placeholder="Type subject (e.g. Mathematics, NEET, Physics)..."
                                                    value={modalSubjectInput}
                                                    onChange={(e) => {
                                                        setModalSubjectInput(e.target.value);
                                                        setShowModalSubjectSuggestions(true);
                                                    }}
                                                    onFocus={() => setShowModalSubjectSuggestions(true)}
                                                />
                                                <i className="bi bi-search position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
                                            </div>

                                            {showModalSubjectSuggestions && matchingModalSubjects.length > 0 && (
                                                <div
                                                    className="position-absolute start-0 end-0 bg-white border rounded-3 shadow-lg p-1 mt-1"
                                                    style={{ zIndex: 1070, maxHeight: '200px', overflowY: 'auto' }}
                                                >
                                                    {matchingModalSubjects.map((sub, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className="btn btn-sm btn-light w-100 text-start py-1 px-2 border-0 mb-1 rounded-2 d-flex justify-content-between align-items-center"
                                                            onClick={() => {
                                                                setModalSubjectInput(sub.name);
                                                                setModalForm((prev) => ({ ...prev, search_subject: String(sub.id) }));
                                                                setShowModalSubjectSuggestions(false);
                                                            }}
                                                        >
                                                            <span className="small fw-semibold">{sub.name}</span>
                                                            <span className="badge bg-secondary-subtle text-secondary small">
                                                                {sub.category}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Search Distance / Radius */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">
                                                <i className="bi bi-compass text-primary me-1"></i> Search Distance / Radius
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                value={modalForm.search_radius}
                                                onChange={(e) => setModalForm({ ...modalForm, search_radius: e.target.value })}
                                            >
                                                <option value="0">All Locations (City-wide / No limit)</option>
                                                <option value="1">Within 1 KM (Immediate Neighborhood)</option>
                                                <option value="2">Within 2 KM</option>
                                                <option value="3">Within 3 KM</option>
                                                <option value="5">Within 5 KM</option>
                                                <option value="10">Within 10 KM</option>
                                                <option value="25">Within 25 KM</option>
                                                <option value="50">Within 50 KM (Regional)</option>
                                            </select>
                                        </div>

                                        {/* Board / Curriculum */}
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-dark mb-1">
                                                <i className="bi bi-award text-primary me-1"></i> Board / Curriculum
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                value={modalForm.search_board}
                                                onChange={(e) => setModalForm({ ...modalForm, search_board: e.target.value })}
                                            >
                                                <option value="0">All Educational Boards</option>
                                                {boards.map((b) => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* GPS Auto-detect button */}
                                        <div className="col-12">
                                            <div className="card bg-light border-0 p-3 rounded-3">
                                                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                                                    <div>
                                                        <span className="fw-semibold small text-dark d-block">
                                                            <i className="bi bi-crosshair text-danger me-1"></i> Use Device GPS Location
                                                        </span>
                                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                            Filter educators accurately based on your current physical coordinates
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${
                                                            modalGeoActive ? 'btn-success text-white' : 'btn-outline-primary'
                                                        } rounded-pill px-3 fw-semibold`}
                                                        onClick={handleModalGpsDetect}
                                                        disabled={modalGeoLoading}
                                                    >
                                                        {modalGeoLoading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                                <span>Detecting...</span>
                                                            </>
                                                        ) : modalGeoActive ? (
                                                            <>
                                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                                <span>GPS Active</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-geo-alt-fill me-1"></i>
                                                                <span>Detect Location</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                {modalGeoMsg && (
                                                    <div className={`mt-2 small fw-semibold ${modalGeoActive ? 'text-success' : 'text-danger'}`}>
                                                        {modalGeoMsg}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cascading State, District, City */}
                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-dark mb-1">State</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={modalForm.search_state}
                                                onChange={handleStateChange}
                                            >
                                                <option value="0">Select State</option>
                                                {states.map((s) => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-dark mb-1">District</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={modalForm.search_district}
                                                onChange={handleDistrictChange}
                                                disabled={modalForm.search_state === '0' || loadingDistricts}
                                            >
                                                <option value="0">
                                                    {loadingDistricts ? 'Loading...' : 'Select District'}
                                                </option>
                                                {districts.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label small fw-bold text-dark mb-1">City / Area</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={modalForm.search_city}
                                                onChange={(e) => setModalForm({ ...modalForm, search_city: e.target.value })}
                                                disabled={modalForm.search_district === '0' || loadingCities}
                                            >
                                                <option value="0">
                                                    {loadingCities ? 'Loading...' : 'Select City'}
                                                </option>
                                                {cities.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Gender */}
                                        <div className="col-md-12">
                                            <label className="form-label small fw-bold text-dark mb-1">Educator Gender</label>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="modal_gender"
                                                        id="modalGenderAny"
                                                        value=""
                                                        checked={modalForm.search_gender === ''}
                                                        onChange={() => setModalForm({ ...modalForm, search_gender: '' })}
                                                    />
                                                    <label className="form-check-label small" htmlFor="modalGenderAny">
                                                        Any Gender
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="modal_gender"
                                                        id="modalGenderMale"
                                                        value="Male"
                                                        checked={modalForm.search_gender === 'Male'}
                                                        onChange={() => setModalForm({ ...modalForm, search_gender: 'Male' })}
                                                    />
                                                    <label className="form-check-label small" htmlFor="modalGenderMale">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="modal_gender"
                                                        id="modalGenderFemale"
                                                        value="Female"
                                                        checked={modalForm.search_gender === 'Female'}
                                                        onChange={() => setModalForm({ ...modalForm, search_gender: 'Female' })}
                                                    />
                                                    <label className="form-check-label small" htmlFor="modalGenderFemale">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer Buttons */}
                                    <div className="d-flex align-items-center justify-content-between pt-4 mt-4 border-top">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary rounded-pill px-4"
                                            onClick={() => {
                                                setModalForm({
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
                                                setModalSubjectInput('');
                                            }}
                                        >
                                            Reset Filters
                                        </button>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-light rounded-pill px-3"
                                                onClick={() => setShowFilterModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary rounded-pill px-4 fw-semibold shadow-xs"
                                            >
                                                Apply Filters &amp; Search
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* 5. VIEW FULL PROFILE MODAL */}
            {/* ============================================================== */}
            <div
                className="modal fade"
                id="teacherProfileModal"
                tabIndex="-1"
                aria-labelledby="teacherProfileModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-bottom py-3 px-4">
                            <h5 className="modal-title fw-bold" id="teacherProfileModalLabel">
                                {selectedTeacher?.name ? `${selectedTeacher.name} - Profile` : 'Teacher Profile'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            {loadingDetails ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted">Loading profile details...</p>
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
                                                    className="btn btn-dark btn-sm rounded-pill px-4"
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
