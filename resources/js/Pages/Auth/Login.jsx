import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import axios from 'axios';

export default function Login() {
    // Auth mode: 'password' | 'email_otp'
    const [authMode, setAuthMode] = useState('password');

    // Password Login State
    const [pwdForm, setPwdForm] = useState({
        user_mobile: '',
        user_password: '',
        rememberme: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    // Email OTP Login State
    const [otpEmail, setOtpEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpRemember, setOtpRemember] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    // General status
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Coordinate tracking
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

    // Cooldown timer effect
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Switch tabs & clear alerts
    const handleSwitchMode = (mode) => {
        setAuthMode(mode);
        setErrorMsg('');
        setSuccessMsg('');
        setErrors({});
    };

    // 1. Password Login Handler
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const payload = {
                ...pwdForm,
                latitude: localStorage.getItem('user_lat') || '',
                longitude: localStorage.getItem('user_lng') || '',
            };
            const res = await axios.post('/LoginPost', payload);
            setSuccessMsg(res.data.message || 'Login successful! Redirecting...');
            const targetUrl = res.data.redirect_url || (res.data.is_admin ? '/admin/home' : '/dashboard');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else if (err.response?.status === 400 || err.response?.status === 403) {
                setErrorMsg(err.response.data.message || 'Invalid credentials');
            } else {
                setErrorMsg('Something went wrong. Please check your credentials and try again.');
            }
        }
    };

    // 2. Email OTP - Request OTP
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!otpEmail) {
            setErrorMsg('Please enter your registered email address.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/auth/email-otp/send', {
                email: otpEmail,
                action: 'login',
            });
            setLoading(false);
            setOtpSent(true);
            setCooldown(res.data.cooldown || 60);
            setSuccessMsg(res.data.message || 'A 6-digit code has been sent to your email.');
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 429) {
                setCooldown(err.response.data.cooldown || 30);
                setErrorMsg(err.response.data.message);
            } else {
                setErrorMsg(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
            }
        }
    };

    // 3. Email OTP - Verify & Sign In
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            setErrorMsg('Please enter the complete 6-digit verification code.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const payload = {
                email: otpEmail,
                otp: otpCode,
                rememberme: otpRemember,
                latitude: localStorage.getItem('user_lat') || '',
                longitude: localStorage.getItem('user_lng') || '',
            };
            const res = await axios.post('/auth/email-otp/login', payload);
            setSuccessMsg(res.data.message || 'Signed in successfully! Redirecting...');
            const targetUrl = res.data.redirect_url || (res.data.is_admin ? '/admin/home' : '/dashboard');
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800);
        } catch (err) {
            setLoading(false);
            setErrorMsg(err.response?.data?.message || 'Verification failed. Please check the code.');
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to your account with password or Email OTP">
            <Head title="Sign In" />

            {/* Mode Selector Tabs */}
            <div className="d-flex p-1 bg-light rounded-3 mb-4 border">
                <button
                    type="button"
                    className={`btn flex-fill py-2 fw-semibold border-0 ${
                        authMode === 'password' ? 'btn-white shadow-sm text-primary' : 'text-muted'
                    }`}
                    style={{ backgroundColor: authMode === 'password' ? '#fff' : 'transparent' }}
                    onClick={() => handleSwitchMode('password')}
                >
                    <i className="bi bi-key-fill me-1"></i> Password Login
                </button>
                <button
                    type="button"
                    className={`btn flex-fill py-2 fw-semibold border-0 ${
                        authMode === 'email_otp' ? 'btn-white shadow-sm text-primary' : 'text-muted'
                    }`}
                    style={{ backgroundColor: authMode === 'email_otp' ? '#fff' : 'transparent' }}
                    onClick={() => handleSwitchMode('email_otp')}
                >
                    <i className="bi bi-envelope-check-fill me-1"></i> Email OTP Login
                </button>
            </div>

            {successMsg && (
                <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2 fs-5 flex-shrink-0"></i>
                    <div>{successMsg}</div>
                </div>
            )}

            {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5 flex-shrink-0"></i>
                    <div>{errorMsg}</div>
                </div>
            )}

            {/* PASSWORD LOGIN TAB */}
            {authMode === 'password' && (
                <form onSubmit={handlePasswordSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="user_mobile" className="form-label fw-semibold">
                            Email or Mobile Number <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-person-badge"></i>
                            </span>
                            <input
                                type="text"
                                id="user_mobile"
                                className={`form-control ${errors.user_mobile ? 'is-invalid' : ''}`}
                                placeholder="Enter email or 10-digit mobile"
                                value={pwdForm.user_mobile}
                                onChange={(e) => setPwdForm({ ...pwdForm, user_mobile: e.target.value })}
                                required
                            />
                            {errors.user_mobile && (
                                <div className="invalid-feedback">{errors.user_mobile[0]}</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <label htmlFor="user_password" className="form-label fw-semibold mb-0">
                                Password <span className="text-danger">*</span>
                            </label>
                            <Link href="/forgotpassword" className="text-decoration-none small text-primary fw-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="input-group mt-2">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="user_password"
                                className={`form-control ${errors.user_password ? 'is-invalid' : ''}`}
                                placeholder="Enter your password"
                                value={pwdForm.user_password}
                                onChange={(e) => setPwdForm({ ...pwdForm, user_password: e.target.value })}
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
                            {errors.user_password && (
                                <div className="invalid-feedback">{errors.user_password[0]}</div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberme"
                            checked={pwdForm.rememberme}
                            onChange={(e) => setPwdForm({ ...pwdForm, rememberme: e.target.checked })}
                        />
                        <label className="form-check-label text-muted small" htmlFor="rememberme">
                            Remember me on this device
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing In...
                            </>
                        ) : (
                            'Sign In with Password'
                        )}
                    </button>
                </form>
            )}

            {/* EMAIL OTP LOGIN TAB */}
            {authMode === 'email_otp' && (
                <div>
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} noValidate>
                            <div className="mb-4">
                                <label htmlFor="otpEmail" className="form-label fw-semibold">
                                    Registered Email Address <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        id="otpEmail"
                                        className="form-control"
                                        placeholder="Enter your registered email"
                                        value={otpEmail}
                                        onChange={(e) => setOtpEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-text small text-muted mt-2">
                                    We'll email you a secure 6-digit verification code to sign in instantly without a password.
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-semibold"
                                disabled={loading || !otpEmail}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending Code...
                                    </>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} noValidate>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label htmlFor="otpCode" className="form-label fw-semibold mb-0">
                                        6-Digit Verification Code <span className="text-danger">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setOtpSent(false); setOtpCode(''); }}
                                        className="btn btn-link p-0 text-decoration-none small text-muted"
                                    >
                                        Change Email
                                    </button>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <i className="bi bi-shield-check"></i>
                                    </span>
                                    <input
                                        type="text"
                                        id="otpCode"
                                        maxLength="6"
                                        className="form-control text-center fs-4 fw-bold letter-spacing-2"
                                        style={{ letterSpacing: '6px' }}
                                        placeholder="000000"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <span className="small text-muted">Sent to: <strong>{otpEmail}</strong></span>
                                    {cooldown > 0 ? (
                                        <span className="small text-muted">
                                            Resend in <strong>{cooldown}s</strong>
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="btn btn-link p-0 text-decoration-none small fw-semibold text-primary"
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="otpRemember"
                                    checked={otpRemember}
                                    onChange={(e) => setOtpRemember(e.target.checked)}
                                />
                                <label className="form-check-label text-muted small" htmlFor="otpRemember">
                                    Remember me on this device
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-semibold mb-2"
                                disabled={loading || otpCode.length !== 6}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Sign In'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Bottom Links */}
            <div className="text-center mt-4 pt-2 border-top">
                <p className="text-muted small mb-0">
                    Don't have an account?{' '}
                    <Link href="/register" className="fw-semibold text-primary text-decoration-none">
                        Create Account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
