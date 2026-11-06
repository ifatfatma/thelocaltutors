import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import axios from 'axios';

export default function Register() {
    const [step, setStep] = useState('register'); // 'register' or 'otp'
    const [form, setForm] = useState({
        usertype: 'student',
        name: '',
        mobile: '',
        password: '',
        terms: true,
    });
    const [otpForm, setOtpForm] = useState({
        first: '',
        second: '',
        third: '',
        fourth: '',
    });
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/RegisterPost', form);
            setSuccessMsg(res.data.message || 'OTP sent to your mobile number.');
            setStep('otp');
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrorMsg(err.response?.data?.message || 'Registration failed. Please check your data.');
            }
        }
    };

    const handleOtpChange = (field, value, nextFieldId) => {
        setOtpForm({ ...otpForm, [field]: value });
        if (value && nextFieldId) {
            const nextEl = document.getElementById(nextFieldId);
            if (nextEl) nextEl.focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await axios.post('/RegisterPostOtp', otpForm);
            if (res.data.code === 200) {
                setSuccessMsg('Account verified successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                setLoading(false);
                setErrorMsg(res.data.message || 'Invalid OTP');
            }
        } catch (err) {
            setLoading(false);
            setErrorMsg(err.response?.data?.message || 'Verification failed. Please check the code.');
        }
    };

    return (
        <AuthLayout
            title={step === 'register' ? 'Create an Account' : 'Verify Mobile OTP'}
            subtitle={
                step === 'register'
                    ? 'Join as a student, guardian, or teacher'
                    : 'Enter the 4-digit code sent to your mobile'
            }
        >
            <Head title={step === 'register' ? 'Register' : 'Verify OTP'} />

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

            {step === 'register' ? (
                <form onSubmit={handleRegister} noValidate>
                    <div className="mb-3">
                        <label htmlFor="usertype" className="form-label fw-semibold">
                            I want to join as: <span className="text-danger">*</span>
                        </label>
                        <select
                            id="usertype"
                            className={`form-select ${errors.usertype ? 'is-invalid' : ''}`}
                            value={form.usertype}
                            onChange={(e) => setForm({ ...form, usertype: e.target.value })}
                        >
                            <option value="student">Student</option>
                            <option value="gaurdian">Guardian / Parent</option>
                            <option value="teacher">Teacher / Tutor</option>
                        </select>
                        {errors.usertype && <div className="invalid-feedback">{errors.usertype[0]}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">
                            Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mobile" className="form-label fw-semibold">
                            Mobile Number <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            id="mobile"
                            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                            placeholder="10-digit mobile number"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            required
                        />
                        {errors.mobile && <div className="invalid-feedback">{errors.mobile[0]}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">
                            Password <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Create a secure password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                    </div>

                    <div className="mb-4 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="terms"
                            checked={form.terms}
                            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                        />
                        <label className="form-check-label text-muted small" htmlFor="terms">
                            I agree to the terms and privacy policy
                        </label>
                        {errors.terms && <div className="text-danger small">{errors.terms[0]}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
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
                <form onSubmit={handleVerifyOtp} noValidate>
                    <div className="d-flex justify-content-center gap-2 mb-4">
                        <input
                            id="otp1"
                            type="text"
                            maxLength="1"
                            className="form-control text-center fs-4 fw-bold"
                            style={{ width: '50px', height: '55px' }}
                            value={otpForm.first}
                            onChange={(e) => handleOtpChange('first', e.target.value, 'otp2')}
                            autoFocus
                        />
                        <input
                            id="otp2"
                            type="text"
                            maxLength="1"
                            className="form-control text-center fs-4 fw-bold"
                            style={{ width: '50px', height: '55px' }}
                            value={otpForm.second}
                            onChange={(e) => handleOtpChange('second', e.target.value, 'otp3')}
                        />
                        <input
                            id="otp3"
                            type="text"
                            maxLength="1"
                            className="form-control text-center fs-4 fw-bold"
                            style={{ width: '50px', height: '55px' }}
                            value={otpForm.third}
                            onChange={(e) => handleOtpChange('third', e.target.value, 'otp4')}
                        />
                        <input
                            id="otp4"
                            type="text"
                            maxLength="1"
                            className="form-control text-center fs-4 fw-bold"
                            style={{ width: '50px', height: '55px' }}
                            value={otpForm.fourth}
                            onChange={(e) => handleOtpChange('fourth', e.target.value, null)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Validate OTP'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setStep('register')}
                            className="btn btn-link text-decoration-none text-muted small"
                        >
                            <i className="bi bi-arrow-left me-1"></i>Back to Registration
                        </button>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
