import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import FlashAlert from '../Components/FlashAlert';

export default function AuthLayout({ children, title, subtitle }) {
    const { settings } = usePage().props;
    const logoUrl = settings?.logo
        ? `/generalsettings/${settings.logo}`
        : '/front/img/core-img/logo.png';

    return (
        <div className="auth-root min-vh-100 d-flex flex-column justify-content-center bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                        {/* Brand Logo */}
                        <div className="text-center mb-4">
                            <Link href="/">
                                {settings?.logo ? (
                                    <img
                                        src={logoUrl}
                                        alt={settings?.name || 'The Local Tutors'}
                                        style={{ maxHeight: '60px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <h3 className="fw-bold text-primary mb-0">
                                        {settings?.name || 'The Local Tutors'}
                                    </h3>
                                )}
                            </Link>
                            {title && <h4 className="mt-3 fw-bold text-dark">{title}</h4>}
                            {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
                        </div>

                        <FlashAlert />

                        <div className="card shadow-sm border-0 rounded-3">
                            <div className="card-body p-4 p-md-5">
                                {children}
                            </div>
                        </div>

                        <div className="text-center mt-3 text-muted small">
                            <Link href="/" className="text-decoration-none text-secondary">
                                <i className="bi bi-arrow-left me-1"></i>Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
