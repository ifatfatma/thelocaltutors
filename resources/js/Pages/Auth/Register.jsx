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
        verification_mode: 'mobile_otp', // 'mobile_otp' | 'instant'
    });
    const [showPassword, setShowPassword] = useState(false);

    // Mobile OTP Step State
    const [otp, setOtp] = useState({
        first: '',
        second: '',
        third: '',
        fourth: '',
    });
    const [maskedMobile, setMaskedMobile] = useState('');
    const [cooldown, setCooldown] = useState(0);

    // Status states
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // OTP Input Refs
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

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

    // 1. Submit Registration Form
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
                setMaskedMobile(res.data.masked_mobile || form.mobile);
                setSuccessMsg(res.data.message || 'Verification code sent to your mobile.');
                setCooldown(60);
                setStep('otp');
                setTimeout(() => {
                    if (inputRefs[0].current) inputRefs[0].current.focus();
                }, 100);
            } else {
                setSuccessMsg(res.data.message || 'Account created successfully! Redirecting...');
                const targetUrl = res.data.redirect_url || '/dashboard';
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 800);
            }
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrorMsg(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
            }
        }
    };

    // 2. Handle 4-Digit OTP Input Change
    const handleOtpChange = (index, value) => {
        const cleanVal = value.replace(/\D/g, '').slice(-1);
        const keys = ['first', 'second', 'third', 'fourth'];
        const updated = { ...otp, [keys[index]]: cleanVal };
        setOtp(updated);

        // Auto-advance to next input
        if (cleanVal && index < 3 && inputRefs[index + 1].current) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        const keys = ['first', 'second', 'third', 'fourth'];
        if (e.key === 'Backspace' && !otp[keys[index]] && index > 0 && inputRefs[index - 1].current) {
            inputRefs[index - 1].current.focus();
        }
    };

    // 3. Verify Mobile OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = `${otp.first}${otp.second}${otp.third}${otp.fourth}`;
        if (fullOtp.length !== 4) {
            setErrorMsg('Please enter the complete 4-digit verification code.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/RegisterPostOtp', {
                ...otp,
                mobile: form.mobile,
            });
            setSuccessMsg(res.data.message || 'Mobile number verified successfully! Redirecting...');
            const targetUrl = res.data.redirect_url || '/dashboard';
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800);
        } catch (err) {
            setLoading(false);
            setErrorMsg(err.response?.data?.message || 'Invalid verification code. Please try again.');
        }
    };

    // 4. Resend Mobile OTP
    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await axios.post('/auth/register-mobile-otp/resend', {
                mobile: form.mobile,
            });
            setLoading(false);
            setCooldown(60);
            setSuccessMsg(res.data.message || 'A new verification code has been sent to your mobile.');
        } catch (err) {
            setLoading(false);
            setErrorMsg(err.response?.data?.message || 'Failed to resend code. Please try again.');
        }
    };

    return (
        <AuthLayout
            title={step === 'form' ? 'Create an Account' : 'Verify Mobile Number'}
            subtitle={
                step === 'form'
                    ? 'Join The Local Tutors as a student, parent, or educator'
                    : `Enter the 4-digit code sent via SMS to ${maskedMobile || form.mobile}`
            }
        >
            <Head title={step === 'form' ? 'Register' : 'Verify Mobile OTP'} />

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

                    {/* Sign Up Option: Mobile OTP vs Instant */}
                    <div className="mb-4 p-3 bg-light rounded-3 border">
                        <label className="form-label fw-semibold small mb-2 d-flex align-items-center">
                            <i className="bi bi-shield-check text-primary me-2"></i> Verification Option:
                        </label>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className={`btn btn-sm flex-fill py-2 fw-semibold ${
                                    form.verification_mode === 'mobile_otp' ? 'btn-primary' : 'btn-outline-secondary'
                                }`}
                                onClick={() => setForm({ ...form, verification_mode: 'mobile_otp' })}
                            >
                                <i className="bi bi-phone me-1"></i> Mobile OTP Sign Up
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm flex-fill py-2 fw-semibold ${
                                    form.verification_mode === 'instant' ? 'btn-primary' : 'btn-outline-secondary'
                                }`}
                                onClick={() => setForm({ ...form, verification_mode: 'instant' })}
                            >
                                <i className="bi bi-lightning-charge me-1"></i> Instant Sign Up
                            </button>
                        </div>
                        <div className="form-text small text-muted mt-2">
                            {form.verification_mode === 'mobile_otp'
                                ? 'A 4-digit OTP will be sent to your mobile number via SMS to verify.'
                                : 'Instantly activate and sign into your account without waiting for SMS.'}
                        </div>
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
                                {form.verification_mode === 'mobile_otp' ? 'Sending Mobile OTP...' : 'Creating Account...'}
                            </>
                        ) : form.verification_mode === 'mobile_otp' ? (
                            'Sign Up with Mobile OTP'
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
            ) : (
                /* STEP 2: MOBILE OTP VERIFICATION */
                <form onSubmit={handleVerifyOtp} noValidate>
                    <div className="text-center mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
                            style={{ width: '60px', height: '60px' }}
                        >
                            <i className="bi bi-phone-vibrate fs-2"></i>
                        </div>
                        <h6 className="fw-bold mb-1">Enter Verification Code</h6>
                        <p className="text-muted small mb-0">
                            We've sent a 4-digit code to <strong>{maskedMobile || form.mobile}</strong>
                        </p>
                    </div>

                    {/* 4-digit individual boxes */}
                    <div className="d-flex justify-content-center gap-2 mb-4">
                        {[0, 1, 2, 3].map((index) => {
                            const keys = ['first', 'second', 'third', 'fourth'];
                            return (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    maxLength="1"
                                    className="form-control text-center fs-3 fw-bold"
                                    style={{ width: '56px', height: '60px' }}
                                    value={otp[keys[index]]}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    autoFocus={index === 0}
                                />
                            );
                        })}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                        disabled={loading || `${otp.first}${otp.second}${otp.third}${otp.fourth}`.length !== 4}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Verifying...
                            </>
                        ) : (
                            'Verify & Complete Sign Up'
                        )}
                    </button>

                    <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <button
                            type="button"
                            onClick={() => { setStep('form'); setErrorMsg(''); setSuccessMsg(''); }}
                            className="btn btn-link p-0 text-decoration-none text-muted small"
                        >
                            <i className="bi bi-arrow-left me-1"></i> Edit Details
                        </button>

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
                                Resend Code
                            </button>
                        )}
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
