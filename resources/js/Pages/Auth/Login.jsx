import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import axios from 'axios';

export default function Login() {
    const [form, setForm] = useState({
        user_mobile: '',
        user_password: '',
        rememberme: false,
    });
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await axios.post('/LoginPost', form);
            setSuccessMsg(res.data.message || 'Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else if (err.response?.status === 400) {
                setErrorMsg(err.response.data.message || 'Invalid credentials');
            } else {
                setErrorMsg('Something went wrong. Please check your credentials and try again.');
            }
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to continue to your account">
            <Head title="Sign In" />

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

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="user_mobile" className="form-label fw-semibold">
                        Mobile Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-phone"></i>
                        </span>
                        <input
                            type="text"
                            id="user_mobile"
                            className={`form-control ${errors.user_mobile ? 'is-invalid' : ''}`}
                            placeholder="Enter 10-digit mobile number"
                            value={form.user_mobile}
                            onChange={(e) => setForm({ ...form, user_mobile: e.target.value })}
                            required
                        />
                        {errors.user_mobile && (
                            <div className="invalid-feedback">{errors.user_mobile[0]}</div>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <label htmlFor="user_password" className="form-label fw-semibold">
                            Password <span className="text-danger">*</span>
                        </label>
                        <Link href="/forgotpassword" className="text-decoration-none small text-primary">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <i className="bi bi-lock"></i>
                        </span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="user_password"
                            className={`form-control ${errors.user_password ? 'is-invalid' : ''}`}
                            placeholder="Enter password"
                            value={form.user_password}
                            onChange={(e) => setForm({ ...form, user_password: e.target.value })}
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
                        checked={form.rememberme}
                        onChange={(e) => setForm({ ...form, rememberme: e.target.checked })}
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
                        'Sign In'
                    )}
                </button>

                <div className="text-center mt-4 pt-2 border-top">
                    <p className="text-muted small mb-0">
                        Don't have an account?{' '}
                        <Link href="/register" className="fw-semibold text-primary text-decoration-none">
                            Create Account
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
