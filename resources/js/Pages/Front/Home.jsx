import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

/**
 * Modern Category Definitions with Icons, Descriptions & Badge Accents
 */
const CATEGORIES = [
    {
        id: 'teacher',
        name: 'Tutors / Teachers',
        icon: 'bi-person-video3',
        description: 'Verified home & online personal tutors',
        badgeColor: 'bg-primary-subtle text-primary',
    },
    {
        id: 'coaching-center',
        name: 'Coaching Institutes',
        icon: 'bi-building',
        description: 'Exam coaching & tuition academies',
        badgeColor: 'bg-success-subtle text-success',
    },
    {
        id: 'schools',
        name: 'Schools',
        icon: 'bi-backpack4',
        description: 'Primary, secondary & higher schools',
        badgeColor: 'bg-warning-subtle text-dark',
    },
    {
        id: 'college',
        name: 'Colleges',
        icon: 'bi-mortarboard',
        description: 'Undergraduate & degree institutions',
        badgeColor: 'bg-info-subtle text-info',
    },
    {
        id: 'university',
        name: 'Universities',
        icon: 'bi-bank',
        description: 'Higher education & research universities',
        badgeColor: 'bg-purple-subtle text-purple',
    },
    {
        id: 'course',
        name: 'Courses & Classes',
        icon: 'bi-journal-bookmark',
        description: 'Subject-specific classes & online courses',
        badgeColor: 'bg-danger-subtle text-danger',
    },
];

/**
 * Extensive Master Subject Dictionary
 * Covers STEM, Science, Languages, Humanities, Tech, Commerce, and Competitive Exams
 * across CBSE, ICSE, WBBSE, and State Boards.
 */
const EXTENSIVE_SUBJECTS = [
    { id: '14', name: 'Mathematics', category: 'STEM', board: 'All Boards', icon: 'bi-calculator' },
    { id: 'higher_math', name: 'Higher Mathematics & Calculus', category: 'STEM', board: 'Class 11-12 & College', icon: 'bi-infinity' },
    { id: '22', name: 'Physics', category: 'Science', board: 'All Boards', icon: 'bi-lightning-charge' },
    { id: '21', name: 'Chemistry', category: 'Science', board: 'All Boards', icon: 'bi-droplet-half' },
    { id: '20', name: 'Biology & Life Sciences', category: 'Science', board: 'All Boards', icon: 'bi-heart-pulse' },
    { id: '13', name: 'English Literature & Language', category: 'Languages', board: 'All Boards', icon: 'bi-book' },
    { id: '23', name: 'Hindi', category: 'Languages', board: 'All Boards', icon: 'bi-translate' },
    { id: 'bengali', name: 'Bengali (বাংলা সাহিত্য ও ব্যাকরণ)', category: 'Languages', board: 'WBBSE / ICSE', icon: 'bi-translate' },
    { id: '24', name: 'Social Studies & History', category: 'Humanities', board: 'All Boards', icon: 'bi-globe-americas' },
    { id: 'geography', name: 'Geography & Environmental Science', category: 'Humanities', board: 'All Boards', icon: 'bi-compass' },
    { id: 'cs', name: 'Computer Science & Coding', category: 'Tech & IT', board: 'All Boards', icon: 'bi-laptop' },
    { id: 'python', name: 'Python & Web Development', category: 'Tech & IT', board: 'Skill & Professional', icon: 'bi-code-slash' },
    { id: 'economics', name: 'Economics', category: 'Commerce', board: 'All Boards', icon: 'bi-graph-up' },
    { id: 'accountancy', name: 'Accountancy & Bookkeeping', category: 'Commerce', board: 'All Boards', icon: 'bi-cash-coin' },
    { id: 'business_studies', name: 'Business Studies', category: 'Commerce', board: 'All Boards', icon: 'bi-briefcase' },
    { id: 'statistics', name: 'Statistics & Data Analysis', category: 'STEM', board: 'College & Higher Secondary', icon: 'bi-bar-chart-line' },
    { id: 'neet', name: 'NEET Medical Entrance Prep', category: 'Competitive Exam', board: 'National', icon: 'bi-award' },
    { id: 'jee', name: 'JEE Main & Advanced Engineering', category: 'Competitive Exam', board: 'National', icon: 'bi-trophy' },
    { id: 'foundation', name: 'Class 6 - 10 All Subjects Foundation', category: 'School Foundation', board: 'CBSE / ICSE / WBBSE', icon: 'bi-mortarboard' },
    { id: 'vedic_math', name: 'Vedic Maths & Mental Arithmetic', category: 'Skill', board: 'All Ages', icon: 'bi-lightbulb' },
    { id: 'french', name: 'French & Foreign Languages', category: 'Languages', board: 'International & ICSE', icon: 'bi-chat-quote' },
];

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
    showcaseNearbyTeachers = [],
    isShowcaseNearby = false,
    userAreaName = '',
    showcaseCounts = { all: 0, near_me: 0 },
}) {
    // -------------------------------------------------------------
    // 1. Primary Hero Search Bar State & Custom Category Selector
    // -------------------------------------------------------------
    const [primaryCategory, setPrimaryCategory] = useState('teacher');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('0');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchBarRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    const activeCategoryObj = useMemo(() => {
        return CATEGORIES.find((c) => c.id === primaryCategory) || CATEGORIES[0];
    }, [primaryCategory]);

    // Merge backend subjects with extensive dictionary
    const allAvailableSubjects = useMemo(() => {
        const merged = [...EXTENSIVE_SUBJECTS];
        if (Array.isArray(subjects) && subjects.length > 0) {
            subjects.forEach((dbSub) => {
                if (!merged.some((m) => String(m.id) === String(dbSub.id) || m.name.toLowerCase() === dbSub.name.toLowerCase())) {
                    merged.push({
                        id: String(dbSub.id),
                        name: dbSub.name,
                        category: 'Academic Subject',
                        board: 'All Boards',
                        icon: 'bi-journal-text',
                    });
                }
            });
        }
        return merged;
    }, [subjects]);

    // Filter dynamic suggestions matching user typing
    const matchingSuggestions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) {
            return allAvailableSubjects.slice(0, 6);
        }
        return allAvailableSubjects
            .filter((sub) =>
                sub.name.toLowerCase().includes(q) ||
                sub.category.toLowerCase().includes(q) ||
                sub.board.toLowerCase().includes(q)
            )
            .slice(0, 8);
    }, [searchQuery, allAvailableSubjects]);

    // -------------------------------------------------------------
    // Primary search bar submission -> Opens Search Results in a NEW TAB!
    // -------------------------------------------------------------
    const handlePrimarySearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        setIsCategoryDropdownOpen(false);

        const params = new URLSearchParams();
        params.set('lookingfor', primaryCategory || 'teacher');
        if (searchQuery.trim()) {
            params.set('keyword', searchQuery.trim());
        }
        if (selectedSubjectId && selectedSubjectId !== '0') {
            params.set('search_subject', selectedSubjectId);
        }
        params.set('filter_mode', 'all');

        window.open(`/search?${params.toString()}`, '_blank');
    };

    // Handle suggestion selection -> Opens Search Results in a NEW TAB!
    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.name);
        setSelectedSubjectId(String(suggestion.id));
        setShowSuggestions(false);

        const params = new URLSearchParams();
        params.set('lookingfor', primaryCategory || 'teacher');
        params.set('keyword', suggestion.name);
        if (suggestion.id && suggestion.id !== '0') {
            params.set('search_subject', String(suggestion.id));
        }
        params.set('filter_mode', 'all');

        window.open(`/search?${params.toString()}`, '_blank');
    };

    // -------------------------------------------------------------
    // Tutor Showcase Data & Featured Slider Logic
    // -------------------------------------------------------------
    const [allTutors, setAllTutors] = useState(showcaseTeachers || []);
    const [nearbyTutors, setNearbyTutors] = useState(
        showcaseNearbyTeachers && showcaseNearbyTeachers.length > 0
            ? showcaseNearbyTeachers
            : showcaseTeachers.filter((t) => t.distance !== null && Number(t.distance) <= 50)
    );
    const [activeArea, setActiveArea] = useState(userAreaName || 'Garden Reach, Kolkata');
    const [isDetecting, setIsDetecting] = useState(false);
    const [showcaseStatusMsg, setShowcaseStatusMsg] = useState('');
    const [sliderFilterMode, setSliderFilterMode] = useState('all'); // 'all' vs 'near_me'
    const [sliderIndex, setSliderIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    // Synchronize initial showcase props
    useEffect(() => {
        if (showcaseTeachers && showcaseTeachers.length > 0) {
            setAllTutors(showcaseTeachers);
            const strictlyNearby = showcaseNearbyTeachers && showcaseNearbyTeachers.length > 0
                ? showcaseNearbyTeachers
                : showcaseTeachers.filter((t) => t.distance !== null && Number(t.distance) <= 50);
            setNearbyTutors(strictlyNearby.length > 0 ? strictlyNearby : showcaseTeachers.slice(0, 4));
            if (userAreaName) setActiveArea(userAreaName);
        }
    }, [showcaseTeachers, showcaseNearbyTeachers, userAreaName]);

    // Filter tutors shown in Featured Slider
    const displayedShowcaseTutors = useMemo(() => {
        if (sliderFilterMode === 'near_me') {
            const near = nearbyTutors.length > 0 ? nearbyTutors : allTutors.filter((t) => t.distance !== null && Number(t.distance) <= 50);
            return near.length > 0 ? near : allTutors.slice(0, 4);
        }
        return allTutors;
    }, [allTutors, nearbyTutors, sliderFilterMode]);

    // Split featured showcase tutors into pairs of 2 columns
    const featuredSlidePairs = useMemo(() => {
        const pairs = [];
        const sourceList = displayedShowcaseTutors.length > 0 ? displayedShowcaseTutors : (allTutors.length > 0 ? allTutors : showcaseTeachers);
        for (let i = 0; i < sourceList.length; i += 2) {
            pairs.push(sourceList.slice(i, i + 2));
        }
        return pairs.length > 0 ? pairs : [[...showcaseTeachers.slice(0, 2)]];
    }, [displayedShowcaseTutors, allTutors, showcaseTeachers]);

    const totalFeaturedSlides = featuredSlidePairs.length;

    // Auto-slide effect (Smooth 3.5s interval with continuous loop)
    useEffect(() => {
        if (!isAutoPlay || totalFeaturedSlides <= 1) return;
        const timer = setInterval(() => {
            setSliderIndex((prev) => (prev + 1) % totalFeaturedSlides);
        }, 3500);
        return () => clearInterval(timer);
    }, [isAutoPlay, totalFeaturedSlides, sliderIndex]);

    const prevFeaturedSlide = () => {
        if (totalFeaturedSlides <= 1) return;
        setSliderIndex((prev) => (prev - 1 + totalFeaturedSlides) % totalFeaturedSlides);
    };

    const nextFeaturedSlide = () => {
        if (totalFeaturedSlides <= 1) return;
        setSliderIndex((prev) => (prev + 1) % totalFeaturedSlides);
    };

    const handleTouchStart = (e) => {
        if (e.targetTouches && e.targetTouches[0]) {
            setTouchStartX(e.targetTouches[0].clientX);
        }
    };

    const handleTouchMove = (e) => {
        if (e.targetTouches && e.targetTouches[0]) {
            setTouchEndX(e.targetTouches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        const diff = touchStartX - touchEndX;
        if (diff > 45) {
            nextFeaturedSlide();
        } else if (diff < -45) {
            prevFeaturedSlide();
        }
        setTouchStartX(null);
        setTouchEndX(null);
    };

    // AJAX location reload
    const fetchNearbyShowcase = async (lat, lng, areaLabel = '') => {
        setIsDetecting(true);
        try {
            localStorage.setItem('user_lat', lat);
            localStorage.setItem('user_lng', lng);
            document.cookie = `user_lat=${lat};path=/;max-age=2592000`;
            document.cookie = `user_lng=${lng};path=/;max-age=2592000`;

            const res = await axios.get('/getNearbyShowcaseTeachersAjax', {
                params: { lat, lng },
            });

            if (res.data && res.data.teachers && res.data.teachers.length > 0) {
                setAllTutors(res.data.teachers);
                if (res.data.nearby_teachers && res.data.nearby_teachers.length > 0) {
                    setNearbyTutors(res.data.nearby_teachers);
                } else {
                    const filtered = res.data.teachers.filter((t) => t.distance !== null && Number(t.distance) <= 50);
                    setNearbyTutors(filtered.length > 0 ? filtered : res.data.teachers.slice(0, 4));
                }
                const locLabel = areaLabel || res.data.user_area || 'your area';
                setActiveArea(locLabel);
                const closest = res.data.teachers[0];
                const distInfo =
                    closest?.distance !== null && closest?.distance !== undefined
                        ? Number(closest.distance) < 0.1
                            ? 'in your neighborhood'
                            : `${Number(closest.distance).toFixed(1)} km away`
                        : '';
                setShowcaseStatusMsg(`Found ${res.data.teachers.length} tutors near ${locLabel}${distInfo ? ` (closest is ${distInfo})` : ''}!`);
            }
        } catch (e) {
            console.error('Failed to load nearby tutors', e);
        } finally {
            setIsDetecting(false);
        }
    };

    // Auto-detect visitor location on initial mount
    useEffect(() => {
        const savedLat = localStorage.getItem('user_lat');
        const savedLng = localStorage.getItem('user_lng');

        if (savedLat && savedLng) {
            fetchNearbyShowcase(savedLat, savedLng);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude.toFixed(6);
                    const lng = pos.coords.longitude.toFixed(6);
                    fetchNearbyShowcase(lat, lng);
                },
                () => {
                    fetch('https://ipapi.co/json/')
                        .then((r) => r.json())
                        .then((data) => {
                            if (data && data.latitude && data.longitude) {
                                fetchNearbyShowcase(
                                    data.latitude.toFixed(6),
                                    data.longitude.toFixed(6),
                                    data.city || data.region || 'your region'
                                );
                            }
                        })
                        .catch(() => {});
                },
                { enableHighAccuracy: true, timeout: 7000 }
            );
        }
    }, []);

    // Close suggestions and category dropdown on outside click
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

    // Teacher profile detail modal state
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherModalHtml, setTeacherModalHtml] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [teacherRating, setTeacherRating] = useState('5');
    const [teacherReview, setTeacherReview] = useState('');
    const [reviewMsg, setReviewMsg] = useState('');

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
                },
            });
            setReviewMsg(res.data.message);
            if (res.data.status === 200) {
                setTeacherReview('');
            }
        } catch (err) {
            setReviewMsg('Please login to post a review or check your input.');
        }
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

            {/* ============================================================== */}
            {/* HERO SECTION: Custom Category Selector & Sleek Search Pill */}
            {/* ============================================================== */}
            <section className="hero-section py-5 hero-wrapper position-relative overflow-hidden border-bottom">
                <div className="container">
                    {/* 1. HERO HEADER: Heading & Subheading */}
                    <div className="text-center mx-auto mb-4" style={{ maxWidth: '850px' }}>
                        <span className="badge badge-soft-primary text-primary fw-semibold mb-3 px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2 shadow-2xs">
                            <i className="bi bi-patch-check-fill text-primary"></i>
                            <span>Top Rated Learning Platform</span>
                        </span>
                        <h1 className="display-5 fw-bold text-dark lh-sm mb-2">
                            Find the Perfect <span className="text-primary">Tutor</span> in Your Local Area
                        </h1>
                        <p className="lead text-muted mb-4">
                            Connect with qualified home and online teachers, coaching institutes, schools, and colleges for all subjects and boards.
                        </p>

                        {/* PRIMARY SEARCH BAR: Custom Category Dropdown & Auto-Suggestions */}
                        <div className="position-relative mx-auto text-start" style={{ maxWidth: '850px', zIndex: 30 }} ref={searchBarRef}>
                            <form
                                onSubmit={handlePrimarySearchSubmit}
                                className="shadow-lg rounded-pill bg-white p-2 border d-flex flex-wrap align-items-center gap-2"
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
                                        placeholder="Search subject or course (e.g. Mathematics, Physics, NEET)..."
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
                                    className="btn btn-primary-gradient rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
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
                                                onClick={() => handleSelectSuggestion(item, true)}
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
                    </div>

                    {/* ============================================================== */}
                    {/* 3. ADVANCED FEATURED TUTOR SLIDER */}
                    {/* (Strictly dedicated showcase - NOT mixed with search/filter results) */}
                    {/* ============================================================== */}
                    <div className="mt-4">
                        <div
                            className="card card-modern p-3 p-md-4 position-relative overflow-hidden"
                            onMouseEnter={() => setIsAutoPlay(false)}
                            onMouseLeave={() => setIsAutoPlay(true)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Accent Top Gradient */}
                            <div
                                className="position-absolute top-0 start-0 end-0"
                                style={{
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)',
                                }}
                            />

                            {/* Slider Header */}
                            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-semibold shadow-xs d-inline-flex align-items-center gap-1">
                                        <i className="bi bi-patch-check-fill text-warning"></i>
                                        <span>Top Verified Tutors</span>
                                    </span>
                                    <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-semibold small">
                                        {displayedShowcaseTutors.length > 0
                                            ? `${Math.min((sliderIndex + 1) * 2, displayedShowcaseTutors.length)} of ${displayedShowcaseTutors.length}`
                                            : '0 of 0'}
                                    </span>
                                    {activeArea && (
                                        <span className="badge bg-light text-muted border small px-2 py-2 rounded-pill d-none d-sm-inline-flex align-items-center gap-1">
                                            <i className="bi bi-geo-alt-fill text-danger"></i>
                                            <span>{activeArea}</span>
                                        </span>
                                    )}
                                </div>

                                {/* Slider Controls: All / Near Me Dropdown + Arrows */}
                                <div className="d-flex align-items-center gap-2">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 dropdown-toggle fw-semibold"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="bi bi-crosshair text-primary"></i>
                                            <span>{sliderFilterMode === 'near_me' ? 'Near Me' : 'All'}</span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                                            <li>
                                                <button
                                                    type="button"
                                                    className={`dropdown-item small py-2 d-flex align-items-center justify-content-between ${
                                                        sliderFilterMode === 'all' ? 'active fw-bold' : ''
                                                    }`}
                                                    onClick={() => {
                                                        setSliderFilterMode('all');
                                                        setSliderIndex(0);
                                                    }}
                                                >
                                                    <span>All</span>
                                                    <span className="badge bg-secondary-subtle text-secondary ms-2">{allTutors.length}</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className={`dropdown-item small py-2 d-flex align-items-center justify-content-between ${
                                                        sliderFilterMode === 'near_me' ? 'active fw-bold' : ''
                                                    }`}
                                                    onClick={() => {
                                                        setSliderFilterMode('near_me');
                                                        setSliderIndex(0);
                                                    }}
                                                >
                                                    <span>Near Me</span>
                                                    <span className="badge bg-success-subtle text-success ms-2">{nearbyTutors.length}</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary rounded-start-pill px-3"
                                            onClick={prevFeaturedSlide}
                                            disabled={totalFeaturedSlides <= 1}
                                            title="Previous Slide"
                                        >
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary rounded-end-pill px-3"
                                            onClick={nextFeaturedSlide}
                                            disabled={totalFeaturedSlides <= 1}
                                            title="Next Slide"
                                        >
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Slider Carousel Track */}
                            <div className="position-relative overflow-hidden py-1" style={{ minHeight: '370px' }}>
                                <div
                                    className="d-flex h-100"
                                    style={{
                                        transform: `translateX(-${sliderIndex * 100}%)`,
                                        transition: 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)',
                                        willChange: 'transform',
                                    }}
                                >
                                    {featuredSlidePairs.map((pair, pairIdx) => (
                                        <div
                                            key={pairIdx}
                                            className="w-100 flex-shrink-0 px-1"
                                            style={{ minWidth: '100%', boxSizing: 'border-box' }}
                                        >
                                            {/* Two Columns Side-by-Side per Slide */}
                                            <div className="row row-cols-1 row-cols-md-2 g-3 g-lg-4">
                                                {pair.map((teacher, tIdx) => (
                                                    <div key={teacher.user_id || teacher.id || tIdx} className="col">
                                                        <div
                                                            className="card h-100 border rounded-4 p-3 p-lg-4 shadow-2xs transition d-flex flex-column justify-content-between bg-white"
                                                            style={{
                                                                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                                                            }}
                                                        >
                                                            <div>
                                                                {/* Profile Header */}
                                                                <div className="d-flex align-items-start gap-3 mb-3">
                                                                    <div className="position-relative flex-shrink-0">
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
                                                                            className="rounded-circle border shadow-xs"
                                                                            style={{ width: '68px', height: '68px', objectFit: 'cover' }}
                                                                        />
                                                                        <span
                                                                            className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                                                                            style={{ width: '13px', height: '13px' }}
                                                                            title="Online & Available"
                                                                        />
                                                                    </div>

                                                                    <div className="flex-grow-1 min-w-0">
                                                                        <div className="d-flex align-items-center justify-content-between gap-1 mb-1">
                                                                            <h5 className="fw-bold text-dark mb-0 text-truncate" title={teacher.name}>
                                                                                {teacher.name}
                                                                            </h5>
                                                                            {teacher.gender && (
                                                                                <span className="badge bg-light text-secondary border small">
                                                                                    {teacher.gender}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="d-flex align-items-center gap-1 flex-wrap mb-1">
                                                                            <span
                                                                                className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill py-1 px-2"
                                                                                style={{ fontSize: '0.72rem' }}
                                                                            >
                                                                                <i className="bi bi-shield-check me-1"></i>
                                                                                Verified Educator
                                                                            </span>
                                                                            {teacher.experience && (
                                                                                <span
                                                                                    className="badge bg-warning-subtle text-dark border border-warning-subtle rounded-pill py-1 px-2"
                                                                                    style={{ fontSize: '0.72rem' }}
                                                                                >
                                                                                    {teacher.experience} Yrs Exp
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* Distance Proximity Badge */}
                                                                        {teacher.distance !== undefined && teacher.distance !== null && (
                                                                            <div className="mt-1">
                                                                                <span
                                                                                    className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1"
                                                                                    style={{ fontSize: '0.74rem' }}
                                                                                >
                                                                                    <i className="bi bi-geo-alt-fill me-1"></i>
                                                                                    {Number(teacher.distance) < 0.1
                                                                                        ? 'In your neighborhood'
                                                                                        : Number(teacher.distance) < 1
                                                                                        ? `${Math.round(Number(teacher.distance) * 1000)} meters away`
                                                                                        : `${Number(teacher.distance).toFixed(1)} km away`}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Address */}
                                                                {teacher.address && (
                                                                    <div className="text-muted small mb-2 d-flex align-items-center gap-1 text-truncate">
                                                                        <i className="bi bi-pin-map text-danger flex-shrink-0"></i>
                                                                        <span className="text-truncate">{teacher.address}</span>
                                                                    </div>
                                                                )}

                                                                {/* Academic Details Pill Box */}
                                                                <div className="bg-light rounded-3 p-2 mb-2 small">
                                                                    {teacher.qualification_name && (
                                                                        <div className="row g-1 mb-1">
                                                                            <span className="col-4 text-muted fw-semibold">Qualification:</span>
                                                                            <span className="col-8 text-dark fw-medium text-truncate">
                                                                                {teacher.qualification_name}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {teacher.subject_names && (
                                                                        <div className="row g-1 mb-1">
                                                                            <span className="col-4 text-muted fw-semibold">Subjects:</span>
                                                                            <span className="col-8 text-dark fw-medium text-truncate">
                                                                                {teacher.subject_names}
                                                                            </span>
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

                                                                {/* Bio / Description */}
                                                                {teacher.description && (
                                                                    <p className="text-muted small mb-2 text-truncate-2 fst-italic" style={{ fontSize: '0.82rem' }}>
                                                                        "{teacher.description}"
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Action Footer */}
                                                            <div className="pt-2 border-top d-flex align-items-center justify-content-between gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openTeacherModal(teacher)}
                                                                    className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#homeTeacherModal"
                                                                >
                                                                    <i className="bi bi-info-circle"></i>
                                                                    <span>View Profile</span>
                                                                </button>

                                                                <Link
                                                                    href={`/search?lookingfor=teacher&search_state=${teacher.state || 0}&search_city=${teacher.city || 0}&filter_mode=all`}
                                                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                                                                >
                                                                    Explore &rarr;
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modern Progress Bar Indicator */}
                            <div className="w-100 bg-light rounded-pill overflow-hidden mt-3" style={{ height: '4px' }}>
                                <div
                                    className="h-100 rounded-pill"
                                    style={{
                                        width: `${((sliderIndex + 1) / totalFeaturedSlides) * 100}%`,
                                        background: 'linear-gradient(90deg, #0d6efd, #0dcaf0)',
                                        transition: 'width 0.4s ease',
                                    }}
                                />
                            </div>

                            {/* Bottom Capsule Indicators */}
                            {totalFeaturedSlides > 1 && (
                                <div className="pt-3 mt-1 d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                        onClick={prevFeaturedSlide}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                        <span>Prev</span>
                                    </button>

                                    <div className="d-flex align-items-center gap-2">
                                        {featuredSlidePairs.map((_, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`btn p-0 rounded-pill transition ${
                                                    idx === sliderIndex ? 'bg-primary shadow-xs' : 'bg-secondary-subtle'
                                                }`}
                                                style={{
                                                    width: idx === sliderIndex ? '28px' : '8px',
                                                    height: '8px',
                                                    border: 'none',
                                                    transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                                                }}
                                                onClick={() => setSliderIndex(idx)}
                                                title={`Slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                                        onClick={nextFeaturedSlide}
                                    >
                                        <span>Next</span>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {/* ============================================================== */}
            {/* STATS BANNER: Modern Gradient Glassmorphism Showcase */}
            {/* ============================================================== */}
            <section
                className="stats-section py-5 text-white position-relative overflow-hidden"
                style={{
                    backgroundColor: '#0f172a',
                }}
            >
                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row g-3 g-lg-4 text-center">
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-primary mb-3 shadow-sm">
                                    <i className="bi bi-journal-bookmark-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.courses || 120}+</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Active Courses</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-success mb-3 shadow-sm">
                                    <i className="bi bi-person-check-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.teachers || 250}+</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Verified Teachers</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-warning mb-3 shadow-sm">
                                    <i className="bi bi-people-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">{stats.students || 1500}+</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Enrolled Students</p>
                            </div>
                        </div>
                        <div className="col-6 col-lg-3">
                            <div
                                className="p-3 p-lg-4 rounded-4 h-100"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                }}
                            >
                                <div className="d-inline-flex p-3 rounded-circle bg-white text-info mb-3 shadow-sm">
                                    <i className="bi bi-patch-check-fill fs-4"></i>
                                </div>
                                <h2 className="fw-bold mb-1 text-white">99%</h2>
                                <p className="text-white-50 mb-0 small fw-medium">Success &amp; Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* TEMPORARILY HIDDEN PER USER REQUEST: POPULAR CATEGORIES */}
            {/* ============================================================== */}
            {/*
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
                                    <div className="mx-auto mb-3">
                                        <img
                                            src={cat.image ? `/course_category/${cat.image}` : '/front/img/default-cat.png'}
                                            onError={(e) => {
                                                e.target.src = '/front/img/default-cat.png';
                                            }}
                                            alt={cat.name}
                                            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                        />
                                    </div>
                                    <h6 className="fw-bold text-dark mb-1">{cat.name}</h6>
                                    <p className="text-muted small mb-0">{cat.courses_count || 0} Courses</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            */}

            {/* ============================================================== */}
            {/* FEATURED COURSES: Modern Header & Cards */}
            {/* ============================================================== */}
            <section className="courses-section py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
                        <div>
                            <span className="badge badge-soft-primary rounded-pill px-3 py-1 fw-bold small text-uppercase mb-2 d-inline-block">
                                Curated Learning
                            </span>
                            <h2 className="fw-bold text-dark mb-1">Featured Courses &amp; Classes</h2>
                            <p className="text-secondary small mb-0">Learn from experienced educators across all disciplines</p>
                        </div>
                        <Link href="/all_course" className="btn btn-outline-primary rounded-pill px-4 fw-semibold">
                            <span>View All Courses</span>
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>

                    <div className="row g-4">
                        {courses.map((course) => {
                            const courseTitle = course.title || course.name || 'Certified Course';
                            return (
                                <div key={course.id} className="col-md-6 col-lg-4">
                                    <div className="card card-modern h-100 overflow-hidden d-flex flex-column">
                                        <div className="position-relative overflow-hidden" style={{ height: '200px', backgroundColor: '#e2e8f0' }}>
                                            <img
                                                src={course.image ? `/course/${course.image}` : '/front/img/noimage.jpg'}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60';
                                                }}
                                                alt={courseTitle}
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                            {course.category?.title && (
                                                <span className="badge bg-white text-dark shadow-sm position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill small fw-semibold">
                                                    {course.category.title}
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-white bg-white rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm border-0 d-flex align-items-center justify-content-center"
                                                style={{ width: '34px', height: '34px' }}
                                                onClick={() => handleToggleFav(course.id)}
                                                title="Save course"
                                            >
                                                <i className="bi bi-heart text-danger"></i>
                                            </button>
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column flex-grow-1">
                                            <h5 className="fw-bold mb-2">
                                                <Link href={`/course_details/${course.id}/${course.slug || 'detail'}`} className="text-dark text-decoration-none text-hover-primary">
                                                    {courseTitle}
                                                </Link>
                                            </h5>
                                            <p className="text-secondary small flex-grow-1 mb-3">
                                                {course.short_desc || course.short_description || (course.description ? course.description.replace(/<[^>]*>?/gm, '').substring(0, 95) + '...' : 'Interactive curriculum with comprehensive notes and practice sessions.')}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                                <div>
                                                    <span className="text-muted small d-block">Fee</span>
                                                    <span className="fw-bold text-primary fs-5">
                                                        {course.price > 0 ? `₹${course.price}` : 'Free'}
                                                    </span>
                                                </div>
                                                <Link href={`/course_details/${course.id}/${course.slug || 'detail'}`} className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold">
                                                    View Course
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* LATEST BLOGS: Modern Header & Cards */}
            {/* ============================================================== */}
            {blogs.length > 0 && (
                <section className="blogs-section py-5 bg-white">
                    <div className="container">
                        <div className="text-center mb-5">
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small text-uppercase mb-2 d-inline-block">
                                Academic Insights
                            </span>
                            <h2 className="fw-bold text-dark mb-1">Latest Educational Guides &amp; Insights</h2>
                            <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: '580px' }}>
                                Exam preparation strategies, study methodologies, and subject advice from experienced educators
                            </p>
                        </div>

                        <div className="row g-4">
                            {blogs.slice(0, 3).map((blog) => (
                                <div key={blog.id} className="col-md-4">
                                    <div className="card card-modern h-100 overflow-hidden">
                                        <img
                                            src={blog.image ? `/blog/${blog.image}` : '/front/img/default-blog.png'}
                                            onError={(e) => {
                                                e.target.src = '/front/img/default-blog.png';
                                            }}
                                            alt={blog.title}
                                            className="card-img-top"
                                            style={{ height: '190px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-4 d-flex flex-column">
                                            <h6 className="fw-bold mb-2">
                                                <Link href={`/blog/${blog.id}/${blog.slug}`} className="text-dark text-decoration-none text-hover-primary">
                                                    {blog.title}
                                                </Link>
                                            </h6>
                                            <p className="text-secondary small mb-3 flex-grow-1">{blog.short_desc}</p>
                                            <Link href={`/blog/${blog.id}/${blog.slug}`} className="text-primary fw-semibold small text-decoration-none mt-auto">
                                                Read Article &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================================== */}
            {/* TEACHER PROFILE DETAILS MODAL */}
            {/* ============================================================== */}
            <div
                className="modal fade"
                id="homeTeacherModal"
                tabIndex="-1"
                aria-labelledby="homeTeacherModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-bottom py-3 px-4">
                            <h5 className="modal-title fw-bold" id="homeTeacherModalLabel">
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
