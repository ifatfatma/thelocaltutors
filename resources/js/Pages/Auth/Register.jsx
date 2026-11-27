import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import axios from 'axios';

export default function Register() {
    // Current step: 'form' | 'otp'
    const [step, setStep] = useState('form');

    // Registration Form State
    const [form, setForm] = useState({
        usertype: 'student',
        name: '',
        email: '',
        mobile: '',
        password: '',
        terms: true,
    });
    const [showPassword, setShowPassword] = useState(false);

    // 6-Digit Email OTP Step State
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [maskedEmail, setMaskedEmail] = useState('');
    const [cooldown, setCooldown] = useState(0);

    // Status states
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // 6 OTP Input Refs
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

    // Geolocation capture
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

    // Cooldown countdown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // 1. Submit Registration Form -> Sends mandatory 6-digit Email OTP
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
            setLoading(false);

            if (res.data.otp_sent) {
                setMaskedEmail(res.data.masked_email || form.email);
                setSuccessMsg(res.data.message || 'A 6-digit verification code has been sent to your email.');
                setCooldown(res.data.cooldown || 60);
                setOtpDigits(['', '', '', '', '', '']);
                setStep('otp');
                setTimeout(() => {
                    if (inputRefs[0].current) inputRefs[0].current.focus();
                }, 100);
            } else {
                setSuccessMsg(res.data.message || 'Account created! Please verify your email.');
            }
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                if (err.response.data.message && !err.response.data.errors) {
                    setErrorMsg(err.response.data.message);
                }
            } else {
                setErrorMsg(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
            }
        }
    };

    // 2. Handle 6-Digit Email OTP Input Change & Paste
    const handleOtpChange = (index, value) => {
        const cleanDigits = value.replace(/\D/g, '');
        if (!cleanDigits) {
            const updated = [...otpDigits];
            updated[index] = '';
            setOtpDigits(updated);
            return;
        }

        // Support pasting full 6-digit code
        if (cleanDigits.length > 1) {
            const pasted = cleanDigits.slice(0, 6).split('');
            const updated = ['', '', '', '', '', ''];
            pasted.forEach((d, idx) => {
                updated[idx] = d;
            });
            setOtpDigits(updated);
            const focusIdx = Math.min(pasted.length, 5);
            if (inputRefs[focusIdx].current) inputRefs[focusIdx].current.focus();
            return;
        }

        const updated = [...otpDigits];
        updated[index] = cleanDigits;
        setOtpDigits(updated);

        if (index < 5 && inputRefs[index + 1].current) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && inputRefs[index - 1].current) {
            inputRefs[index - 1].current.focus();
        }
    };

    // 3. Verify 6-Digit Email OTP -> Activates account and redirects to Sign In
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otpDigits.join('');
        if (fullOtp.length !== 6) {
            setErrorMsg('Please enter the complete 6-digit verification code.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/RegisterPostOtp', {
                email: form.email,
                otp: fullOtp,
            });
            setSuccessMsg(res.data.message || 'Email verified successfully! Redirecting to sign in...');
            const targetUrl = res.data.redirect_url || '/login';
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1200);
        } catch (err) {
            setLoading(false);
            setErrorMsg(err.response?.data?.message || 'Invalid or expired verification code. Please try again.');
        }
    };

    // 4. Resend 6-Digit Email OTP
    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            const res = await axios.post('/auth/register-email-otp/resend', {
                email: form.email,
            });
            setLoading(false);
            setCooldown(res.data.cooldown || 60);
            setSuccessMsg(res.data.message || 'A new 6-digit verification code has been sent to your email.');
        } catch (err) {
            setLoading(false);
            if (err.response?.data?.cooldown) {
                setCooldown(err.response.data.cooldown);
            }
            setErrorMsg(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
        }
    };

    const fullOtpValue = otpDigits.join('');

    return (
        <AuthLayout
            title={step === 'form' ? 'Create an Account' : 'Verify Your Email'}
            subtitle={
                step === 'form'
                    ? 'Join The Local Tutors as a student, parent, or educator'
                    : `Enter the 6-digit verification code sent to ${maskedEmail || form.email}`
            }
        >
            <Head title={step === 'form' ? 'Register' : 'Verify Email OTP'} />

            {successMsg && (
                <div className="alert alert-success d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill me-2 fs-5 flex-shrink-0"></i>
                    <div>{successMsg}</div>
                </div>
            )}

            {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5 flex-shrink-0"></i>
                    <div>{errorMsg}</div>
                </div>
            )}

            {/* STEP 1: REGISTRATION FORM */}
            {step === 'form' ? (
                <form onSubmit={handleRegister} noValidate>
                    {/* Role Selector */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">
                            I want to join as: <span className="text-danger">*</span>
                        </label>
                        <div className="row g-2 align-items-stretch">
                            <div className="col-6 d-flex">
                                <button
                                    type="button"
                                    className={`btn w-100 h-100 py-2 px-2 d-flex align-items-center justify-content-center gap-2 text-nowrap ${
                                        form.usertype === 'student' ? 'btn-primary' : 'btn-outline-secondary'
                                    }`}
                                    style={{ minHeight: '42px', fontSize: '0.92rem' }}
                                    onClick={() => setForm({ ...form, usertype: 'student' })}
                                >
                                    <i className="bi bi-mortarboard-fill flex-shrink-0"></i>
                                    <span>Student</span>
                                </button>
                            </div>
                            <div className="col-6 d-flex">
                                <button
                                    type="button"
                                    className={`btn w-100 h-100 py-2 px-2 d-flex align-items-center justify-content-center gap-2 text-nowrap ${
                                        form.usertype === 'teacher' ? 'btn-primary' : 'btn-outline-secondary'
                                    }`}
                                    style={{ minHeight: '42px', fontSize: '0.92rem' }}
                                    onClick={() => setForm({ ...form, usertype: 'teacher' })}
                                >
                                    <i className="bi bi-person-video3 flex-shrink-0"></i>
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
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
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
                                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                placeholder="10-digit mobile number"
                                value={form.mobile}
                                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
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
                                placeholder="Minimum 6 characters"
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

                    {/* Email OTP Notice */}
                    <div className="mb-3 p-2 px-3 bg-primary-subtle bg-opacity-50 border border-primary-subtle rounded-3 small text-primary-emphasis d-flex align-items-center gap-2">
                        <i className="bi bi-envelope-check-fill text-primary flex-shrink-0"></i>
                        <span>A 6-digit verification OTP will be sent to your email address to activate your account.</span>
                    </div>

                    {/* Terms */}
                    <div className="mb-4 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="terms"
                            checked={form.terms}
                            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                        />
                        <label className="form-check-label text-muted small" htmlFor="terms">
                            I agree to the <a href="/about" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">Terms of Service</a> &amp; <a href="/about" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">Privacy Policy</a>
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
                                Sending Email OTP...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-envelope-check me-2"></i>
                                Sign Up &amp; Verify Email
                            </>
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
            ) : (
                /* STEP 2: MANDATORY 6-DIGIT EMAIL OTP VERIFICATION */
                <form onSubmit={handleVerifyOtp} noValidate>
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
                            style={{ width: '60px', height: '60px' }}
                        >
                            <i className="bi bi-envelope-check fs-2"></i>
                        </div>
                        <h6 className="fw-bold mb-1">Enter Email Verification Code</h6>
                        <p className="text-muted small mb-0">
                            We&apos;ve sent a 6-digit OTP to <strong>{maskedEmail || form.email}</strong>
                        </p>
                    </div>

                    {/* 6-digit individual boxes */}
                    <div className="d-flex justify-content-center gap-2 mb-4">
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                className="form-control text-center fs-4 fw-bold px-0"
                                style={{ width: '46px', height: '54px' }}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                        disabled={loading || fullOtpValue.length !== 6}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Verifying Email...
                            </>
                        ) : (
                            'Verify Email & Activate Account'
                        )}
                    </button>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <Link
                            href="/login"
                            className="btn btn-link p-0 text-decoration-none text-muted small"
                        >
                            <i className="bi bi-arrow-left me-1"></i> Back to Sign In
                        </Link>

                        {cooldown > 0 ? (
                            <span className="small text-muted">
                                Resend in <strong>{cooldown}s</strong>
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={loading}
                                className="btn btn-link p-0 text-decoration-none small fw-semibold text-primary"
                            >
                                Resend Email OTP
                            </button>
                        )}
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
