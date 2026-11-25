import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({
        usertype: 'student',
        name: '',
        email: '',
        mobile: '',
        password: '',
        terms: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation && !localStorage.getItem('user_lat')) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    localStorage.setItem('user_lat', pos.coords.latitude.toFixed(6));
                    localStorage.setItem('user_lng', pos.coords.longitude.toFixed(6));
                },
                () => {},
                { timeout: 6000 }
            );
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const payload = {
                ...form,
                latitude: localStorage.getItem('user_lat') || '',
                longitude: localStorage.getItem('user_lng') || '',
            };
            const res = await axios.post('/RegisterPost', payload);
            setSuccessMsg(res.data.message || 'Account created successfully! Redirecting...');
            const targetUrl = res.data.redirect_url || '/dashboard';
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 900);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrorMsg(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
            }
        }
    };

    return (
        <AuthLayout
            title="Create an Account"
            subtitle="Join The Local Tutors as a student, parent, or educator"
        >
            <Head title="Register" />

            {successMsg && (
                <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>{successMsg}</div>
                </div>
            )}

            {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{errorMsg}</div>
                </div>
            )}

            <form onSubmit={handleRegister} noValidate>
                {/* Account Type Selector */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        I want to join as: <span className="text-danger">*</span>
                    </label>
                    <div className="row g-2">
                        <div className="col-6">
                            <button
                                type="button"
                                className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${
                                    form.usertype === 'student' ? 'btn-primary' : 'btn-outline-secondary'
                                }`}
                                onClick={() => setForm({ ...form, usertype: 'student' })}
                            >
                                <i className="bi bi-mortarboard-fill"></i>
                                <span>Student</span>
                            </button>
                        </div>
                        <div className="col-6">
                            <button
                                type="button"
                                className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${
                                    form.usertype === 'teacher' ? 'btn-primary' : 'btn-outline-secondary'
                                }`}
                                onClick={() => setForm({ ...form, usertype: 'teacher' })}
                            >
                                <i className="bi bi-person-video3"></i>
                                <span>Educator / Tutor</span>
                            </button>
                        </div>
                    </div>
                    {errors.usertype && <div className="text-danger small mt-1">{errors.usertype[0]}</div>}
                </div>

                {/* Full Name */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                        Full Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-person"></i>
                        </span>
                        <input
                            type="text"
                            id="name"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>
                </div>

                {/* Email Address */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                        Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-envelope"></i>
                        </span>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="e.g. name@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                    </div>
                    <div className="form-text small text-muted">
                        We'll use this for secure OTP logins and course notifications.
                    </div>
                </div>

                {/* Mobile Number */}
                <div className="mb-3">
                    <label htmlFor="mobile" className="form-label fw-semibold">
                        Mobile Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-phone"></i>
                        </span>
                        <input
                            type="tel"
                            id="mobile"
                            maxLength="10"
                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                            placeholder="10-digit mobile number"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                            required
                        />
                        {errors.mobile && <div className="invalid-feedback">{errors.mobile[0]}</div>}
                    </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                        Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-lock"></i>
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Create a strong password (min 6 characters)"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>
                </div>

                {/* Terms and conditions */}
                <div className="mb-4 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms"
                        checked={form.terms}
                        onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                    />
                    <label className="form-check-label text-muted small" htmlFor="terms">
                        I agree to the <a href="/terms" target="_blank" className="text-primary text-decoration-none">Terms of Service</a> &amp; <a href="/privacy" target="_blank" className="text-primary text-decoration-none">Privacy Policy</a>
                    </label>
                    {errors.terms && <div className="text-danger small">{errors.terms[0]}</div>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>

                <div className="text-center mt-4 pt-2 border-top">
                    <p className="text-muted small mb-0">
                        Already have an account?{' '}
                        <Link href="/login" className="fw-semibold text-primary text-decoration-none">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
