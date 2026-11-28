import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import FlashAlert from '../Components/FlashAlert';

export default function AdminLayout({ children, title }) {
    const { auth, settings } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    const currentUrl = window.location.pathname;

    const navItems = [
        { label: 'Dashboard', href: '/admin/home', icon: 'bi-speedometer2' },
        { label: 'Roles', href: '/admin/roles', icon: 'bi-shield-check' },
        { label: 'Users', href: '/admin/users', icon: 'bi-people' },
        { label: 'Teachers', href: '/admin/teacher', icon: 'bi-mortarboard' },
        { label: 'Coaching Institutes', href: '/admin/institutions?type=coaching_institute', icon: 'bi-building' },
        { label: 'Schools', href: '/admin/institutions?type=school', icon: 'bi-backpack4' },
        { label: 'Colleges', href: '/admin/institutions?type=college', icon: 'bi-mortarboard-fill' },
        { label: 'Universities', href: '/admin/institutions?type=university', icon: 'bi-bank' },
        { label: 'Teacher Demos', href: '/admin/teacher-demos', icon: 'bi-camera-video' },
        { label: 'Shared Demo Links', href: '/admin/demo-shares', icon: 'bi-share' },
        { label: 'Teacher Reviews', href: '/admin/teacher_review', icon: 'bi-star' },
        { label: 'Courses', href: '/admin/course', icon: 'bi-book' },
        { label: 'Course Categories', href: '/admin/course_category', icon: 'bi-tags' },
        { label: 'Course FAQs', href: '/admin/couse_faq', icon: 'bi-question-circle' },
        { label: 'Blogs', href: '/admin/blog', icon: 'bi-newspaper' },
        { label: 'Course Feedback', href: '/admin/coursefeedback', icon: 'bi-chat-left-dots' },
        { label: 'Blog Feedback', href: '/admin/blogfeedback', icon: 'bi-chat-square-quote' },
        { label: 'Platform Feedback', href: '/admin/platform-feedback', icon: 'bi-chat-heart' },
        { label: 'Messages Inbox', href: '/admin/messages', icon: 'bi-envelope' },
        { label: 'Gallery', href: '/admin/gallery', icon: 'bi-images' },
        { label: 'FAQs', href: '/admin/faq', icon: 'bi-patch-question' },
        { label: 'Single Pages', href: '/admin/singlepages', icon: 'bi-file-earmark-text' },
        { label: 'Custom Data', href: '/admin/customdata', icon: 'bi-database' },
        { label: 'General Settings', href: '/admin/settings', icon: 'bi-gear' },
    ];

    return (
        <div className="admin-root d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <aside
                className={`bg-dark text-white flex-shrink-0 d-flex flex-column ${
                    sidebarOpen ? 'd-block' : 'd-none d-md-block'
                }`}
                style={{ width: '260px', minHeight: '100vh', transition: 'width 0.3s' }}
            >
                {/* Brand */}
                <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
                    <Link href="/admin/home" className="text-white text-decoration-none fw-bold fs-5">
                        <i className="bi bi-mortarboard-fill text-primary me-2"></i>
                        <span>Admin Panel</span>
                    </Link>
                </div>

                {/* Nav Links */}
                <div className="overflow-auto flex-grow-1 py-2">
                    <ul className="nav nav-pills flex-column px-2 gap-1">
                        {navItems.map((item, idx) => {
                            const isActive = currentUrl === item.href || currentUrl.startsWith(item.href + '/');
                            return (
                                <li className="nav-item" key={idx}>
                                    <Link
                                        href={item.href}
                                        className={`nav-link text-white d-flex align-items-center py-2 px-3 rounded ${
                                            isActive ? 'active bg-primary' : 'hover-bg-secondary'
                                        }`}
                                    >
                                        <i className={`bi ${item.icon} me-2 fs-6`}></i>
                                        <span className="small">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Admin Footer */}
                <div className="p-3 border-top border-secondary small text-muted text-center">
                    The Local Tutors &copy; {new Date().getFullYear()}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                {/* Topbar */}
                <header className="navbar navbar-expand bg-white shadow-sm px-3 py-2 border-bottom sticky-top">
                    <button
                        className="btn btn-sm btn-outline-secondary d-md-none me-2"
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <i className="bi bi-list fs-5"></i>
                    </button>

                    <div className="d-flex align-items-center">
                        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                            <i className="bi bi-box-arrow-up-right"></i>
                            <span className="d-none d-sm-inline">View Website</span>
                        </a>
                    </div>

                    <div className="ms-auto d-flex align-items-center gap-3">
                        <span className="text-muted small d-none d-sm-inline">
                            Signed in as <strong>{auth?.user?.name || 'Administrator'}</strong>
                        </span>

                        <div className="dropdown">
                            <button
                                className="btn btn-light rounded-circle p-2 dropdown-toggle-no-caret shadow-sm"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-person-circle fs-5 text-primary"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                <li>
                                    <span className="dropdown-item-text fw-bold">
                                        {auth?.user?.name}
                                    </span>
                                </li>
                                <li>
                                    <span className="dropdown-item-text text-muted small">
                                        {auth?.user?.email}
                                    </span>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item" href="/dashboard">
                                        <i className="bi bi-speedometer2 me-2"></i>User Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item text-danger">
                                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>

                {/* Page Header & Flash Alert */}
                <FlashAlert />

                {/* Body Content */}
                <main className="p-3 p-md-4 flex-grow-1 overflow-auto">
                    {title && (
                        <div className="mb-3 d-flex align-items-center justify-content-between">
                            <h4 className="fw-bold mb-0 text-dark">{title}</h4>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
