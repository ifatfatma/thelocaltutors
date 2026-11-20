import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import FlashAlert from '../Components/FlashAlert';

export default function FrontLayout({ children, title }) {
    const { auth, settings, categories, userLocation } = usePage().props;
    const [navOpen, setNavOpen] = useState(false);

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
        <div className="front-layout-root d-flex flex-column min-vh-100">
            {/* Modern Header with Backdrop Blur */}
            <header
                className="header-area four sticky-top border-bottom"
                id="header"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease',
                }}
            >
                <nav className="navbar navbar-expand-lg navbar-light py-2">
                    <div className="container">
                        {/* Navbar Brand */}
                        <Link className="navbar-brand d-flex align-items-center" href="/">
                            {settings?.logo ? (
                                <img
                                    src={logoUrl}
                                    alt={settings?.name || 'The Local Tutors'}
                                    style={{ maxHeight: '52px', objectFit: 'contain' }}
                                />
                            ) : (
                                <span className="fw-bold fs-4 text-primary d-flex align-items-center gap-2">
                                    <i className="bi bi-mortarboard-fill text-primary"></i>
                                    {settings?.name || 'The Local Tutors'}
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
                                    <Link className="nav-link fw-semibold px-3 rounded-pill text-dark" href="/">
                                        Home
                                    </Link>
                                </li>

                                {/* Courses Dropdown */}
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle fw-semibold px-3 rounded-pill text-dark"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Courses
                                    </a>
                                    <ul className="dropdown-menu border-0 shadow-lg rounded-3 py-2">
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/all_course">
                                                <i className="bi bi-grid me-2 text-primary"></i>All Courses
                                            </Link>
                                        </li>
                                        {categories && categories.length > 0 && (
                                            <li><hr className="dropdown-divider my-1" /></li>
                                        )}
                                        {categories &&
                                            categories.map((cat) => (
                                                <li key={cat.id}>
                                                    <Link
                                                        className="dropdown-item py-2 small"
                                                        href={`/course/${cat.id}/${cat.slug}`}
                                                    >
                                                        {cat.title}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold px-3 rounded-pill text-dark" href="/blogs">
                                        Blogs
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link fw-semibold px-3 rounded-pill text-dark" href="/team">
                                        Teachers
                                    </Link>
                                </li>

                                {/* About Us Dropdown */}
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle fw-semibold px-3 rounded-pill text-dark"
                                        href="#"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        About Us
                                    </a>
                                    <ul className="dropdown-menu border-0 shadow-lg rounded-3 py-2">
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/about">
                                                <i className="bi bi-info-circle me-2 text-primary"></i>About Us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/ourmission">
                                                <i className="bi bi-compass me-2 text-primary"></i>Our Mission
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/ourvision">
                                                <i className="bi bi-eye me-2 text-primary"></i>Our Vision
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/faq">
                                                <i className="bi bi-question-circle me-2 text-primary"></i>FAQ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/eventgallery">
                                                <i className="bi bi-images me-2 text-primary"></i>Gallery
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider my-1" /></li>
                                        <li>
                                            <Link className="dropdown-item py-2 fw-medium" href="/contact">
                                                <i className="bi bi-envelope me-2 text-primary"></i>Contact Us
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            {/* Right Side: Auth / CTA */}
                            <div className="d-flex align-items-center gap-2">
                                {auth?.user ? (
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-light border rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-2 shadow-2xs"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="bi bi-person-circle text-primary fs-5"></i>
                                            <span className="small">{auth.user.name || 'Account'}</span>
                                            <i className="bi bi-chevron-down text-muted small" style={{ fontSize: '0.7rem' }}></i>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-3 py-2">
                                            <li>
                                                <Link className="dropdown-item py-2 fw-medium" href="/dashboard">
                                                    <i className="bi bi-speedometer2 me-2 text-primary"></i>Account Panel
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 fw-medium" href="/myfavouritecourses">
                                                    <i className="bi bi-heart me-2 text-danger"></i>Saved Courses
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 fw-medium" href="/mycourses">
                                                    <i className="bi bi-mortarboard me-2 text-success"></i>My Courses
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 fw-medium" href="/editprofile">
                                                    <i className="bi bi-pencil-square me-2 text-secondary"></i>Edit Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item py-2 fw-medium" href="/changepassword">
                                                    <i className="bi bi-key me-2 text-warning"></i>Change Password
                                                </Link>
                                            </li>
                                            {auth.user.roles?.includes('Admin') && (
                                                <>
                                                    <li><hr className="dropdown-divider my-1" /></li>
                                                    <li>
                                                        <Link className="dropdown-item text-primary fw-bold py-2" href="/admin/home">
                                                            <i className="bi bi-shield-lock me-2"></i>Admin Dashboard
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
                                            <li><hr className="dropdown-divider my-1" /></li>
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="dropdown-item text-danger py-2 fw-medium"
                                                >
                                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center gap-2">
                                        <Link href="/login" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1 fw-semibold">
                                            Sign In
                                        </Link>
                                        <Link href="/register" className="btn btn-primary btn-sm rounded-pill px-3 py-1 fw-semibold shadow-xs">
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
            <main className="flex-grow-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="footer-wrap bg-dark text-white pt-5 pb-3 mt-auto">
                <div className="container">
                    <div className="row gy-4 justify-content-between">
                        {/* Brand info */}
                        <div className="col-12 col-md-4 col-lg-3">
                            <div className="footer-about">
                                {settings?.logo ? (
                                    <img
                                        src={logoUrl}
                                        alt={settings?.name || 'The Local Tutors'}
                                        style={{ maxHeight: '50px', objectFit: 'contain' }}
                                        className="mb-3"
                                    />
                                ) : (
                                    <h5 className="text-white fw-bold mb-3">
                                        {settings?.name || 'The Local Tutors'}
                                    </h5>
                                )}
                                <p className="text-secondary small mb-3">
                                    {settings?.description ||
                                        'Connecting passionate learners with top local tutors and coaching institutes.'}
                                </p>
                                <div className="d-flex gap-3 text-secondary fs-5">
                                    {settings?.facebook && (
                                        <a href={settings.facebook} target="_blank" rel="noreferrer" className="text-secondary">
                                            <i className="bi bi-facebook"></i>
                                        </a>
                                    )}
                                    {settings?.twitter && (
                                        <a href={settings.twitter} target="_blank" rel="noreferrer" className="text-secondary">
                                            <i className="bi bi-twitter-x"></i>
                                        </a>
                                    )}
                                    {settings?.linkedin && (
                                        <a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-secondary">
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                    )}
                                    {settings?.instagram && (
                                        <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-secondary">
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Course Categories */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <h6 className="text-uppercase fw-bold mb-3 text-white">Categories</h6>
                            <ul className="list-unstyled text-secondary small">
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
                            <h6 className="text-uppercase fw-bold mb-3 text-white">Quick Links</h6>
                            <ul className="list-unstyled text-secondary small">
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
                                    <Link href="/faq" className="text-secondary text-decoration-none">
                                        FAQ
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/eventgallery" className="text-secondary text-decoration-none">
                                        Gallery
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link href="/contact" className="text-secondary text-decoration-none">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact info */}
                        <div className="col-12 col-md-6 col-lg-3">
                            <h6 className="text-uppercase fw-bold mb-3 text-white">Contact Info</h6>
                            <ul className="list-unstyled text-secondary small">
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

                    <hr className="border-secondary mt-4 mb-3" />
                    <div className="d-flex flex-wrap justify-content-between align-items-center text-secondary small">
                        <div>
                            &copy; {new Date().getFullYear()} {settings?.name || 'The Local Tutors'}. All rights reserved.
                        </div>
                        <div>
                            Powered by Modern Laravel &amp; React
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
