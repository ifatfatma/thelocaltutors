import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function ChangePassword() {
    const [form, setForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [errors, setErrors] = useState({});
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setStatusMsg({ type: '', text: '' });

        try {
            const res = await axios.post('/ChangePasswordPost', form);
            setStatusMsg({ type: 'success', text: res.data.message || 'Password changed successfully!' });
            setForm({ current_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            if (err.response?.status === 422) {
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else if (err.response.data.message) {
                    setStatusMsg({ type: 'danger', text: err.response.data.message });
                }
            } else {
                setStatusMsg({ type: 'danger', text: 'Failed to change password. Please check your inputs.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <FrontLayout>
            <Head title="Change Password" />

            <div className="bg-primary text-white py-4">
                <div className="container">
                    <h2 className="fw-bold mb-1">Change Password</h2>
                    <p className="text-white-50 mb-0">Ensure your account is using a long, random password</p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                            {statusMsg.text && (
                                <div className={`alert alert-${statusMsg.type} mb-4`}>
                                    {statusMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Current Password *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                                        value={form.current_password}
                                        onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                                        required
                                    />
                                    {errors.current_password && (
                                        <div className="invalid-feedback">{errors.current_password[0]}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">New Password *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                                        value={form.new_password}
                                        onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                                        required
                                    />
                                    {errors.new_password && (
                                        <div className="invalid-feedback">{errors.new_password[0]}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Confirm New Password *</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                                        value={form.confirm_password}
                                        onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                                        required
                                    />
                                    {errors.confirm_password && (
                                        <div className="invalid-feedback">{errors.confirm_password[0]}</div>
                                    )}
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 py-2 fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <Link href="/dashboard" className="btn btn-outline-secondary px-4 py-2">
                                        Dashboard
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
