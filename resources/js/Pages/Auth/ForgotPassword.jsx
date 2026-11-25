import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import axios from 'axios';

export default function ForgotPassword() {
    // Steps: 'request' | 'reset' | 'completed'
    const [step, setStep] = useState('request');

    // Form inputs
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // States
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // 1. Send OTP to registered email
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!email) {
            setErrorMsg('Please enter your registered email address.');
            return;
        }

        setLoading(true);
        setErrors({});
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/auth/forgot-password/send-otp', { email });
            setLoading(false);
            setSuccessMsg(res.data.message || 'A 6-digit reset code has been sent to your email.');
            setCooldown(res.data.cooldown || 60);
            setStep('reset');
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 429) {
                setCooldown(err.response.data.cooldown || 30);
                setErrorMsg(err.response.data.message);
            } else if (err.response?.status === 404) {
                setErrorMsg('No registered account was found with this email address.');
            } else {
                setErrorMsg(err.response?.data?.message || 'Failed to send reset code. Please try again.');
            }
        }
    };

    // 2. Submit new password with OTP
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setErrorMsg('');
        setSuccessMsg('');

        if (password !== passwordConfirmation) {
            setLoading(false);
            setErrorMsg('Passwords do not match. Please re-enter.');
            return;
        }

        try {
            const payload = {
                email,
                otp,
                password,
                password_confirmation: passwordConfirmation,
            };
            const res = await axios.post('/auth/forgot-password/reset', payload);
            setLoading(false);
            setSuccessMsg(res.data.message || 'Your password has been reset successfully!');
            setStep('completed');
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                setErrorMsg(err.response.data.message || 'Please fix the errors below.');
            } else {
                setErrorMsg(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
            }
        }
    };

    return (
        <AuthLayout
            title={
                step === 'completed'
                    ? 'Password Updated'
                    : step === 'reset'
                    ? 'Create New Password'
                    : 'Forgot Password'
            }
            subtitle={
                step === 'completed'
                    ? 'Your account password has been changed successfully'
                    : step === 'reset'
                    ? 'Enter the 6-digit code sent to your email and set a new password'
                    : 'Enter your registered email to receive a password reset code'
            }
        >
            <Head title="Reset Password" />

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

            {/* STEP 1: Enter email to request OTP */}
            {step === 'request' && (
                <form onSubmit={handleSendOtp} noValidate>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-semibold">
                            Registered Email Address <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="e.g. name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-text small text-muted mt-2">
                            We will send a 6-digit verification code to this email to reset your password.
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        disabled={loading || !email}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending Reset Code...
                            </>
                        ) : (
                            'Send Verification Code'
                        )}
                    </button>

                    <div className="text-center mt-4 pt-2 border-top">
                        <Link href="/login" className="text-decoration-none text-muted small fw-medium">
                            <i className="bi bi-arrow-left me-1"></i>Back to Sign In
                        </Link>
                    </div>
                </form>
            )}

            {/* STEP 2: Enter OTP + New Password */}
            {step === 'reset' && (
                <form onSubmit={handleResetPassword} noValidate>
                    {/* OTP input */}
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label htmlFor="otp" className="form-label fw-semibold mb-0">
                                6-Digit Verification Code <span className="text-danger">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => { setStep('request'); setOtp(''); }}
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
                                id="otp"
                                maxLength="6"
                                className={`form-control text-center fs-4 fw-bold ${errors.otp ? 'is-invalid' : ''}`}
                                style={{ letterSpacing: '6px' }}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                                autoFocus
                            />
                            {errors.otp && <div className="invalid-feedback">{errors.otp[0]}</div>}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <span className="small text-muted">Sent to: <strong>{email}</strong></span>
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

                    {/* New Password */}
                    <div className="mb-3">
                        <label htmlFor="new_password" className="form-label fw-semibold">
                            New Password <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="new_password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                    {/* Confirm New Password */}
                    <div className="mb-4">
                        <label htmlFor="confirm_password" className="form-label fw-semibold">
                            Confirm New Password <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-white">
                                <i className="bi bi-lock-fill"></i>
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirm_password"
                                className="form-control"
                                placeholder="Re-enter new password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold mb-2"
                        disabled={loading || otp.length !== 6 || !password || !passwordConfirmation}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Resetting Password...
                            </>
                        ) : (
                            'Set New Password'
                        )}
                    </button>

                    <div className="text-center mt-3">
                        <button
                            type="button"
                            onClick={() => setStep('request')}
                            className="btn btn-link text-decoration-none text-muted small"
                        >
                            <i className="bi bi-arrow-left me-1"></i>Back to Email Input
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3: Completed confirmation */}
            {step === 'completed' && (
                <div className="text-center py-3">
                    <div className="mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle"
                            style={{ width: '70px', height: '70px' }}
                        >
                            <i className="bi bi-shield-check fs-1"></i>
                        </div>
                    </div>
                    <h5 className="fw-bold mb-2">Password Successfully Reset</h5>
                    <p className="text-muted small mb-4">
                        You can now sign in to your account with your new password.
                    </p>
                    <Link href="/login" className="btn btn-primary px-4 py-2 fw-semibold w-100">
                        Sign In Now
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}
