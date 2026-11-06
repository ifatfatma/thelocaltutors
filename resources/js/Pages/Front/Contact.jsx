import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import FrontLayout from '../../Layouts/FrontLayout';
import axios from 'axios';

export default function Contact() {
    const { settings } = usePage().props;
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            const res = await axios.post('/contactpost', form);
            if (res.data.status === 200) {
                setSuccessMsg(res.data.message || 'Your message has been sent successfully!');
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                setErrorMsg(res.data.message || 'Failed to send message.');
            }
        } catch (err) {
            setErrorMsg('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FrontLayout>
            <Head title="Contact Us" />

            <div className="bg-primary text-white py-5">
                <div className="container text-center">
                    <h1 className="fw-bold mb-2">Contact Us</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link href="/" className="text-white-50 text-decoration-none">Home</Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">Contact Us</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container py-5">
                <div className="row gy-5">
                    {/* Left: Contact Info */}
                    <div className="col-lg-5">
                        <span className="badge bg-primary-subtle text-primary fw-bold mb-2">Get In Touch</span>
                        <h2 className="fw-bold text-dark mb-4">We'd Love to Hear From You</h2>
                        <p className="text-muted mb-4">
                            Have questions about our tutors, coaching courses, or need help getting started?
                            Reach out to our team anytime.
                        </p>

                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-start gap-3">
                                <div className="btn btn-primary rounded-circle p-2 text-white flex-shrink-0">
                                    <i className="bi bi-geo-alt fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Our Location</h6>
                                    <p className="text-muted small mb-0">{settings?.address || 'Local Tutoring Center, India'}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start gap-3">
                                <div className="btn btn-primary rounded-circle p-2 text-white flex-shrink-0">
                                    <i className="bi bi-telephone fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Call Us</h6>
                                    <p className="text-muted small mb-0">{settings?.mobile || '+91 98765 43210'}</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start gap-3">
                                <div className="btn btn-primary rounded-circle p-2 text-white flex-shrink-0">
                                    <i className="bi bi-envelope fs-5"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Email Us</h6>
                                    <p className="text-muted small mb-0">{settings?.email || 'support@thelocaltutors.com'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                            <h4 className="fw-bold mb-4">Send Us a Message</h4>

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

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Your Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Your Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="name@example.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Phone Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your mobile number"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Message *</label>
                                        <textarea
                                            rows="5"
                                            className="form-control"
                                            placeholder="Write your query or message here..."
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 py-2 fw-semibold"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
}
