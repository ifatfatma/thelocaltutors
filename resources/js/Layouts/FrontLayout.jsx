import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import FlashAlert from '../Components/FlashAlert';
import PlatformFeedbackModal from '../Components/PlatformFeedbackModal';

export default function FrontLayout({ children, title }) {
    const { auth, settings, categories, userLocation } = usePage().props;
    const [navOpen, setNavOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null); // 'courses' | 'about' | 'user' | null
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const closeAll = () => {
        setOpenDropdown(null);
        setNavOpen(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation && (!userLocation?.latitude || !userLocation?.longitude)) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude.toFixed(6);
                    const lng = pos.coords.longitude.toFixed(6);
                    fetch(`/savelatlong/${lat}/${lng}`).catch(() => {});
                },
                () => {},
                { maximumAge: 300000, timeout: 8000 }
            );
        }
    }, [userLocation]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const logoUrl = settings?.logo
        ? `/generalsettings/${settings.logo}`
        : '/front/img/core-img/logo.png';

    return (
        <div className="front-layout-root d-flex flex-column min-vh-100 bg-light">
            {/* Modern Header in Normal Flow with Sticky Top */}
            <header
                className="sticky-top navbar-clean border-bottom"
                id="header"
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1030,
                    backgroundColor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(12px)',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
                }}
            >
                <nav className="navbar navbar-expand-lg navbar-light py-2">
                    <div className="container">
                        {/* Navbar Brand */}
                        <Link className="navbar-brand d-flex align-items-center gap-2" href="/" onClick={closeAll}>
                            {settings?.logo ? (
                                <img
                                    src={logoUrl}
                                    alt={settings?.name || 'The Local Tutors'}
                                    style={{ maxHeight: '48px', objectFit: 'contain' }}
                                />
                            ) : (
                                <span className="fw-bold fs-4 text-dark d-flex align-items-center gap-2">
                                    <span className="p-2 bg-primary rounded-3 text-white d-inline-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                                        <i className="bi bi-mortarboard-fill fs-5"></i>
                                    </span>
                                    <span>{settings?.name || 'The Local Tutors'}</span>
                                </span>
                            )}
                        </Link>

                        {/* Mobile Toggler */}
                        <button
                            className="navbar-toggler border-0 shadow-none p-2"
                            type="button"
                            onClick={() => setNavOpen(!navOpen)}
                            aria-controls="navbarContent"
                            aria-expanded={navOpen}
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Navbar Links */}
                        <div
                            className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}
                            id="navbarContent"
                        >
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold px-3 py-2 rounded-pill text-dark" href="/" onClick={closeAll}>
                                        Home
                                    </Link>
                                </li>

                                {/* Courses Dropdown */}
                                <li className="nav-item dropdown position-relative">
                                    <button
                                        type="button"
                                        className="nav-link dropdown-toggle fw-semibold px-3 py-2 rounded-pill text-dark border-0 bg-transparent d-flex align-items-center gap-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdown(openDropdown === 'courses' ? null : 'courses');
                                        }}
                                        aria-expanded={openDropdown === 'courses'}
                                    >
                                        Courses
                                    </button>
                                    <ul
                                        className={`dropdown-menu border-0 shadow-lg rounded-4 p-2 ${openDropdown === 'courses' ? 'show' : ''}`}
                                        style={{
                                            display: openDropdown === 'courses' ? 'block' : 'none',
                                            visibility: openDropdown === 'courses' ? 'visible' : 'hidden',
                                            opacity: openDropdown === 'courses' ? 1 : 0,
                                            position: 'absolute',
                                            zIndex: 1060,
                                            minWidth: '220px',
                                            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                                        }}
                                    >
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-semibold rounded-3 d-flex align-items-center gap-2" href="/all_course" onClick={closeAll}>
                                                <i className="bi bi-grid-fill text-primary"></i>
                                                <span>All Courses</span>
                                            </Link>
                                        </li>
                                        {categories && categories.length > 0 && (
                                            <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                                        )}
                                        {categories &&
                                            categories.map((cat) => (
                                                <li key={cat.id}>
                                                    <Link
                                                        className="dropdown-item py-2 px-3 small rounded-3"
                                                        href={`/course/${cat.id}/${cat.slug}`}
                                                        onClick={closeAll}
                                                    >
                                                        {cat.title}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold px-3 py-2 rounded-pill text-dark" href="/blogs" onClick={closeAll}>
                                        Blogs
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold px-3 py-2 rounded-pill text-dark" href="/team" onClick={closeAll}>
                                        Teachers
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold px-3 py-2 rounded-pill text-dark" href="/subjects" onClick={closeAll}>
                                        Subjects
                                    </Link>
                                </li>

                                {/* About Us Dropdown */}
                                <li className="nav-item dropdown position-relative">
                                    <button
                                        type="button"
                                        className="nav-link dropdown-toggle fw-semibold px-3 py-2 rounded-pill text-dark border-0 bg-transparent d-flex align-items-center gap-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdown(openDropdown === 'about' ? null : 'about');
                                        }}
                                        aria-expanded={openDropdown === 'about'}
                                    >
                                        About Us
                                    </button>
                                    <ul
                                        className={`dropdown-menu border-0 shadow-lg rounded-4 p-2 ${openDropdown === 'about' ? 'show' : ''}`}
                                        style={{
                                            display: openDropdown === 'about' ? 'block' : 'none',
                                            visibility: openDropdown === 'about' ? 'visible' : 'hidden',
                                            opacity: openDropdown === 'about' ? 1 : 0,
                                            position: 'absolute',
                                            zIndex: 1060,
                                            minWidth: '200px',
                                            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                                        }}
                                    >
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/about" onClick={closeAll}>
                                                <i className="bi bi-info-circle me-2 text-primary"></i>About Us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/ourmission" onClick={closeAll}>
                                                <i className="bi bi-compass me-2 text-primary"></i>Our Mission
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/ourvision" onClick={closeAll}>
                                                <i className="bi bi-eye me-2 text-primary"></i>Our Vision
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/faq" onClick={closeAll}>
                                                <i className="bi bi-question-circle me-2 text-primary"></i>FAQ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/eventgallery" onClick={closeAll}>
                                                <i className="bi bi-images me-2 text-primary"></i>Gallery
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3 text-primary" href="/contact" onClick={closeAll}>
                                                <i className="bi bi-envelope me-2"></i>Contact Us
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                className="dropdown-item py-2 px-3 fw-medium rounded-3 text-secondary text-start"
                                                onClick={() => {
                                                    closeAll();
                                                    setShowFeedbackModal(true);
                                                }}
                                            >
                                                <i className="bi bi-chat-heart me-2 text-primary"></i>Share Feedback
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            {/* Right Side: Auth / CTA */}
                            <div className="d-flex align-items-center gap-2">
                                {auth?.user ? (() => {
                                    const isAdmin = Boolean(
                                        auth.user.is_admin ||
                                        auth.user.type === 'admin' ||
                                        auth.user.roles?.includes('Super Admin') ||
                                        auth.user.roles?.includes('Admin')
                                    );
                                    const isTeacher = Boolean(
                                        !isAdmin && (auth.user.is_teacher || auth.user.type === 'teacher')
                                    );
                                    const canManageTeaching = isTeacher || isAdmin;

                                    return (
                                        <div className="dropdown position-relative">
                                            <button
                                                className="btn btn-light border rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdown(openDropdown === 'user' ? null : 'user');
                                                }}
                                                aria-expanded={openDropdown === 'user'}
                                            >
                                                <i className="bi bi-person-circle text-primary fs-5"></i>
                                                <span className="small">{auth.user.name || 'Account'}</span>
                                                <i className="bi bi-chevron-down text-muted small" style={{ fontSize: '0.7rem' }}></i>
                                            </button>
                                            <ul
                                                className={`dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-2 ${openDropdown === 'user' ? 'show' : ''}`}
                                                style={{
                                                    display: openDropdown === 'user' ? 'block' : 'none',
                                                    visibility: openDropdown === 'user' ? 'visible' : 'hidden',
                                                    opacity: openDropdown === 'user' ? 1 : 0,
                                                    position: 'absolute',
                                                    right: 0,
                                                    zIndex: 1060,
                                                    minWidth: '220px',
                                                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
                                                }}
                                            >
                                                {isAdmin && (
                                                    <>
                                                        <li>
                                                            <Link className="dropdown-item py-2 px-3 fw-bold rounded-3 text-primary bg-primary-subtle d-flex align-items-center gap-2 mb-1" href="/admin/home" onClick={closeAll}>
                                                                <i className="bi bi-shield-lock-fill text-primary"></i>
                                                                <span>Admin Control Panel</span>
                                                            </Link>
                                                        </li>
                                                        <li><hr className="dropdown-divider my-1 opacity-50" /></li>
                                                    </>
                                                )}
                                                <li>
                                                    <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/dashboard" onClick={closeAll}>
                                                        <i className="bi bi-speedometer2 me-2 text-primary"></i>Account Panel
                                                    </Link>
                                                </li>
                                                {canManageTeaching && (
                                                    <>
                                                        <li>
                                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/dashboard/courses" onClick={closeAll}>
                                                                <i className="bi bi-journal-plus me-2 text-primary"></i>My Offered Courses
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/dashboard/demos" onClick={closeAll}>
                                                                <i className="bi bi-camera-video me-2 text-primary"></i>Demo Sessions
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                                <li>
                                                    <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/myfavouritecourses" onClick={closeAll}>
                                                        <i className="bi bi-heart me-2 text-danger"></i>Saved Courses
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/mycourses" onClick={closeAll}>
                                                        <i className="bi bi-journal-check me-2 text-success"></i>My Enrolled Courses
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/editprofile" onClick={closeAll}>
                                                        <i className="bi bi-pencil-square me-2 text-secondary"></i>Edit Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item py-2 px-3 fw-medium rounded-3" href="/changepassword" onClick={closeAll}>
                                                        <i className="bi bi-key me-2 text-warning"></i>Change Password
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider my-2 opacity-50" /></li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="dropdown-item text-danger py-2 px-3 fw-medium rounded-3"
                                                    >
                                                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    );
                                })() : (
                                    <div className="d-flex align-items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-semibold border-secondary-subtle text-dark"
                                            onClick={closeAll}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="btn btn-primary-gradient btn-sm rounded-pill px-4 py-2 fw-semibold"
                                            onClick={closeAll}
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Flash Alerts */}
            <FlashAlert />

            {/* Main Page Content */}
            <main className="flex-grow-1 d-flex flex-column" style={{ minHeight: '65vh' }}>
                {children}
            </main>

            {/* Modern Premium Footer */}
            <footer className="footer-clean text-light pt-5 pb-4 mt-auto">
                <div className="container">
                    <div className="row gy-4 justify-content-between">
                        {/* Brand info */}
                        <div className="col-12 col-md-4 col-lg-4">
                            <div className="pe-lg-4">
                                {settings?.logo ? (
                                    <img
                                        src={logoUrl}
                                        alt={settings?.name || 'The Local Tutors'}
                                        style={{ maxHeight: '46px', objectFit: 'contain' }}
                                        className="mb-3"
                                    />
                                ) : (
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <span className="p-2 bg-primary rounded-3 text-white d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                            <i className="bi bi-mortarboard-fill fs-5"></i>
                                        </span>
                                        <h5 className="text-white fw-bold mb-0">
                                            {settings?.name || 'The Local Tutors'}
                                        </h5>
                                    </div>
                                )}
                                <p className="text-secondary small mb-3 lh-base">
                                    {settings?.description ||
                                        'Connecting students with verified local home tutors, online teachers, coaching institutes, and colleges across India.'}
                                </p>
                                <div className="d-flex gap-3 fs-5">
                                    {settings?.facebook && (
                                        <a href={settings.facebook} target="_blank" rel="noreferrer" className="text-secondary text-hover-white">
                                            <i className="bi bi-facebook"></i>
                                        </a>
                                    )}
                                    {settings?.twitter && (
                                        <a href={settings.twitter} target="_blank" rel="noreferrer" className="text-secondary text-hover-white">
                                            <i className="bi bi-twitter-x"></i>
                                        </a>
                                    )}
                                    {settings?.linkedin && (
                                        <a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-secondary text-hover-white">
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                    )}
                                    {settings?.instagram && (
                                        <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-secondary text-hover-white">
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Course Categories */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <h6 className="footer-heading mb-3">Categories</h6>
                            <ul className="list-unstyled text-secondary small mb-0">
                                {categories && categories.slice(0, 6).map((cat) => (
                                    <li key={cat.id} className="mb-2">
                                        <Link
                                            href={`/course/${cat.id}/${cat.slug}`}
                                            className="text-secondary text-decoration-none"
                                        >
                                            {cat.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <h6 className="footer-heading mb-3">Quick Links</h6>
                            <ul className="list-unstyled text-secondary small mb-0">
                                <li className="mb-2">
                                    <Link href="/about" className="text-secondary text-decoration-none">
                                        About Us
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/team" className="text-secondary text-decoration-none">
                                        Our Teachers
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/subjects" className="text-secondary text-decoration-none">
                                        Browse Subjects
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/all_course" className="text-secondary text-decoration-none">
                                        All Courses
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/faq" className="text-secondary text-decoration-none">
                                        FAQ
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/contact" className="text-secondary text-decoration-none">
                                        Contact Us
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowFeedbackModal(true)}
                                        className="btn btn-link p-0 text-secondary text-decoration-none small text-start"
                                    >
                                        <i className="bi bi-chat-heart text-primary me-1"></i>Share Feedback
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact info */}
                        <div className="col-12 col-md-6 col-lg-3">
                            <h6 className="footer-heading mb-3">Contact</h6>
                            <ul className="list-unstyled text-secondary small mb-0">
                                {settings?.mobile && (
                                    <li className="mb-2 d-flex align-items-center gap-2">
                                        <i className="bi bi-telephone text-primary"></i>
                                        <span>{settings.mobile}</span>
                                    </li>
                                )}
                                {settings?.email && (
                                    <li className="mb-2 d-flex align-items-center gap-2">
                                        <i className="bi bi-envelope text-primary"></i>
                                        <span>{settings.email}</span>
                                    </li>
                                )}
                                {settings?.address && (
                                    <li className="mb-2 d-flex align-items-start gap-2">
                                        <i className="bi bi-geo-alt text-primary mt-1"></i>
                                        <span>{settings.address}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <hr className="footer-divider my-4" />
                    <div className="d-flex flex-wrap justify-content-between align-items-center text-secondary small">
                        <div>
                            &copy; {new Date().getFullYear()} {settings?.name || 'The Local Tutors'}. All rights reserved.
                        </div>
                        <div className="d-flex gap-3">
                            <Link href="/about" className="text-secondary text-decoration-none">Privacy</Link>
                            <Link href="/about" className="text-secondary text-decoration-none">Terms</Link>
                            <Link href="/contact" className="text-secondary text-decoration-none">Support</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Platform Feedback Modal */}
            <PlatformFeedbackModal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
            />
        </div>
    );
}
