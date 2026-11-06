import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';

export default function Index({ stats = { enrolled: 0, favourites: 0, searches: 0 } }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const quickLinks = [
        {
            title: 'Edit Profile',
            desc: 'Update your contact information, location, and teaching profile details.',
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
                <div className="row g-4">
                    {quickLinks.map((item, idx) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                            <Link
                                href={item.href}
                                className="card h-100 border-0 shadow-sm rounded-4 p-4 text-decoration-none hover-shadow transition"
                            >
                                <div className={`text-${item.color} fs-2 mb-3`}>
                                    <i className={`bi ${item.icon}`}></i>
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
