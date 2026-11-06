import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';

export default function ForgotPassword() {
    const [mobile, setMobile] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your mobile number to receive instructions to reset your password"
        >
            <Head title="Forgot Password" />

            {submitted ? (
                <div className="text-center py-3">
                    <div className="alert alert-info mb-4">
                        <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                        If an account exists with mobile <strong>{mobile}</strong>, password reset instructions have been sent.
                    </div>
                    <Link href="/login" className="btn btn-primary px-4">
                        Return to Sign In
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="mobile" className="form-label fw-semibold">
                            Mobile Number
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-phone"></i>
                            </span>
                            <input
                                type="text"
                                id="mobile"
                                className="form-control"
                                placeholder="Enter registered mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                        Send Reset Instructions
                    </button>

                    <div className="text-center mt-4 pt-2 border-top">
                        <Link href="/login" className="text-decoration-none text-muted small">
                            <i className="bi bi-arrow-left me-1"></i>Back to Sign In
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
