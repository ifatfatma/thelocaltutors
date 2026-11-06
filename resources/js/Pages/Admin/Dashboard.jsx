import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Dashboard({
    counts = {
        users: 0,
        teachers: 0,
        courses: 0,
        blogs: 0,
        messages: 0,
        reviews: 0,
    },
}) {
    const modules = [
        {
            title: 'Teachers',
            count: counts.teachers,
            icon: 'bi-mortarboard',
            color: 'primary',
            link: '/admin/teacher',
            action: '/admin/teacher/create',
            actionLabel: 'Add Teacher',
        },
        {
            title: 'Courses',
            count: counts.courses,
            icon: 'bi-book',
            color: 'success',
            link: '/admin/course',
            action: '/admin/course/create',
            actionLabel: 'New Course',
        },
        {
            title: 'Users & Roles',
            count: counts.users,
            icon: 'bi-people',
            color: 'warning',
            link: '/admin/users',
            action: '/admin/roles',
            actionLabel: 'Manage Roles',
        },
        {
            title: 'Blog Articles',
            count: counts.blogs,
            icon: 'bi-newspaper',
            color: 'info',
            link: '/admin/blog',
            action: '/admin/blog/create',
            actionLabel: 'New Blog',
        },
        {
            title: 'Teacher Reviews',
            count: counts.reviews,
            icon: 'bi-star',
            color: 'danger',
            link: '/admin/teacher_review',
            action: '/admin/teacher_review',
            actionLabel: 'Moderate',
        },
        {
            title: 'Contact Messages',
            count: counts.messages,
            icon: 'bi-envelope',
            color: 'secondary',
            link: '/admin/messages',
            action: '/admin/messages',
            actionLabel: 'View Inbox',
        },
    ];

    return (
        <AdminLayout title="Admin Control Center">
            <Head title="Admin Dashboard" />

            {/* Stat Cards */}
            <div className="row g-4 mb-4">
                {modules.map((m, idx) => (
                    <div key={idx} className="col-12 col-sm-6 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className={`btn btn-${m.color}-subtle text-${m.color} rounded-circle p-3 fs-4`}>
                                    <i className={`bi ${m.icon}`}></i>
                                </span>
                                <span className="display-6 fw-bold text-dark">{m.count}</span>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">{m.title}</h5>
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                <Link href={m.link} className="text-decoration-none small fw-semibold">
                                    Manage List &rarr;
                                </Link>
                                <Link href={m.action} className={`btn btn-sm btn-outline-${m.color} rounded-pill px-3`}>
                                    {m.actionLabel}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-3 text-dark">Quick Administration Shortcuts</h5>
                <div className="d-flex flex-wrap gap-2">
                    <Link href="/admin/course_category" className="btn btn-light border btn-sm">
                        <i className="bi bi-tags me-1"></i>Course Categories
                    </Link>
                    <Link href="/admin/couse_faq" className="btn btn-light border btn-sm">
                        <i className="bi bi-question-circle me-1"></i>Course FAQs
                    </Link>
                    <Link href="/admin/coursefeedback" className="btn btn-light border btn-sm">
                        <i className="bi bi-chat-left-dots me-1"></i>Course Feedback
                    </Link>
                    <Link href="/admin/blogfeedback" className="btn btn-light border btn-sm">
                        <i className="bi bi-chat-square-quote me-1"></i>Blog Feedback
                    </Link>
                    <Link href="/admin/gallery" className="btn btn-light border btn-sm">
                        <i className="bi bi-images me-1"></i>Gallery
                    </Link>
                    <Link href="/admin/faq" className="btn btn-light border btn-sm">
                        <i className="bi bi-patch-question me-1"></i>FAQs
                    </Link>
                    <Link href="/admin/singlepages" className="btn btn-light border btn-sm">
                        <i className="bi bi-file-earmark-text me-1"></i>Single Pages
                    </Link>
                    <Link href="/admin/customdata" className="btn btn-light border btn-sm">
                        <i className="bi bi-database me-1"></i>Custom Data (States/Subjects)
                    </Link>
                    <Link href="/admin/settings" className="btn btn-light border btn-sm">
                        <i className="bi bi-gear me-1"></i>General Settings
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
