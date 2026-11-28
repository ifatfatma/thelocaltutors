import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function Index({ stats = { enrolled: 0, favourites: 0, searches: 0 } }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const isAdmin = Boolean(
        user.is_admin ||
        user.type === 'admin' ||
        user.roles?.includes('Super Admin') ||
        user.roles?.includes('Admin')
    );
    const isTeacher = Boolean(!isAdmin && (user.is_teacher || user.type === 'teacher'));
    const isInstitution = Boolean(
        !isAdmin && (
            user.is_institution ||
            ['institution', 'coaching_institute', 'school', 'college', 'university'].includes(user.type)
        )
    );
    const canManageTeaching = isTeacher || isAdmin;

    const institutionLinks = isInstitution
        ? [
              {
                  title: 'Institution Dashboard',
                  desc: 'Manage your institution profile, programs & fees, campus facilities, gallery photos, brochure PDF, map pin, and student admission inquiries.',
                  href: '/dashboard/institution',
                  icon: 'bi-building-gear',
                  color: 'primary',
                  badge: 'Institution Portal',
              },
          ]
        : [];

    const teacherLinks = canManageTeaching
        ? [
              {
                  title: 'My Offered Courses & Add Course',
                  desc: 'Create academic courses or batch programs, set your fees with transparent 5% platform commission, and manage enrollments.',
                  href: '/dashboard/courses',
                  icon: 'bi-journal-plus',
                  color: 'primary',
                  badge: 'Teacher Portal',
              },
              {
                  title: 'Recorded Demo Sessions',
                  desc: 'Submit and manage sample teaching video previews for interested students and parents.',
                  href: '/dashboard/demos',
                  icon: 'bi-camera-video-fill',
                  color: 'primary',
                  badge: 'Teacher Portal',
              },
          ]
        : [];

    const commonLinks = [
        {
            title: 'Edit Profile',
            desc: canManageTeaching
                ? 'Update your contact information, location, and teaching profile details.'
                : 'Update your personal details, email, mobile number, and profile photo.',
            href: '/editprofile',
            icon: 'bi-pencil-square',
            color: 'primary',
        },
        {
            title: 'Change Password',
            desc: 'Keep your account secure by periodically updating your password.',
            href: '/changepassword',
            icon: 'bi-key-fill',
            color: 'warning',
        },
        {
            title: 'Saved Courses',
            desc: 'Access bookmarked courses that you are interested in.',
            href: '/myfavouritecourses',
            icon: 'bi-heart-fill',
            color: 'danger',
        },
        {
            title: 'My Enrolled Courses',
            desc: 'View courses you have joined and check your enrollment status.',
            href: '/mycourses',
            icon: 'bi-mortarboard-fill',
            color: 'success',
        },
        {
            title: 'Search History',
            desc: 'Review and re-run your previous teacher and tutor searches.',
            href: '/searchhistory',
            icon: 'bi-clock-history',
            color: 'info',
        },
    ];

    const quickLinks = [...institutionLinks, ...teacherLinks, ...commonLinks];

    return (
        <FrontLayout>
            <Head title="Account Dashboard" />

            <div className="bg-primary text-white py-5">
                <div className="container">
                    <div className="d-flex align-items-center gap-3">
                        <div className="btn btn-light rounded-circle p-3 text-primary fs-3">
                            <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                            <span className="badge bg-white text-primary mb-1 text-uppercase">
                                {user.type || 'Member'}
                            </span>
                            <h2 className="fw-bold mb-0">Welcome, {user.name}!</h2>
                            <p className="text-white-50 mb-0 small">{user.email || user.mobile}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                {/* Super Admin Access Banner */}
                {(user.type === 'admin' || user.roles?.includes('Super Admin') || user.roles?.includes('Admin')) && (
                    <div className="card border-0 bg-primary-subtle rounded-4 p-4 mb-4 border border-primary-subtle shadow-sm">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-3 bg-primary text-white rounded-circle fs-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                                    <i className="bi bi-shield-lock-fill"></i>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <h5 className="fw-bold text-dark mb-0">Super Admin Control Center</h5>
                                        <span className="badge bg-primary text-white rounded-pill px-2 py-1 small">Admin Privileges</span>
                                    </div>
                                    <p className="text-secondary small mb-0">
                                        You are currently logged in with Super Administrator privileges. Access the full admin management panel to manage teachers, courses, inquiries, demo submissions, reviews, and settings.
                                    </p>
                                </div>
                            </div>
                            <Link href="/admin/home" className="btn btn-primary-gradient rounded-pill px-4 py-2 fw-semibold shadow-xs">
                                <i className="bi bi-speedometer2 me-2"></i>Open Full Admin Panel &rarr;
                            </Link>
                        </div>
                    </div>
                )}

                <div className="row g-4">
                    {quickLinks.map((item, idx) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                            <Link
                                href={item.href}
                                className="card h-100 border-0 shadow-sm rounded-4 p-4 text-decoration-none hover-shadow transition"
                            >
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className={`text-${item.color} fs-2`}>
                                        <i className={`bi ${item.icon}`}></i>
                                    </div>
                                    {item.badge && (
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small fw-semibold">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                                <p className="text-muted small mb-0">{item.desc}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </FrontLayout>
    );
}
